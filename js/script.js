/**
 * Kamal Jetwani – Portfolio Script
 * Features:
 *  - Page loader
 *  - Navbar scroll behavior & active link
 *  - Dark/Light theme toggle (persisted in localStorage)
 *  - Hamburger mobile menu
 *  - Typing effect (Hero section)
 *  - Scroll-triggered AOS animations
 *  - Skill bar animations (IntersectionObserver)
 *  - Contact form validation & submission feedback
 *  - Back-to-top button
 */

/* ─────────────────────────────────────────────────────────── */
/* 1. DOM READY                                                 */
/* ─────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initNavbar();
  initHamburger();
  initTypingEffect();
  initScrollAnimations();
  initSkillBars();
  initContactForm();
  initBackTop();
  initSmoothScroll();
});


/* ─────────────────────────────────────────────────────────── */
/* 2. PAGE LOADER                                               */
/* ─────────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after page assets are ready
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  });

  // Fallback: hide loader after 3 seconds regardless
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 3000);
}


/* ─────────────────────────────────────────────────────────── */
/* 3. DARK / LIGHT THEME TOGGLE                                */
/* ─────────────────────────────────────────────────────────── */
function initTheme() {
  const toggle   = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html     = document.documentElement;

  // Load saved preference or default to 'dark'
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    // Swap icon
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    }
  }
}


/* ─────────────────────────────────────────────────────────── */
/* 4. NAVBAR — SCROLL EFFECTS & ACTIVE LINK                   */
/* ─────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add .scrolled class on scroll
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  // Highlight nav link for visible section
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 100;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}


/* ─────────────────────────────────────────────────────────── */
/* 5. HAMBURGER MOBILE MENU                                    */
/* ─────────────────────────────────────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}


/* ─────────────────────────────────────────────────────────── */
/* 6. TYPING EFFECT — HERO SECTION                            */
/* ─────────────────────────────────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Data Science Student',
    'Data Analytics Enthusiast',
    'ML Model Builder',
    'Python Developer',
    'Problem Solver',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let pause      = false;

  const TYPING_SPEED   = 80;   // ms per char when typing
  const DELETING_SPEED = 45;   // ms per char when deleting
  const PAUSE_AFTER    = 1800; // ms to pause at end of phrase
  const PAUSE_BEFORE   = 400;  // ms pause before start typing

  function type() {
    const phrase  = phrases[phraseIdx];
    const current = phrase.substring(0, charIdx);
    el.textContent = current;

    if (!isDeleting) {
      if (charIdx < phrase.length) {
        charIdx++;
        setTimeout(type, TYPING_SPEED);
      } else {
        // Pause at full phrase
        pause = true;
        setTimeout(() => {
          pause = false;
          isDeleting = true;
          setTimeout(type, DELETING_SPEED);
        }, PAUSE_AFTER);
      }
    } else {
      if (charIdx > 0) {
        charIdx--;
        setTimeout(type, DELETING_SPEED);
      } else {
        isDeleting  = false;
        phraseIdx   = (phraseIdx + 1) % phrases.length;
        setTimeout(type, PAUSE_BEFORE);
      }
    }
  }

  // Start after a brief delay
  setTimeout(type, 600);
}


/* ─────────────────────────────────────────────────────────── */
/* 7. SCROLL-TRIGGERED ANIMATIONS (AOS)                       */
/* ─────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Respect transition-delay from CSS attribute
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────────────────── */
/* 8. SKILL BAR ANIMATIONS                                    */
/* ─────────────────────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar  = entry.target;
        const pct  = bar.getAttribute('data-pct');
        const fill = bar.querySelector('.skill-bar__fill');
        if (fill) {
          // Small delay for cascade effect based on position
          const delay = Array.from(bars).indexOf(bar) * 60;
          setTimeout(() => {
            fill.style.width = `${pct}%`;
          }, delay);
        }
        observer.unobserve(bar);
      }
    });
  }, {
    threshold: 0.4,
  });

  bars.forEach(bar => observer.observe(bar));
}


/* ─────────────────────────────────────────────────────────── */
/* 9. CONTACT FORM                                            */
/* ─────────────────────────────────────────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending (replace with actual backend/EmailJS/FormSpree)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="ph ph-circle-notch"></i> Sending...';

    setTimeout(() => {
      showStatus('✓ Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';

      // Clear status after 5s
      setTimeout(() => clearStatus(), 5000);
    }, 1500);
  });

  function showStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = `form__status ${type}`;
  }

  function clearStatus() {
    if (!status) return;
    status.textContent = '';
    status.className = 'form__status';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


/* ─────────────────────────────────────────────────────────── */
/* 10. BACK TO TOP BUTTON                                     */
/* ─────────────────────────────────────────────────────────── */
function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ─────────────────────────────────────────────────────────── */
/* 11. SMOOTH SCROLL FOR ANCHOR LINKS                         */
/* ─────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH   = document.getElementById('navbar')?.offsetHeight || 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}