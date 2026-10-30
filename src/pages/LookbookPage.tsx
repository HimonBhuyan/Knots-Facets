import React, { useState } from 'react';
import { PageId, LookbookItem, Product } from '../types';
import { LOOKBOOK_ITEMS, CATALOG } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { X, ArrowRight, Sparkles, ShoppingBag, Eye } from 'lucide-react';

interface LookbookPageProps {
  setActivePage: (page: PageId) => void;
}

export const LookbookPage: React.FC<LookbookPageProps> = ({ setActivePage }) => {
  const { addToCart, openQuickView, formatPrice } = useCart();
  const [activeFilter, setActiveFilter] = useState<'all' | 'crystal' | 'fibre' | 'atelier' | 'gifting'>('all');
  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);

  const filteredItems = LOOKBOOK_ITEMS.filter(
    item => activeFilter === 'all' || item.mood === activeFilter
  );

  // Match each Lookbook editorial shot with its corresponding catalog product
  const getMatchedProduct = (item: LookbookItem): Product => {
    const byImage = CATALOG.find(p => p.image === item.image);
    if (byImage) return byImage;
    return CATALOG[0];
  };

  return (
    <div className="lookbook-page">
      <section className="page-banner">
        <span className="eyebrow">Visual Journal &amp; Interactive Shop-the-Look</span>
        <h1 className="page-title">Captured in Natural Light</h1>
        <p className="page-subtitle">
          A sensory exploration of how glass crystals and handcrafted cotton crochet live in harmony with linen, daylight, and daily stillness. Click any crystal hotspot to inspect or collect the featured piece.
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

        {/* Gallery Grid with Interactive Shop-the-Look Hotspots */}
        <div className="lookbook-grid" style={{ marginBottom: '80px' }}>
          {filteredItems.map(item => {
            const matchedProduct = getMatchedProduct(item);
            return (
              <div
                key={item.id}
                className="lookbook-item"
                onClick={() => setSelectedItem(item)}
                role="button"
                tabIndex={0}
              >
                <img src={item.image} alt={item.title} loading="lazy" />

                {/* Interactive Shop-the-Look Crystal Hotspot Pill */}
                <div
                  className="lb-hotspot-pill"
                  onClick={e => {
                    e.stopPropagation();
                    openQuickView(matchedProduct);
                  }}
                  title={`Inspect ${matchedProduct.title}`}
                >
                  <span className="lb-hotspot-dot" />
                  <span className="lb-hotspot-label">
                    {matchedProduct.title.split(' ').slice(0, 3).join(' ')} &bull;{' '}
                    <strong>{formatPrice(matchedProduct.priceUSD)}</strong>
                  </span>
                </div>

                <div className="lookbook-overlay">
                  <span className="lb-mood-chip">{item.moodLabel}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="lb-overlay-actions">
                    <button
                      type="button"
                      className="lb-quick-btn"
                      onClick={e => {
                        e.stopPropagation();
                        openQuickView(matchedProduct);
                      }}
                    >
                      <Eye size={13} />
                      <span>Quick Inspect</span>
                    </button>
                    <button
                      type="button"
                      className="lb-quick-btn primary"
                      onClick={e => {
                        e.stopPropagation();
                        addToCart(matchedProduct.id, 1);
                      }}
                    >
                      <ShoppingBag size={13} />
                      <span>Add {formatPrice(matchedProduct.priceUSD)}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal with Direct Product Card */}
      {selectedItem && (() => {
        const matchedProduct = getMatchedProduct(selectedItem);
        return (
          <div className="lightbox-modal active" onClick={() => setSelectedItem(null)}>
            <div className="lightbox-wrap" onClick={e => e.stopPropagation()}>
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

                <div className="lightbox-shop-bar">
                  <div className="lbs-left">
                    <Sparkles size={16} color="#C29B38" />
                    <div>
                      <small>FEATURED IN THIS FRAME</small>
                      <strong>
                        {matchedProduct.title} — {formatPrice(matchedProduct.priceUSD)}
                      </strong>
                    </div>
                  </div>
                  <div className="lbs-actions">
                    <button
                      type="button"
                      className="btn-dark"
                      style={{ padding: '9px 18px', fontSize: '0.78rem' }}
                      onClick={() => {
                        addToCart(matchedProduct.id, 1);
                        setSelectedItem(null);
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Bag</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        padding: '9px 18px',
                        fontSize: '0.78rem',
                        color: '#FFFCF8',
                        borderColor: 'rgba(255,252,248,0.35)'
                      }}
                      onClick={() => {
                        setSelectedItem(null);
                        setActivePage('shop');
                      }}
                    >
                      <span>View Full Catalog</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
