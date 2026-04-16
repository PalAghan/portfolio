/* =====================================================
   MAIN.JS — Pal Aghan Portfolio
   Handles: hamburger, dark mode, scroll spy
   ===================================================== */


/* ─────────────────────────────────────────
   DARK MODE
   Reads saved preference from localStorage
   BEFORE the page paints to prevent flash.
───────────────────────────────────────── */
const html        = document.documentElement;
const savedTheme  = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark   = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}


/* ─────────────────────────────────────────
   HAMBURGER
───────────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('#nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close on link click (mobile)
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ─────────────────────────────────────────
   SCROLL SPY
   Works on the single-page index.html.
   Nav links now use href="about.html" etc.
   so clicking them navigates to the full page.

   The scroll spy matches each section's id
   to whichever nav link's href *contains*
   that id string.

   e.g. section id="about" ← matches → href="about.html"
        section id="home"  ← matches → href="index.html"

   This means clicking navigates correctly
   AND scrolling still highlights the right
   nav link — best of both worlds.
───────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length) {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id; // e.g. "about"

      navLinks.forEach(link => {
        link.classList.remove('nav-link--active');
        link.removeAttribute('aria-current');

        /*
          Match logic:
          - section id="home"     → href="index.html"  (contains "index")
          - section id="about"    → href="about.html"  (contains "about")
          - section id="projects" → href="projects.html"
          - section id="services" → href="services.html"
          - section id="contact"  → href="contact.html"
        */
        const href = link.getAttribute('href') || '';
        const matchesHome    = id === 'home'     && href.includes('index');
        const matchesSection = id !== 'home'     && href.includes(id);

        if (matchesHome || matchesSection) {
          link.classList.add('nav-link--active');
          link.setAttribute('aria-current', 'page');
        }
      });
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold:  0,
  });

  sections.forEach(s => observer.observe(s));
}


/* ─────────────────────────────────────────
   SMOOTH SCROLL
   Only applies to true anchor links (#id).
   Page links (about.html) navigate normally.
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ─────────────────────────────────────────
   PROJECT FILTER (projects.html only)
───────────────────────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.proj-card');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        card.style.display = tags.includes(filter) ? 'flex' : 'none';
      });
    });
  });
}