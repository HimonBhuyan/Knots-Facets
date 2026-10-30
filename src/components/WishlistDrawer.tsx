import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const { wishlistProducts, isWishlistOpen, closeWishlist, toggleWishlist, moveToBag } = useWishlist();
  const { formatPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`wishlist-drawer-overlay ${isWishlistOpen ? 'active' : ''}`}
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <aside
        className={`wishlist-drawer ${isWishlistOpen ? 'active' : ''}`}
        aria-label="Saved Heirlooms Wishlist"
      >
        <div className="wishlist-header">
          <div className="wishlist-title-wrap">
            <Heart size={20} className="wishlist-heart-icon" fill="#9B7765" stroke="#9B7765" />
            <h2>Saved Heirlooms ({wishlistProducts.length})</h2>
          </div>
          <button
            className="wishlist-close-btn"
            onClick={closeWishlist}
            aria-label="Close Wishlist"
          >
            <X size={18} />
          </button>
        </div>

        <div className="wishlist-promo-banner">
          <span>✨ Pieces remain reserved in your private session for 30 days.</span>
        </div>

        <div className="wishlist-items">
          {wishlistProducts.length === 0 ? (
            <div className="wishlist-empty-state">
              <div className="wishlist-empty-icon">
                <Heart size={38} stroke="#9B7765" />
              </div>
              <h3>Your wishlist is empty</h3>
              <p>Save pieces catching your eye to compare glass refractions, crochet textures, and bespoke options.</p>
              <button
                className="btn-dark"
                onClick={closeWishlist}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            wishlistProducts.map(product => (
              <div key={product.id} className="wishlist-item">
                <img
                  className="wishlist-item-img"
                  src={product.image}
                  alt={product.title}
                />
                <div className="wishlist-item-details">
                  <span className="wishlist-item-cat">{product.categoryLabel}</span>
                  <h4>{product.title}</h4>
                  <div className="wishlist-item-price">{formatPrice(product.priceUSD)}</div>

                  <div className="wishlist-item-actions">
                    <button
                      className="btn-move-to-bag"
                      onClick={() => moveToBag(product.id)}
                    >
                      <ShoppingBag size={14} />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      className="btn-remove-wishlist"
                      onClick={() => toggleWishlist(product.id)}
                      title="Remove from saved"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};
