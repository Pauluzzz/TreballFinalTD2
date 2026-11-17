// Ibex Expeditions — comportament de la web
document.addEventListener("DOMContentLoaded", () => {
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
});
