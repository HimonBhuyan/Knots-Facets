import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { X, Heart, Sparkles, ShieldCheck, Truck, Ruler, Star, CheckCircle2 } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, openCheckout, formatPrice } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'size' | 'reviews'>('specs');
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgWrapRef = useRef<HTMLDivElement>(null);

  if (!quickViewProduct) return null;

  const images =
    quickViewProduct.galleryImages && quickViewProduct.galleryImages.length > 0
      ? quickViewProduct.galleryImages
      : [quickViewProduct.image];

  const currentImage = images[activeImageIndex] || quickViewProduct.image;
  const isSaved = isInWishlist(quickViewProduct.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgWrapRef.current) return;
    const rect = imgWrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div className="modal-overlay active" onClick={closeQuickView}>
      <div className="modal-content quickview-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeQuickView} aria-label="Close details">
          <X size={18} />
        </button>

        <div className="quickview-grid">
          {/* Left: Gallery & Zoom Lens */}
          <div className="quickview-gallery">
            <div
              ref={imgWrapRef}
              className="quickview-main-img-wrap"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={currentImage}
                alt={quickViewProduct.title}
                className="quickview-main-img"
              />

              {isZooming && (
                <div
                  className="quickview-zoom-lens"
                  style={{
                    backgroundImage: `url(${currentImage})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '250%'
                  }}
                />
              )}

              <span className="zoom-hint">
                <Sparkles size={13} /> Hover to inspect facets &amp; stitches
              </span>
            </div>

            {images.length > 1 && (
              <div className="quickview-thumbs-strip">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`quickview-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Atelier Details, Tabs & Commerce Actions */}
          <div className="quickview-details">
            <div className="quickview-badge-row">
              <span className="quickview-category">{quickViewProduct.categoryLabel}</span>
              <span className="quickview-stock-tag">
                <span className="stock-dot" /> In Studio Stock
              </span>
            </div>

            <h2 className="quickview-title">{quickViewProduct.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div className="quickview-price" style={{ margin: 0 }}>
                {formatPrice(quickViewProduct.priceUSD)}
              </div>
              <span className="qv-rating-pill" onClick={() => setActiveTab('reviews')}>
                ★★★★★ <strong>4.9</strong> (28 Reviews)
              </span>
            </div>

            <p className="quickview-desc">{quickViewProduct.description}</p>

            {/* Interactive Detail Tabs */}
            <div className="qv-tabs-nav">
              <button
                type="button"
                className={`qv-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                <ShieldCheck size={14} />
                <span>Provenance</span>
              </button>
              <button
                type="button"
                className={`qv-tab-btn ${activeTab === 'size' ? 'active' : ''}`}
                onClick={() => setActiveTab('size')}
              >
                <Ruler size={14} />
                <span>Size &amp; Fit Guide</span>
              </button>
              <button
                type="button"
                className={`qv-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <Star size={14} />
                <span>Reviews (28)</span>
              </button>
            </div>

            {activeTab === 'specs' && (
              <div className="quickview-specs-card">
                <div className="spec-row">
                  <ShieldCheck size={16} className="spec-icon" />
                  <div>
                    <strong>Materials:</strong> {quickViewProduct.material}
                  </div>
                </div>
                <div className="spec-row">
                  <Sparkles size={16} className="spec-icon" />
                  <div>
                    <strong>Provenance:</strong> 100% slow handcrafted in Guwahati studio; zero mass manufacturing.
                  </div>
                </div>
                <div className="spec-row">
                  <Truck size={16} className="spec-icon" />
                  <div>
                    <strong>Gifting:</strong> Arrives in wax-sealed keepsake box with dried French lavender sprig.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'size' && (
              <div className="quickview-specs-card qv-size-guide">
                {quickViewProduct.category === 'jewellery' ? (
                  <>
                    <div className="qv-size-row">
                      <span>Crystal Facet Drop</span>
                      <strong>38 mm &times; 12 mm (Featherlight 4.2g)</strong>
                    </div>
                    <div className="qv-size-row">
                      <span>Chain / Earwire Spec</span>
                      <strong>18&quot; + 2&quot; Extender &bull; Hypoallergenic Nickel-Free</strong>
                    </div>
                    <div className="qv-size-row">
                      <span>Care &amp; Storage</span>
                      <strong>Store in enclosed velvet pouch; wipe facets with soft linen</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="qv-size-row">
                      <span>Handwoven Dimensions</span>
                      <strong>36 cm W &times; 32 cm H &bull; 24 cm Strap Drop</strong>
                    </div>
                    <div className="qv-size-row">
                      <span>Fibre Gauge &amp; Weight</span>
                      <strong>4-Ply Unbleached Combed Cotton (Pre-shrunk)</strong>
                    </div>
                    <div className="qv-size-row">
                      <span>Care Instructions</span>
                      <strong>Gentle cold handwash with mild botanical soap; dry flat</strong>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="quickview-specs-card qv-reviews-list">
                <div className="qv-review-item">
                  <div className="qv-rev-head">
                    <span>★★★★★</span>
                    <small>
                      <CheckCircle2 size={11} /> Verified Collector &bull; Clara M. (London)
                    </small>
                  </div>
                  <p>
                    “Even more luminous in person. When morning light hits the facets, tiny rainbows dance across my studio desk.”
                  </p>
                </div>
                <div className="qv-review-item">
                  <div className="qv-rev-head">
                    <span>★★★★★</span>
                    <small>
                      <CheckCircle2 size={11} /> Verified Collector &bull; Ananya D. (Bengaluru)
                    </small>
                  </div>
                  <p>
                    “The wax-sealed lavender unboxing felt like opening a heirloom letter. Impeccable handmade quality.”
                  </p>
                </div>
              </div>
            )}

            {/* Commerce Actions */}
            <div className="quickview-cta-row">
              <button
                className="btn-dark quickview-add-btn"
                onClick={() => {
                  addToCart(quickViewProduct.id);
                  closeQuickView();
                }}
              >
                Add to Bag • {formatPrice(quickViewProduct.priceUSD)}
              </button>

              <button
                className="btn-secondary quickview-buy-now-btn"
                onClick={() => {
                  addToCart(quickViewProduct.id);
                  closeQuickView();
                  openCheckout();
                }}
              >
                Buy Now →
              </button>

              <button
                className={`quickview-wishlist-btn ${isSaved ? 'saved' : ''}`}
                onClick={() => toggleWishlist(quickViewProduct.id)}
                aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                title={isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}
              >
                <Heart
                  size={20}
                  fill={isSaved ? '#9B7765' : 'transparent'}
                  stroke={isSaved ? '#9B7765' : '#29231F'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
