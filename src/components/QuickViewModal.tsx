import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { X, Heart, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, openCheckout, formatPrice } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgWrapRef = useRef<HTMLDivElement>(null);

  if (!quickViewProduct) return null;

  const images = quickViewProduct.galleryImages && quickViewProduct.galleryImages.length > 0
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
      <div className="modal-content quickview-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeQuickView} aria-label="Close details">
          <X size={18} />
        </button>

        <div className="quickview-grid">
          {/* Left: Gallery & Zoom Lens */}
          <div className="quickview-gallery">
            {/* Main Stage with Zoom Lens */}
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

              {/* Macro Zoom Lens Overlay */}
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

            {/* Thumbnail Carousel Strip */}
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

          {/* Right: Atelier Details & Commerce Actions */}
          <div className="quickview-details">
            <div className="quickview-badge-row">
              <span className="quickview-category">{quickViewProduct.categoryLabel}</span>
              <span className="quickview-stock-tag">
                <span className="stock-dot" /> In Studio Stock
              </span>
            </div>

            <h2 className="quickview-title">{quickViewProduct.title}</h2>
            <div className="quickview-price">{formatPrice(quickViewProduct.priceUSD)}</div>

            <p className="quickview-desc">{quickViewProduct.description}</p>

            {/* Material & Craft Specifications */}
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
                  <strong>Provenance:</strong> 100% slow handcrafted in studio; zero mass manufacturing.
                </div>
              </div>
              <div className="spec-row">
                <Truck size={16} className="spec-icon" />
                <div>
                  <strong>Gifting:</strong> Arrives in wax-sealed keepsake gift box with dried lavender sprig.
                </div>
              </div>
            </div>

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
