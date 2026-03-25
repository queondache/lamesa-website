/* ============================================================
   La Mesa – Creative Lab · Barcelona
   Main JavaScript — Vanilla ES6+
   ============================================================ */

/* ============================================================
   1. NAVBAR — Scroll shadow & hamburger menu
   ============================================================ */
(function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');

  if (!navbar) return;

  // Add shadow on scroll
  const onScroll = () => {
    if (window.scrollY > 8) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close mobile menu when a link is clicked
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   2. FADE-IN ON SCROLL — IntersectionObserver
   ============================================================ */
(function initFadeIn() {
  // Check for reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // skip animations if user prefers reduced motion

  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   3. SMOOTH ANCHOR NAVIGATION
   Handles in-page anchor links with navbar offset
   ============================================================ */
(function initSmoothScroll() {
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '64',
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   4. ACTIVE NAV LINK on scroll
   Highlights the current section link in the navbar
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const navHeight = 80;

  const setActive = () => {
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop - navHeight - 10;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* ============================================================
   5. LAZY LOAD — images with data-src attribute
   Skips images above the fold (no lazy attribute)
   ============================================================ */
(function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imgObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    // Fallback: load all images immediately
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
})();

/* ============================================================
   6. ETSY LINK — placeholder handler
   Prevents empty href navigation, shows a toast message
   ============================================================ */
(function initEtsyLink() {
  const etsyLink = document.getElementById('etsy-link');
  if (!etsyLink) return;

  etsyLink.addEventListener('click', (e) => {
    // If link is still placeholder (#), prevent default and show message
    if (etsyLink.getAttribute('href') === '#') {
      e.preventDefault();
      showToast('¡Tienda Etsy próximamente! Escríbenos por WhatsApp para ver las piezas disponibles.');
    }
  });
})();

/* ============================================================
   7. TOAST NOTIFICATION (lightweight, no library)
   ============================================================ */
function showToast(message, duration = 4000) {
  // Remove existing toast if any
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '96px',
    right: '24px',
    zIndex: '1000',
    background: '#1A1A1A',
    color: '#FFFAEE',
    padding: '14px 20px',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    maxWidth: '300px',
    lineHeight: '1.5',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    animation: 'toast-in 0.25s ease forwards',
  });

  // Inject keyframes once
  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes toast-in {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============================================================
   8. SCROLL-TO-TOP on logo click
   ============================================================ */
(function initLogoScroll() {
  const logo = document.querySelector('.navbar__logo');
  if (!logo) return;

  logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
