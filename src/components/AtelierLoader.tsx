import React, { useEffect, useState } from 'react';

interface AtelierLoaderProps {
  onComplete?: () => void;
}

const STUDIO_STEPS = [
  'Spooling unbleached organic cotton...',
  'Hand-cutting iridescent crystal facets...',
  'Weaving the infinity artisan knot...',
  'Catching morning studio sunlight...'
];

export const AtelierLoader: React.FC<AtelierLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2300;
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / duration, 1);
      const eased =
        raw < 0.5
          ? 4 * raw * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      const currentPct = Math.round(eased * 100);
      setProgress(currentPct);

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsHidden(true);
            onComplete?.();
          }, 850);
        }, 180);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  const handleSkip = () => {
    if (isExiting) return;
    setProgress(100);
    setIsExiting(true);
    setTimeout(() => {
      setIsHidden(true);
      onComplete?.();
    }, 650);
  };

  if (isHidden) return null;

  const stepIndex = Math.min(
    Math.floor((progress / 100) * STUDIO_STEPS.length),
    STUDIO_STEPS.length - 1
  );

  // Progress ring circumference (r = 96 -> 2 * pi * 96 ≈ 603.19)
  const ringCircumference = 603.19;
  const ringOffset = ringCircumference - (ringCircumference * progress) / 100;

  return (
    <div
      className={`atelier-loader ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Knots and Facets Atelier"
    >
      {/* Top & Bottom Linen Curtain Panels for Split Reveal */}
      <div className="loader-curtain loader-curtain-top" aria-hidden="true" />
      <div className="loader-curtain loader-curtain-bottom" aria-hidden="true" />

      {/* Ambient Prismatic Caustic Orbs */}
      <div className="loader-caustics" aria-hidden="true">
        <span className="caustic-orb orb-amber" />
        <span className="caustic-orb orb-rose" />
        <span className="caustic-orb orb-prism" />
      </div>

      {/* Center Stage Content */}
      <div className="loader-stage">
        <div className="loader-top-meta">
          <span className="loader-eyebrow">SMALL-BATCH HANDCRAFTED ATELIER</span>
          <span className="loader-coords">GLASS REFRACTIONS &bull; SLOW FIBRE</span>
        </div>

        {/* Official Emblem Mark + Orbiting Progress Halo */}
        <div className="loader-emblem-wrap">
          {/* Rotating Outer Astrolabe / Stitch Dial */}
          <svg
            className="loader-dial-svg"
            viewBox="0 0 220 220"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="110"
              cy="110"
              r="104"
              stroke="rgba(155, 119, 101, 0.2)"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
            <path d="M110 2 L113 8 L110 14 L107 8 Z" fill="#9B7765" opacity="0.7" />
            <path d="M110 206 L113 212 L110 218 L107 212 Z" fill="#9B7765" opacity="0.7" />
            <path d="M2 110 L8 113 L14 110 L8 107 Z" fill="#C29B38" opacity="0.7" />
            <path d="M206 110 L212 113 L218 110 L212 107 Z" fill="#C29B38" opacity="0.7" />
          </svg>

          {/* Smooth Progress Ring SVG */}
          <svg
            className="loader-progress-ring"
            viewBox="0 0 220 220"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E5B8C8" />
                <stop offset="50%" stopColor="#9B7765" />
                <stop offset="100%" stopColor="#A8D8DF" />
              </linearGradient>
            </defs>
            <circle
              cx="110"
              cy="110"
              r="96"
              stroke="rgba(41, 35, 31, 0.08)"
              strokeWidth="1.25"
            />
            <circle
              cx="110"
              cy="110"
              r="96"
              stroke="url(#haloGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
              style={{
                strokeDasharray: ringCircumference,
                strokeDashoffset: ringOffset,
                transition: 'stroke-dashoffset 0.08s linear'
              }}
            />
          </svg>

          {/* Official Crystal & Infinity Knot Logo Mark */}
          <div className="loader-logo-mark-frame">
            <img
              src="/images/logo-mark.png"
              alt="Knots & Facets Emblem"
              className="loader-logo-mark-img"
              style={{
                opacity: 0.25 + (progress / 100) * 0.75,
                transform: `scale(${0.88 + (progress / 100) * 0.12})`
              }}
            />
            <div className="loader-logo-shimmer" aria-hidden="true" />
          </div>

          {/* Floating Percentage Badge */}
          <div className="loader-pct-pill">
            <span className="loader-pct-num">{String(progress).padStart(2, '0')}</span>
            <span className="loader-pct-sign">%</span>
          </div>
        </div>

        {/* Brand Title & Official Subtitle */}
        <div className="loader-copy">
          <h2 className="loader-brand-title">
            <span className="loader-title-roman">KNOTS</span>
            <span className="loader-title-amp">&amp;</span>
            <span className="loader-title-roman">FACETS</span>
          </h2>
          <span className="loader-brand-subtitle">ARTISAN JEWELRY &amp; ADORNMENTS</span>
          <p className="loader-step-text" key={stepIndex}>
            {STUDIO_STEPS[stepIndex]}
          </p>
        </div>

        {/* Golden Thread Progress Bar with Crystal Bead Tip */}
        <div className="loader-thread-track" aria-hidden="true">
          <div
            className="loader-thread-fill"
            style={{ width: `${progress}%` }}
          >
            <span className="loader-thread-bead" />
          </div>
        </div>

        <button
          type="button"
          className="loader-skip-btn"
          onClick={handleSkip}
          aria-label="Skip intro animation"
        >
          Enter Studio Immediately &rarr;
        </button>
      </div>
    </div>
  );
};
