import React, { useEffect, useState } from 'react';

interface AtelierLoaderProps {
  onComplete?: () => void;
}

const STUDIO_STEPS = [
  'Spooling unbleached organic cotton...',
  'Hand-cutting Bohemian glass facets...',
  'Polishing 14k gold-filled wire...',
  'Catching morning studio sunlight...'
];

export const AtelierLoader: React.FC<AtelierLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2300; // 2.3s tactile craft sequence
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / duration, 1);
      // Smooth ease-in-out cubic curve
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

  return (
    <div
      className={`atelier-loader ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Knots and Facets Atelier"
    >
      {/* Top & Bottom Linen Curtain Panels for Split Reveal */}
      <div className="loader-curtain loader-curtain-top" aria-hidden="true">
        <div className="loader-grain" />
      </div>
      <div className="loader-curtain loader-curtain-bottom" aria-hidden="true">
        <div className="loader-grain" />
      </div>

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

        {/* Animated Knot & Crystal Prism Emblem */}
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
              r="100"
              stroke="rgba(155, 119, 101, 0.18)"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
            <circle
              cx="110"
              cy="110"
              r="86"
              stroke="rgba(41, 35, 31, 0.1)"
              strokeWidth="0.75"
            />
            {/* Cardinal Diamond Nodes */}
            <path d="M110 4 L113 10 L110 16 L107 10 Z" fill="#9B7765" opacity="0.65" />
            <path d="M110 204 L113 210 L110 216 L107 210 Z" fill="#9B7765" opacity="0.65" />
            <path d="M4 110 L10 113 L16 110 L10 107 Z" fill="#C29B38" opacity="0.65" />
            <path d="M204 110 L210 113 L216 110 L210 107 Z" fill="#C29B38" opacity="0.65" />
          </svg>

          {/* Core Self-Weaving Knot + Faceted Crystal SVG */}
          <svg
            className="loader-core-svg"
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C29B38" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#9B7765" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#29231F" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="shimmerFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 240, 200, 0.55)" />
                <stop offset="45%" stopColor="rgba(232, 188, 202, 0.38)" />
                <stop offset="100%" stopColor="rgba(182, 218, 242, 0.45)" />
              </linearGradient>
            </defs>

            {/* Prismatic Internal Glow */}
            <polygon
              className="loader-prism-glow"
              points="60,16 92,44 60,104 28,44"
              fill="url(#shimmerFill)"
              style={{ opacity: Math.min(1, progress / 70) }}
            />

            {/* Outer Kite-Cut Crystal Facet */}
            <path
              className="loader-crystal-outer"
              d="M60 16 L92 44 L60 104 L28 44 Z"
              stroke="#29231F"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 240,
                strokeDashoffset: 240 - (240 * Math.min(progress * 1.15, 100)) / 100
              }}
            />

            {/* Inner Crystal Facet Lines */}
            <path
              className="loader-crystal-inner"
              d="M28 44 H92 M44 44 L60 16 L76 44 M44 44 L60 104 L76 44"
              stroke="#9B7765"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 260,
                strokeDashoffset: 260 - (260 * Math.min(Math.max(progress - 12, 0) * 1.2, 100)) / 100
              }}
            />

            {/* Continuous Botanical Crochet Loop Weaving Through the Crystal */}
            <path
              className="loader-knot-thread"
              d="M18 76 C18 54, 46 54, 46 76 C46 94, 14 96, 14 78 C14 44, 62 22, 96 42 C112 52, 98 88, 76 76 C60 68, 74 48, 92 56"
              stroke="url(#prismGrad)"
              strokeWidth="2.1"
              strokeLinecap="round"
              style={{
                strokeDasharray: 340,
                strokeDashoffset: 340 - (340 * progress) / 100
              }}
            />

            {/* Sparkle Star on Top Facet Crown */}
            <g
              className="loader-sparkle"
              style={{
                opacity: progress > 45 ? 1 : 0,
                transform: `translate(60px, 16px) scale(${0.5 + (progress / 100) * 0.65})`
              }}
            >
              <path
                d="M0 -8 L1.8 -1.8 L8 0 L1.8 1.8 L0 8 L-1.8 1.8 L-8 0 L-1.8 -1.8 Z"
                fill="#C29B38"
              />
            </g>
          </svg>

          {/* Floating Percentage Badge */}
          <div className="loader-pct-pill">
            <span className="loader-pct-num">{String(progress).padStart(2, '0')}</span>
            <span className="loader-pct-sign">%</span>
          </div>
        </div>

        {/* Brand Title & Dynamic Craft Status */}
        <div className="loader-copy">
          <h2 className="loader-brand-title">
            <span className="loader-title-italic">Knots</span>
            <span className="loader-title-amp">&amp;</span>
            <span className="loader-title-roman">Facets</span>
          </h2>
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
