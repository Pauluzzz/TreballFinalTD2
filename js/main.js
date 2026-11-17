// Ibex Expeditions — comportament de la web
document.addEventListener("DOMContentLoaded", () => {
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

  // Pestanyes dels plans A+ / B / C
  const tabs = document.querySelectorAll(".tab");
  const plans = document.querySelectorAll(".plan");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", t === tab));
      plans.forEach((p) => p.classList.toggle("show", p.id === tab.dataset.target));
    });
  });
});
