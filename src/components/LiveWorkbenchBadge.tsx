import React, { useState, useEffect } from 'react';
import { Eye, Hammer, Sparkles } from 'lucide-react';
import { CATALOG } from '../data/catalog';
import { Product } from '../types';

interface LiveWorkbenchBadgeProps {
  onInspectProduct?: (product: Product) => void;
}

export const LiveWorkbenchBadge: React.FC<LiveWorkbenchBadgeProps> = ({ onInspectProduct }) => {
  // Live items that cycle every 8 seconds
  const workbenchQueue = [
    {
      productId: 'p1', // Celestial Prismatic Drop Earrings
      action: 'Hand-faceting Bohemian drop loop',
      progress: 88,
      artisan: 'Studio No. 4',
      stage: 'Final Inspection'
    },
    {
      productId: 'p2', // The Atelier Cotton Crochet Tote
      action: 'Weaving reinforced shoulder straps',
      progress: 74,
      artisan: 'Fibre Bench',
      stage: 'Tension Blocking'
    },
    {
      productId: 'p3', // Solstice Kite-Cut Crystal Pendant
      action: 'Shaping 14k non-tarnish gold wire',
      progress: 94,
      artisan: 'Wire Studio',
      stage: 'Wax Polishing'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % workbenchQueue.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [workbenchQueue.length]);

  const currentItem = workbenchQueue[currentIndex];
  const matchedProduct = CATALOG.find(p => p.id === currentItem.productId) || CATALOG[0];

  return (
    <div
      className="live-workbench-badge"
      onClick={() => onInspectProduct?.(matchedProduct)}
      role="button"
      tabIndex={0}
      title="Click to inspect this live handcrafted piece"
    >
      <div className="wb-badge-header">
        <span className="wb-live-dot">
          <span className="dot-ripple" />
          <span className="dot-solid" />
        </span>
        <span className="wb-badge-title">GUWAHATI BENCH · LIVE</span>
        <span className="wb-badge-stage">{currentItem.stage}</span>
      </div>

      <div className="wb-badge-body">
        <div className="wb-thumb-wrap">
          <img
            src={matchedProduct.image}
            alt={matchedProduct.title}
            className="wb-thumb"
          />
          <span className="wb-thumb-overlay">
            <Eye size={12} />
          </span>
        </div>

        <div className="wb-badge-details">
          <h4 className="wb-piece-name">{matchedProduct.title}</h4>
          <p className="wb-piece-action">
            <Hammer size={11} className="wb-action-icon" />
            <span>{currentItem.action}</span>
          </p>
          <div className="wb-progress-row">
            <div className="wb-progress-track">
              <div
                className="wb-progress-bar"
                style={{ width: `${currentItem.progress}%` }}
              />
            </div>
            <span className="wb-progress-pct">{currentItem.progress}%</span>
          </div>
        </div>
      </div>

      <div className="wb-badge-footer">
        <span className="wb-footer-hint">
          <Sparkles size={11} /> 1 of 1 unique handmade specimen
        </span>
        <span className="wb-inspect-cta">Inspect Piece ⟶</span>
      </div>
    </div>
  );
};
