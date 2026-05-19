// ============================================================
//  MAIN JS — Mall of America Sales Deck
// ============================================================

// ── Intro Overlay ────────────────────────────────────────────
// Lock scroll while intro is visible
document.body.classList.add('intro-active');

function enterSite() {
  const overlay = document.getElementById('intro-overlay');
  const video   = document.getElementById('intro-video');

  // Start fade-out
  overlay.classList.add('fade-out');

  // After transition ends: remove overlay & unlock scroll
  overlay.addEventListener('transitionend', () => {
    overlay.remove();
    document.body.classList.remove('intro-active');
    // Pause & release video memory
    if (video) { video.pause(); video.src = ''; }
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initCounters();
  initLeasingTabs();
  initParticles();
  initProgressBar();
});

// ── Navigation ───────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  // Scroll: add .scrolled class
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Smooth scroll + close mobile menu
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
        hamburger?.classList.remove('open');
        mobileMenu?.classList.remove('open');
      }
    });
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) current = s.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ── Scroll Progress Bar ──────────────────────────────────────
function initProgressBar() {
  const bar = document.getElementById('nav-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const total = doc.scrollHeight - doc.clientHeight;
    bar.style.width = `${(scrolled / total) * 100}%`;
  }, { passive: true });
}

// ── Scroll Reveal Animations ─────────────────────────────────
function initScrollAnimations() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => observer.observe(el));
}

// ── Animated Counters ────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = el.dataset.decimals || 0;
      const duration = 1800;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = (target * eased).toFixed(decimals);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ── Leasing Tabs ─────────────────────────────────────────────
function initLeasingTabs() {
  const tabs = document.querySelectorAll('.leasing-tab');
  const panels = document.querySelectorAll('.leasing-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(`panel-${tab.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });
}

// ── Particles Background ─────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife) this.reset();
      this.opacity = Math.sin((this.life / this.maxLife) * Math.PI) * 0.4;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#C9A84C';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
}

// ── Custom Cursor ──────────────────────────────────────────────
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const renderRing = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  };
  requestAnimationFrame(renderRing);

  // Add magnetic effect to interactive elements
  const interactables = document.querySelectorAll('a, button, .leasing-tab, .retail-cat, .tier-card');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-active'));
  });
}

// ── Download Deck Button ───────────────────────────────────────
function initDownloadBtn() {
  const btn = document.getElementById('download-deck-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (btn.classList.contains('loading')) return;
    
    btn.classList.add('loading');
    const textSpan = btn.querySelector('.dl-text');
    const originalText = textSpan.innerText;
    textSpan.innerText = 'Generating PDF...';

    // Simulate PDF generation time
    setTimeout(() => {
      textSpan.innerText = 'Downloaded!';
      setTimeout(() => {
        btn.classList.remove('loading');
        textSpan.innerText = originalText;
      }, 2000);
    }, 2000);
  });
}

// ── Interactive Floor Plan ──────────────────────────────────────
function initFloorPlan() {
  const tabs = document.querySelectorAll('.fp-tab');
  const levels = document.querySelectorAll('.fp-level');
  
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      levels.forEach(l => l.classList.remove('active'));
      
      // Add active to clicked
      tab.classList.add('active');
      const targetId = `level-${tab.getAttribute('data-level')}`;
      const targetLevel = document.getElementById(targetId);
      if (targetLevel) targetLevel.classList.add('active');
    });
  });
}

// ── Advanced Parallax ─────────────────────────────────────────
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-img');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Smooth frame-based update
    requestAnimationFrame(() => {
      parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.15;
        const rect = el.getBoundingClientRect();
        
        // Only parallax if element is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const yPos = (rect.top - window.innerHeight / 2) * speed;
          // Apply standard transform, avoiding 3d for cleaner rendering on some devices
          el.style.transform = `translateY(${yPos}px) scale(1.1)`;
        }
      });
    });
  }, { passive: true });
}

// ── Contact Form Logic ──────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('moa-contact-form');
  const submitBtn = document.getElementById('cf-submit');
  const successMsg = document.getElementById('cf-success');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Check validity
    if (!form.checkValidity()) return;

    submitBtn.classList.add('submitting');
    submitBtn.disabled = true;

    // Simulate API network request
    setTimeout(() => {
      submitBtn.classList.remove('submitting');
      successMsg.style.display = 'flex';
      
      // Force reflow for opacity transition
      successMsg.offsetHeight; 
      successMsg.classList.add('show');
      
      form.reset();

      // Optional: hide success message after 5 seconds
      setTimeout(() => {
        successMsg.classList.remove('show');
        setTimeout(() => { successMsg.style.display = 'none'; submitBtn.disabled = false; }, 500);
      }, 5000);

    }, 1500);
  });
}

// Initialize new features on load
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initDownloadBtn();
  initFloorPlan();
  initParallax();
  initContactForm();
});
