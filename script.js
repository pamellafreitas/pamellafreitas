document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar-custom");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const menuCollapse = document.getElementById("menuSite");

  let lastScrollY = window.scrollY;
  const offset = 130;

  // Bootstrap Collapse
  const bsCollapse = new bootstrap.Collapse(menuCollapse, {
    toggle: false
  });

  /* ===== FECHA MENU AO CLICAR NO LINK (MOBILE) ===== */
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      // ativa no clique
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      if (window.innerWidth < 992) {
        bsCollapse.hide();
      }
    });
  });

  /* ===== MENU SOME / APARECE NO SCROLL ===== */
  window.addEventListener("scroll", () => {
    if (menuCollapse.classList.contains("show")) return;

    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollY && currentScroll > 120) {
      navbar.classList.add("navbar-hidden");
    } else {
      navbar.classList.remove("navbar-hidden");
    }

    lastScrollY = currentScroll;

    // ===== ATIVA LINK PELO SCROLL =====
    let currentSection = "";

    sections.forEach(section => {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
});















