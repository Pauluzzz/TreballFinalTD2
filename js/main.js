// Ibex Expeditions — comportament de la web
document.addEventListener("DOMContentLoaded", () => {
  // Refracció real només a navegadors Chromium (Chrome, Edge, Opera, Brave...)
  if (window.chrome) document.documentElement.classList.add("is-chromium");

  // Barra de navegació: transparent a dalt, sòlida en baixar
  const nav = document.getElementById("nav");
  const onScroll = () => nav && nav.classList.toggle("solid", window.scrollY > 40);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // Menú mòbil
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".nav ul");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
  }

  // Aparició en fer scroll
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("visible"));
  }

  // Desplegables amb animació suau
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("details.acc").forEach((d) => {
    const summary = d.querySelector("summary");
    const body = d.querySelector(".acc-body");
    d.classList.toggle("is-open", d.open);
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (d._anim) { d._anim.cancel(); d._anim = null; body.style.overflow = ""; }
      const opening = !d.classList.contains("is-open");
      d.classList.toggle("is-open", opening);
      if (opening) d.open = true;
      if (reduce) { d.open = opening; return; }
      const full = body.scrollHeight;
      const frames = opening
        ? { height: ["0px", full + "px"], opacity: [0, 1] }
        : { height: [body.offsetHeight + "px", "0px"], opacity: [1, 0] };
      body.style.overflow = "hidden";
      d._anim = body.animate(frames, { duration: opening ? 380 : 300, easing: "cubic-bezier(.2,.7,.2,1)" });
      d._anim.onfinish = () => { body.style.overflow = ""; d._anim = null; if (!opening) d.open = false; };
    });
  });

  // Menú: el subratllat segueix la secció que estàs mirant
  const ul = document.querySelector(".nav ul");
  if (ul) {
    const links = [...ul.querySelectorAll("a.link:not(.cta)")];
    const ind = document.createElement("span");
    ind.className = "nav-indicator";
    ul.appendChild(ind);
    ul.classList.add("has-ind");
    const place = (a) => {
      if (!a) { ind.style.opacity = 0; return; }
      const r = a.getBoundingClientRect(), p = ul.getBoundingClientRect();
      ind.style.opacity = 1;
      ind.style.width = r.width + "px";
      ind.style.transform = "translateX(" + (r.left - p.left) + "px)";
    };
    const setActive = (a) => {
      links.forEach((l) => l.classList.toggle("active", l === a));
      place(a);
    };
    const map = links
      .map((a) => ({ a, el: document.getElementById((a.getAttribute("href").split("#")[1] || (a.getAttribute("href") === "index.html" ? "inici" : "")))}))
      .filter((m) => m.el);
    if (map.length && location.pathname.indexOf("dia") === -1) {
      const update = () => {
        const mark = window.innerHeight * 0.4;
        let cur = map[0];
        map.forEach((m) => { if (m.el.getBoundingClientRect().top <= mark) cur = m; });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = map[map.length - 1];
        setActive(cur.a);
      };
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    } else {
      place(links.find((l) => l.classList.contains("active")));
      window.addEventListener("resize", () => place(links.find((l) => l.classList.contains("active"))));
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => place(links.find((l) => l.classList.contains("active"))));
  }
});
