document.addEventListener("DOMContentLoaded", () => {
    // Inicializar ícones Lucide
    lucide.createIcons();

    // ─── NAVEGAÇÃO ────────────────────────────────────────────────
    const siteNav    = document.getElementById('site-nav');
    const hamburger  = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile');
    const navLogoLink = document.getElementById('nav-logo-link');

    // Scroll suave para todos os links [data-nav]
    document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navH = siteNav ? siteNav.offsetHeight : 72;
                    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                closeMobileMenu();
            }
        });
    });

    // Logo → volta ao topo
    if (navLogoLink) {
        navLogoLink.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeMobileMenu();
        });
    }

    // Hamburger toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
        });
    }

    function closeMobileMenu() {
        if (hamburger) hamburger.classList.remove('open');
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        if (mobileMenu) mobileMenu.setAttribute('aria-hidden', 'true');
    }

    // Efeito "scrolled": usa requestAnimationFrame para não bloquear o scroll
    let scrollTicking = false;
    const onScroll = () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                if (siteNav) {
                    siteNav.classList.toggle('scrolled', window.scrollY > 40);
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Link ativo via IntersectionObserver
    const sections = document.querySelectorAll('section[id], .cta[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    const observerOpts = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, observerOpts);

    sections.forEach(sec => sectionObserver.observe(sec));

    // ─── FIM NAVEGAÇÃO ─────────────────────────────────────────────

    // Parallax com requestAnimationFrame para não travar a UI
    const heroWrapper  = document.querySelector('.hero');
    const floatingIcons = document.querySelectorAll('.floating-icon');

    if (window.innerWidth > 992 && heroWrapper && floatingIcons.length > 0) {
        let mouseX = 0, mouseY = 0;
        let rafParallax = null;
        let isMouseInHero = false;

        const applyParallax = () => {
            const x = (window.innerWidth  / 2 - mouseX) / 120;
            const y = (window.innerHeight / 2 - mouseY) / 120;
            floatingIcons.forEach(icon => {
                const speed = parseFloat(icon.getAttribute('data-speed')) || 1;
                icon.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
            rafParallax = null;
        };

        heroWrapper.addEventListener('mousemove', e => {
            mouseX = e.pageX;
            mouseY = e.pageY;
            if (!rafParallax) {
                rafParallax = requestAnimationFrame(applyParallax);
            }
        }, { passive: true });

        heroWrapper.addEventListener('mouseleave', () => {
            isMouseInHero = false;
            if (rafParallax) {
                cancelAnimationFrame(rafParallax);
                rafParallax = null;
            }
            floatingIcons.forEach(icon => {
                icon.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // Accordion FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fecha todos os outros
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    other.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Efeito Flashlight — throttled com requestAnimationFrame
    const flashlightElements = document.querySelectorAll('.has-flashlight');
    flashlightElements.forEach(el => {
        let rafFlash = null;
        el.addEventListener('mousemove', e => {
            if (!rafFlash) {
                rafFlash = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                    rafFlash = null;
                });
            }
        }, { passive: true });
    });

    // Lazy loading para imagens do slider do portfólio
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        lazyImages.forEach(img => imgObserver.observe(img));
    }
});

// ─── LIGHTBOX ────────────────────────────────────────────────
function openLightbox(imageSrc) {
    const lightbox      = document.getElementById('portfolio-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn      = document.getElementById('lightbox-close-btn');

    if (lightbox && lightboxImage) {
        lightbox.classList.add('active');
        if (closeBtn) closeBtn.classList.add('active');
        document.body.style.overflow = 'hidden';

        lightboxImage.classList.remove('loaded');
        lightboxImage.src = imageSrc;

        lightboxImage.onload = () => lightboxImage.classList.add('loaded');
    }
}

function closeLightbox() {
    const lightbox      = document.getElementById('portfolio-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn      = document.getElementById('lightbox-close-btn');

    if (lightbox) {
        lightbox.classList.remove('active');
        if (closeBtn) closeBtn.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            if (lightboxImage) {
                lightboxImage.src = '';
                lightboxImage.classList.remove('loaded');
            }
        }, 300);
    }
}

// Fechar com ESC e click fora
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

document.addEventListener('click', e => {
    const lightbox = document.getElementById('portfolio-lightbox');
    if (e.target === lightbox) closeLightbox();
});

// ─── SLIDERS ────────────────────────────────────────────────
function scrollPortfolio(direction) {
    const track = document.getElementById('portfolio-track');
    if (track) {
        const scrollAmount = window.innerWidth > 768 ? 448 : 318;
        track.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
}

function scrollTestimonials(direction) {
    const track = document.getElementById('testimonials-track');
    if (track) {
        const scrollAmount = window.innerWidth > 768 ? 432 : 332;
        track.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
}
