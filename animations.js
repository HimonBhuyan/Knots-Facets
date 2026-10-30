/* ==========================================================================
   KNOTS & FACETS — LUXURY ANIMATIONS & MICRO-INTERACTIONS ENGINE
   Scroll Reveals, 3D Tilt & Specular Sheen, Prismatic Sparkles & Dust Motes
   ========================================================================== */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. SCROLL REVEAL OBSERVER
  function initScrollReveals() {
    if (isReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed'));
      return;
    }

    // Auto-tag common elements if not manually tagged
    const autoElements = [
      '.section-header',
      '.product-card',
      '.workbench-feature',
      '.coll',
      '.pillar-card',
      '.care-card',
      '.review-card',
      '.lookbook-item',
      '.contact-info-card',
      '.contact-form-card',
      '.faq-item',
      '.config-step',
      '.usp-item'
    ];

    autoElements.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        if (!el.hasAttribute('data-reveal')) {
          el.setAttribute('data-reveal', 'up');
          // Add staggered delay for grids
          const delay = (index % 4) * 120;
          if (delay > 0) el.style.transitionDelay = `${delay}ms`;
        }
      });
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Once revealed, unobserve to keep DOM performant
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }

  // 2. 3D CARD TILT & SPECULAR SHEEN
  function init3DTilt() {
    if (isReducedMotion || window.innerWidth < 768) return;

    const tiltCards = document.querySelectorAll('.product-card, .card, .pillar-card, .review-card, .option-card, .lookbook-item');

    tiltCards.forEach(card => {
      card.classList.add('has-sheen');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // Max 6deg
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

        // Update sheen position
        const percentX = Math.round((x / rect.width) * 100);
        const percentY = Math.round((y / rect.height) * 100);
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // 3. PRISMATIC SPARKLE BURST GENERATOR
  function createSparkle(x, y, container = document.body) {
    if (isReducedMotion) return;

    const sparkleCount = 6;
    const colors = ['#C29B38', '#9B7765', '#E5D4C7', '#FAF8F5', '#7A5B4C'];

    for (let i = 0; i < sparkleCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'prismatic-spark';
      
      const angle = (Math.PI * 2 / sparkleCount) * i + (Math.random() * 0.4);
      const distance = 25 + Math.random() * 40;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;
      const size = 4 + Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.background = color;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty('--dx', `${destX}px`);
      spark.style.setProperty('--dy', `${destY}px`);

      container.appendChild(spark);

      setTimeout(() => spark.remove(), 750);
    }
  }

  // Click & hover sparkle listeners
  function initSparkles() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn-dark, .btn-accent, .cta, .btn-quick-add, .product-badge, .brand');
      if (target) {
        createSparkle(e.pageX, e.pageY);
      }
    });
  }

  // 4. AMBIENT SUNLIGHT DUST MOTES (IN HERO STAGE)
  function initSunMotes() {
    const stage = document.getElementById('stage');
    if (!stage || isReducedMotion) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-sun-motes';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '2';
    canvas.style.opacity = '0.7';
    stage.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = stage.offsetWidth;
    let height = canvas.height = stage.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = stage.offsetWidth;
      height = canvas.height = stage.offsetHeight;
    }, { passive: true });

    const particles = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.5,
        alpha: 0.15 + Math.random() * 0.45,
        speedX: -0.2 + Math.random() * 0.4,
        speedY: -0.3 + Math.random() * 0.6,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulseVal: Math.random() * Math.PI
      });
    }

    function renderMotes() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulseVal += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseVal));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 252, 240, ${currentAlpha.toFixed(3)})`;
        ctx.shadowColor = 'rgba(229, 212, 199, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      requestAnimationFrame(renderMotes);
    }

    renderMotes();
  }

  // 5. MAGNETIC BUTTON MICRO-INTERACTION
  function initMagneticButtons() {
    if (isReducedMotion || window.innerWidth < 992) return;

    const magnets = document.querySelectorAll('.cta, .brand, .replay, .nav-icon-btn');
    magnets.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // 6. ANIMATED COUNTERS
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-count-to]');
    if (counterElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count-to'), 10);
          const duration = 1400;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);
            el.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target;
            }
          }
          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => observer.observe(el));
  }

  // Initialize
  function init() {
    initScrollReveals();
    init3DTilt();
    initSparkles();
    initSunMotes();
    initMagneticButtons();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.KFA = {
    createSparkle,
    initScrollReveals,
    init3DTilt
  };
})();
