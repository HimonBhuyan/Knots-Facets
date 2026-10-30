import React, { useState } from 'react';
import { PageId, LookbookItem } from '../types';
import { LOOKBOOK_ITEMS } from '../data/catalog';
import { X, ArrowRight } from 'lucide-react';

interface LookbookPageProps {
  setActivePage: (page: PageId) => void;
}

export const LookbookPage: React.FC<LookbookPageProps> = ({ setActivePage }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'crystal' | 'fibre' | 'atelier' | 'gifting'>('all');
  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);

  const filteredItems = LOOKBOOK_ITEMS.filter(
    item => activeFilter === 'all' || item.mood === activeFilter
  );

  return (
    <div className="lookbook-page">
      <section className="page-banner">
        <span className="eyebrow">Visual Journal &amp; Editorial</span>
        <h1 className="page-title">Captured in Natural Light</h1>
        <p className="page-subtitle">
          A sensory exploration of how glass crystals and handcrafted cotton crochet live in harmony with linen, daylight, and daily stillness.
        </p>
      </section>

      <div className="section-block">
        {/* Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
          <button
            className={`lb-tag ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Visuals
          </button>
          <button
            className={`lb-tag ${activeFilter === 'crystal' ? 'active' : ''}`}
            onClick={() => setActiveFilter('crystal')}
          >
            Prismatic Sunlight
          </button>
          <button
            className={`lb-tag ${activeFilter === 'fibre' ? 'active' : ''}`}
            onClick={() => setActiveFilter('fibre')}
          >
            Fibre &amp; Cotton
          </button>
          <button
            className={`lb-tag ${activeFilter === 'atelier' ? 'active' : ''}`}
            onClick={() => setActiveFilter('atelier')}
          >
            Atelier &amp; Craft
          </button>
          <button
            className={`lb-tag ${activeFilter === 'gifting' ? 'active' : ''}`}
            onClick={() => setActiveFilter('gifting')}
          >
            Keepsake Unboxing
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="lookbook-grid" style={{ marginBottom: '80px' }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="lookbook-item"
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="lookbook-overlay">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="shop-mood-link">
                  View Close-Up <ArrowRight size={13} style={{ display: 'inline', marginLeft: '4px' }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="lightbox-modal active" onClick={() => setSelectedItem(null)}>
          <div className="lightbox-wrap" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Close"
            >
              <X size={26} />
            </button>
            <img src={selectedItem.image} alt={selectedItem.title} />
            <div className="lightbox-caption">
              <h4>{selectedItem.title}</h4>
              <p>{selectedItem.desc}</p>
              <button
                className="btn-dark"
                style={{ marginTop: '16px', padding: '10px 22px', fontSize: '0.82rem' }}
                onClick={() => {
                  setSelectedItem(null);
                  setActivePage('shop');
                }}
              >
                Shop Pieces in this Mood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
