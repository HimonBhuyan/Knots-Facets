import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PageId } from '../types';
import { CATALOG } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { LiveAtelierTicker } from '../components/LiveAtelierTicker';
import { LiveWorkbenchBadge } from '../components/LiveWorkbenchBadge';
import { ArrowRight, Play } from 'lucide-react';

interface HomePageProps {
  setActivePage: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const colorLayerRef = useRef<HTMLImageElement>(null);
  const motesCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { openQuickView } = useCart();

  const topBestSellers = CATALOG.slice(0, 4);

  // Play animation trigger
  const playIntro = useCallback(() => {
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
    }, 40);
  }, []);

  // Ambient Sunlight Dust Motes (Particle Canvas)
  useEffect(() => {
    const canvas = motesCanvasRef.current;
    if (!canvas) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || 800);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });

    const particles: Array<{
      x: number;
      y: number;
      r: number;
      alpha: number;
      speedX: number;
      speedY: number;
      pulseSpeed: number;
      pulseVal: number;
    }> = [];

    const count = 38;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.6,
        alpha: 0.15 + Math.random() * 0.45,
        speedX: -0.2 + Math.random() * 0.4,
        speedY: -0.3 + Math.random() * 0.6,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulseVal: Math.random() * Math.PI
      });
    }

    const render = () => {
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
        ctx.shadowColor = 'rgba(229, 212, 199, 0.85)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Dual-Layer Color Reveal Pointer Tracking
  useEffect(() => {
    const hero = heroRef.current;
    const photo = photoRef.current;
    const colorLayer = colorLayerRef.current;
    if (!hero || !photo || !colorLayer) return;

    let target = { x: hero.offsetWidth * 0.68, y: hero.offsetHeight * 0.5 };
    let pos = { x: target.x, y: target.y };
    let radius = 0;
    let hasPointer = false;
    let live = false;
    let animId: number;

    const timer = setTimeout(() => {
      live = true;
    }, 1800);

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = hero.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      hasPointer = true;
    };

    const onPointerLeave = () => {
      hasPointer = false;
    };

    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave);

    const frame = () => {
      const r = hero.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      const small = w < 760;
      const maxR = small ? 120 : 190;

      if (!hasPointer) {
        target.x = w * (small ? 0.5 : 0.66);
        target.y = h * 0.52;
      }

      pos.x += (target.x - pos.x) * 0.09;
      pos.y += (target.y - pos.y) * 0.09;

      const wantR = live ? maxR : 0;
      radius += (wantR - radius) * 0.08;

      const lr = colorLayer.getBoundingClientRect();
      const localX = (pos.x + r.left - lr.left) * (colorLayer.offsetWidth / lr.width);
      const localY = (pos.y + r.top - lr.top) * (colorLayer.offsetHeight / lr.height);
      const scaleBack = colorLayer.offsetWidth / lr.width;

      colorLayer.style.setProperty('--rx', `${localX.toFixed(1)}px`);
      colorLayer.style.setProperty('--ry', `${localY.toFixed(1)}px`);
      colorLayer.style.setProperty('--rr', `${(radius * scaleBack).toFixed(1)}px`);

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  // Split headline helper for cinematic staggered animation
  const renderSplitText = (text: string, startIndex: number) => {
    let curr = startIndex;
    const words = text.split(' ');
    return words.map((word, wi) => (
      <span key={wi} className="word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {Array.from(word).map((char, ci) => {
          const idx = curr++;
          return (
            <span
              key={ci}
              className="ch"
              style={{ '--i': idx } as React.CSSProperties}
            >
              {char}
            </span>
          );
        })}
        {wi < words.length - 1 && <span style={{ display: 'inline-block', width: '0.25em' }}> </span>}
      </span>
    ));
  };

  return (
    <div className="home-container">
      {/* Signature Hero Stage */}
      <section
        ref={heroRef}
        className={`hero ${isPlaying ? 'is-playing' : ''}`}
        id="home"
        aria-label="Knots &amp; Facets introduction"
      >
        <div className="vlines" aria-hidden="true">
          <i /><i /><i />
        </div>

        {/* Photograph Dual Layer */}
        <div className="stage" id="stage">
          {/* Ambient Dust Motes Canvas */}
          <canvas
            ref={motesCanvasRef}
            className="hero-sun-motes"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 2,
              opacity: 0.75
            }}
          />

          <div ref={photoRef} className="photo" id="photo">
            <img
              className="base"
              src="/images/hero.jpg"
              width="1920"
              height="1280"
              alt="Handmade glass and crystal earrings arranged on natural crochet fabric"
              decoding="async"
            />
            <img
              ref={colorLayerRef}
              className="color"
              id="colorLayer"
              src="/images/hero.jpg"
              width="1920"
              height="1280"
              alt=""
              aria-hidden="true"
              decoding="async"
            />
          </div>

          <button
            className="replay"
            id="replay"
            type="button"
            onClick={playIntro}
            aria-label="Replay introduction animation"
          >
            <span>
              <Play size={18} fill="#29231F" stroke="#29231F" style={{ marginLeft: '2px' }} />
            </span>
          </button>
        </div>

        {/* Copy / Headline */}
        <div className="copy">
          <h1 id="headline" aria-label="Crafted with Love &amp; Detail.">
            <span className="l1">{renderSplitText("Crafted with", 0)}</span>
            <span className="l2">{renderSplitText("Love & Detail.", 12)}</span>
          </h1>
          <p className="lead">
            Thoughtfully handcrafted jewellery and accessories, where delicate details meet timeless charm.
          </p>
          <div className="cta-wrap">
            <button className="cta" onClick={() => setActivePage('shop')}>
              <span>Discover Our Creations</span>
              <span className="dot" aria-hidden="true">
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
        </div>

        {/* Chips Wrap (Floating on Desktop, Responsive Row on Mobile) */}
        <div className="hero-chips-wrap">
          <div className="chip chip-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="#9B7765" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 15c0-5 7-5 7 0s-8 6-8 1 8-12 15-8 3 11-3 8" />
            </svg>
            <div>
              <small>Handcrafted</small>
              <strong>With care</strong>
            </div>
          </div>

          <div className="chip chip-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#9B7765" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l7 6-7 12L5 9z" />
              <path d="M5 9h14M9 9l3-6 3 6M9 9l3 12 3-12" />
            </svg>
            <div>
              <small>Every piece</small>
              <strong>Uniquely made</strong>
            </div>
          </div>
        </div>

        {/* Live Workbench Status Badge (Lower Left of Hero) */}
        <LiveWorkbenchBadge onInspectProduct={(prod) => openQuickView(prod)} />

        {/* Bottom Floating Cards */}
        <div className="cards">
          <div
            className="card"
            onClick={() => setActivePage('shop')}
            role="button"
            tabIndex={0}
            aria-label="The Jewellery Edit"
          >
            <div className="cimg">
              <img src="/images/card-jewellery.jpg" alt="Handmade glass bead earrings" />
            </div>
            <div className="ctext">
              <p className="label">THE JEWELLERY EDIT</p>
              <h2>Small details. Lasting beauty.</h2>
              <p className="sub">Handmade pieces designed to make everyday moments special.</p>
              <span className="go" aria-hidden="true">
                <ArrowRight size={14} />
              </span>
            </div>
          </div>

          <div
            className="card"
            onClick={() => setActivePage('shop')}
            role="button"
            tabIndex={0}
            aria-label="The Handcrafted Edit"
          >
            <div className="cimg">
              <img src="/images/card-crochet.jpg" alt="Handmade crochet hair accessory" />
            </div>
            <div className="ctext">
              <p className="label">THE HANDCRAFTED EDIT</p>
              <h2>Made slowly, made with love.</h2>
              <p className="sub">Thoughtful handmade creations for your everyday rituals.</p>
              <span className="go" aria-hidden="true">
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Atelier Broadcast & Marquee Ribbon (Filling Lower Screen Space) */}
      <LiveAtelierTicker onExplore={() => setActivePage('shop')} />

      {/* Below the Hero Blocks */}
      <div className="section-block">
        {/* USP Strip */}
        <div className="usp-bar">
          <div className="usp-item">
            <span>🤲</span>
            <strong>Slow Handcrafted</strong>
            <small>Zero mass factory assembly</small>
          </div>
          <div className="usp-item">
            <span>💎</span>
            <strong>Lead-Free Crystal</strong>
            <small>Faceted Bohemian &amp; Czech glass</small>
          </div>
          <div className="usp-item">
            <span>🌱</span>
            <strong>Natural Fibres</strong>
            <small>100% combed organic cotton</small>
          </div>
          <div className="usp-item">
            <span>💌</span>
            <strong>Wax-Sealed Gift Box</strong>
            <small>Plastic-free unboxing included</small>
          </div>
        </div>

        {/* Curated Best Sellers */}
        <div className="section-header center">
          <span className="eyebrow">Studio Favorites</span>
          <h2 className="title">Curated Best Sellers</h2>
          <p className="subtext">
            The most treasured glass refractions and slow-stitched cotton accessories loved by our collectors.
          </p>
          <span className="mobile-swipe-hint">Swipe to explore ⟶</span>
        </div>

        <div className="product-grid swipeable-slider" style={{ marginBottom: '40px' }}>
          {topBestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <button className="btn-dark" onClick={() => setActivePage('shop')}>
            View Full Atelier Catalog ({CATALOG.length} Pieces)
          </button>
        </div>

        {/* The Atelier Workbench Feature */}
        <div className="workbench-feature">
          <div className="workbench-img">
            <img
              src="/images/atelier_studio.jpg"
              alt="Artisan workbench with crochet hooks and crystals in morning sunlight"
              loading="lazy"
            />
          </div>
          <div className="workbench-content">
            <span className="eyebrow">The Atelier Journal</span>
            <h2>Where light meets tactile rhythm.</h2>
            <p>
              Every piece starts on our raw wooden workbench. We sketch in linen notebooks, hand-shape non-tarnish gold wires, and patiently weave organic cotton threads into durable accessories that age gracefully.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-dark" onClick={() => setActivePage('story')}>
                Read Our Story
              </button>
              <button className="btn-secondary" onClick={() => setActivePage('lookbook')}>
                View Lookbook
              </button>
            </div>
          </div>
        </div>

        {/* Dual Collections Section */}
        <div className="section-header center">
          <span className="eyebrow">Collections</span>
          <h2 className="title">Two ways of making,<br />one handmade studio.</h2>
          <p className="subtext">
            Glass and crystal pieces for the light, crochet accessories for the touch. Every item is made by hand, so no two are exactly alike.
          </p>
        </div>

        <div className="collections" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '80px' }}>
          <div
            className="coll"
            onClick={() => setActivePage('shop')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/3.8', cursor: 'pointer' }}
          >
            <img
              src="/images/collection-jewellery.jpg"
              alt="Glass and crystal jewellery arrangement"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(41,35,31,0.75))' }} />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: 'var(--white)' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', margin: '0 0 6px' }}>Glass &amp; Crystal Jewellery</h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.92rem' }}>Faceted drop earrings, suncatchers, and delicate pendants catching sunlight.</p>
            </div>
          </div>

          <div
            className="coll"
            onClick={() => setActivePage('shop')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/3.8', cursor: 'pointer' }}
          >
            <img
              src="/images/collection-crochet.jpg"
              alt="Crochet accessories and handmade goods"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(41,35,31,0.75))' }} />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: 'var(--white)' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', margin: '0 0 6px' }}>Crochet &amp; Fibre Goods</h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.92rem' }}>Textured tote bags, floral scrunchies, coasters, and filigree bookmarks.</p>
            </div>
          </div>
        </div>

        {/* Sustainable Packaging Feature */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: 'clamp(32px, 5vw, 60px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '80px', width: '100%' }}>
          <div>
            <span className="eyebrow">Sustainable Gifting</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', lineHeight: 1.2, margin: '0 0 16px' }}>
              The Wax-Sealed Unboxing Experience
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '0.96rem', marginBottom: '24px' }}>
              Whether treating yourself or sending an heirloom gift to someone dear, each order arrives wrapped in organic cotton tissue, accompanied by dried French lavender sprigs and an authentic hand-pressed wax seal.
            </p>
            <button className="btn-dark" onClick={() => setActivePage('custom')}>
              Commission a Bespoke Gift Box
            </button>
          </div>
          <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <img src="/images/packaging_gifting.jpg" alt="Artisan gift box with wax seal and velvet pouch" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="section-header center">
          <span className="eyebrow">Collector Love Notes</span>
          <h2 className="title">Treasured in Everyday Life</h2>
          <p className="subtext">Read what our community shares about the tactile warmth and light of our pieces.</p>
          <span className="mobile-swipe-hint">Swipe to read reviews ⟶</span>
        </div>

        <div className="reviews-grid swipeable-slider" style={{ marginBottom: '80px' }}>
          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-quote">
              “The Celestial Prismatic earrings catch the morning light in my kitchen and cast the softest rainbows across the room. The craftsmanship is flawless.”
            </p>
            <span className="review-author">— MARA V., SAN FRANCISCO</span>
          </div>
          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-quote">
              “My crochet tote is so sturdy yet unbelievably soft. You can tell real human care went into every single stitch. The wax-sealed packaging brought tears to my eyes.”
            </p>
            <span className="review-author">— CHLOE L., EDINBURGH</span>
          </div>
          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-quote">
              “Commissioned a bridal suite for my wedding day. The combination of delicate lace crochet and faceted glass drops complemented my vintage gown perfectly.”
            </p>
            <span className="review-author">— ELEANOR S., MELBOURNE</span>
          </div>
        </div>

        {/* Custom Order Callout */}
        <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', padding: 'clamp(40px, 6vw, 70px) 24px', textAlign: 'center', marginBottom: '50px', width: '100%' }}>
          <span className="eyebrow">Your Custom Vision</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 400, margin: '0 0 14px' }}>
            Ready to create something one-of-a-kind?
          </h2>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '540px', margin: '0 auto 28px', fontSize: '1.05rem' }}>
            Use our bespoke 4-step configurator to select custom gemstones, chain lengths, and yarn palettes tailored to you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button className="btn-dark" onClick={() => setActivePage('custom')}>
              Open Bespoke Configurator
            </button>
            <button className="btn-secondary" onClick={() => setActivePage('contact')}>
              Message the Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
