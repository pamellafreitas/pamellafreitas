document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const menuCollapse = document.getElementById("menuSite");

  // Bootstrap collapse (mobile)
  const bsCollapse = new bootstrap.Collapse(menuCollapse, {
    toggle: false
  });

  // Fecha menu ao clicar no mobile
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        bsCollapse.hide();
      }
    });
  });

  // Ativa link conforme scroll (OFFSET FIXO)
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
});



