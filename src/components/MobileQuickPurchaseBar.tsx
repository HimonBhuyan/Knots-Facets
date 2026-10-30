import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CATALOG } from '../data/catalog';
import { ShoppingBag, Heart } from 'lucide-react';

export const MobileQuickPurchaseBar: React.FC = () => {
  const { addToCart, formatPrice, openQuickView } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isVisible, setIsVisible] = useState(false);
  const featuredProduct = CATALOG[0]; // Celestial Prismatic Drop Earrings
  const isSaved = isInWishlist(featuredProduct.id);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past hero on mobile
      if (window.innerWidth <= 768) {
        setIsVisible(window.scrollY > 420);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside className="mobile-quick-purchase-bar" aria-label="Quick Purchase Drawer">
      <div className="quick-bar-product" onClick={() => openQuickView(featuredProduct)}>
        <img
          src={featuredProduct.image}
          alt={featuredProduct.title}
          className="quick-bar-thumb"
        />
        <div className="quick-bar-info">
          <span className="quick-bar-title">{featuredProduct.title}</span>
          <span className="quick-bar-price">{formatPrice(featuredProduct.priceUSD)}</span>
        </div>
      </div>

      <div className="quick-bar-actions">
        <button
          className={`quick-bar-wishlist ${isSaved ? 'saved' : ''}`}
          onClick={() => toggleWishlist(featuredProduct.id)}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={18}
            fill={isSaved ? '#9B7765' : 'transparent'}
            stroke={isSaved ? '#9B7765' : '#29231F'}
          />
        </button>

        <button
          className="btn-dark quick-bar-add-btn"
          onClick={() => addToCart(featuredProduct.id)}
        >
          <ShoppingBag size={15} />
          <span>Add to Bag</span>
        </button>
      </div>
    </aside>
  );
};
