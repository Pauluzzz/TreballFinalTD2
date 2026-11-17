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
});
