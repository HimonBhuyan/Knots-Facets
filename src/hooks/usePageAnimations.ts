import { useEffect } from 'react';
import { PageId } from '../types';

export function createSparkle(x: number, y: number, container: HTMLElement = document.body) {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    setTimeout(() => {
      spark.remove();
    }, 750);
  }
}

export function usePageAnimations(activePage: PageId) {
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. SCROLL REVEALS
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
      '.usp-bar',
      '.page-banner',
      '.provenance-table-wrap'
    ];

    const elementsToObserve: Element[] = [];

    autoElements.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        if (!el.hasAttribute('data-reveal')) {
          el.setAttribute('data-reveal', 'up');
          const delay = (index % 4) * 100;
          if (delay > 0) {
            (el as HTMLElement).style.transitionDelay = `${delay}ms`;
          }
        }
        elementsToObserve.push(el);
      });
    });

    if (isReducedMotion) {
      elementsToObserve.forEach(el => el.classList.add('is-revealed'));
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
      );

      elementsToObserve.forEach(el => observer.observe(el));

      // Cleanup
      var cleanupObserver = () => {
        observer.disconnect();
      };
    }

    // 2. 3D CARD TILT & SPECULAR SHEEN
    const cleanupTiltList: Array<() => void> = [];
    if (!isReducedMotion && window.innerWidth >= 768) {
      const tiltCards = document.querySelectorAll(
        '.product-card, .card, .pillar-card, .review-card, .option-card, .lookbook-item, .palette-card'
      );

      tiltCards.forEach(card => {
        const el = card as HTMLElement;
        el.classList.add('has-sheen');

        const onMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -5;
          const rotateY = ((x - centerX) / centerX) * 5;

          el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

          const percentX = Math.round((x / rect.width) * 100);
          const percentY = Math.round((y / rect.height) * 100);
          el.style.setProperty('--mouse-x', `${percentX}%`);
          el.style.setProperty('--mouse-y', `${percentY}%`);
        };

        const onMouseLeave = () => {
          el.style.transform = '';
        };

        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);

        cleanupTiltList.push(() => {
          el.removeEventListener('mousemove', onMouseMove);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      });
    }

    // 3. MAGNETIC BUTTONS (Desktop)
    const cleanupMagneticList: Array<() => void> = [];
    if (!isReducedMotion && window.innerWidth >= 992) {
      const magnets = document.querySelectorAll('.cta, .brand, .replay, .nav-icon-btn, .menu-btn');
      magnets.forEach(btn => {
        const el = btn as HTMLElement;
        const onMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        };
        const onMouseLeave = () => {
          el.style.transform = '';
        };

        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);

        cleanupMagneticList.push(() => {
          el.removeEventListener('mousemove', onMouseMove);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      });
    }

    // 4. CLICK SPARKLE LISTENER
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        '.btn-dark, .btn-accent, .cta, .btn-quick-add, .product-badge, .replay, .btn-quick-view'
      );
      if (target) {
        createSparkle(e.pageX, e.pageY);
      }
    };

    document.addEventListener('click', onClick);

    return () => {
      if (cleanupObserver) cleanupObserver();
      cleanupTiltList.forEach(fn => fn());
      cleanupMagneticList.forEach(fn => fn());
      document.removeEventListener('click', onClick);
    };
  }, [activePage]);
}
