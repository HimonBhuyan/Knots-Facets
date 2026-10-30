import React, { useRef } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice, addToCart, openQuickView } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const cardRef = useRef<HTMLDivElement>(null);
  const isSaved = isInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    cardRef.current.style.setProperty('--mouse-x', `${Math.round((x / rect.width) * 100)}%`);
    cardRef.current.style.setProperty('--mouse-y', `${Math.round((y / rect.height) * 100)}%`);
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  };

  return (
    <article
      ref={cardRef}
      className="product-card has-sheen"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-image-wrap">
        <span className={`product-badge ${product.badge === 'Bestseller' ? 'special' : ''}`}>
          {product.badge}
        </span>

        {/* Wishlist Heart Toggle */}
        <button
          className={`card-wishlist-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isSaved ? 'Saved to heirlooms' : 'Save to heirlooms'}
        >
          <Heart
            size={18}
            fill={isSaved ? '#9B7765' : 'transparent'}
            stroke={isSaved ? '#9B7765' : '#29231F'}
          />
        </button>

        <img src={product.image} alt={product.title} loading="lazy" />
        <div className="product-quick-actions">
          <button className="btn-quick-view" onClick={() => openQuickView(product)}>
            Quick View
          </button>
          <button className="btn-quick-add" onClick={() => addToCart(product.id)}>
            Add to Bag
          </button>
        </div>
      </div>
      <div className="product-body">
        <div className="product-category">{product.categoryLabel}</div>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.priceUSD)}</span>
          <span className="product-material-pill">{product.material.split('&')[0]}</span>
        </div>
      </div>
    </article>
  );
};
