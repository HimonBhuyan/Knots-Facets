import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotalUSD,
    isCartOpen,
    closeCart,
    updateQty,
    removeFromCart,
    openCheckout,
    formatPrice
  } = useCart();

  const thresholdUSD = 80;
  const isFreeGiftUnlocked = subtotalUSD >= thresholdUSD;
  const remainingUSD = Math.max(0, thresholdUSD - subtotalUSD);
  const progressPercent = Math.min(100, Math.round((subtotalUSD / thresholdUSD) * 100));

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={closeCart}
      />
      <aside className={`cart-drawer ${isCartOpen ? 'active' : ''}`} aria-label="Shopping Bag">
        <div className="cart-header">
          <h2>Your Bag ({cartCount})</h2>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Close Bag">
            <X size={18} />
          </button>
        </div>

        <div className="cart-free-shipping">
          <div>
            {isFreeGiftUnlocked ? (
              <span>🎉 <strong>Complimentary Keepsake Gift Box Unlocked!</strong></span>
            ) : (
              <span>
                Add <strong>{formatPrice(remainingUSD)}</strong> more for a Complimentary Keepsake Gift Box!
              </span>
            )}
          </div>
          <div className="cart-free-shipping-bar">
            <div
              className="cart-free-shipping-progress"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px', stroke: 'var(--accent)', marginBottom: '16px' }}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, margin: '0 0 8px' }}>
                Your bag is empty
              </h3>
              <p style={{ fontSize: '0.9rem', margin: '0 0 20px', color: 'var(--ink-soft)' }}>
                Explore our glass facets and slow crochet pieces to find something unique.
              </p>
              <button className="btn-secondary" onClick={closeCart}>
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img className="cart-item-img" src={item.image} alt={item.title} />
                <div className="cart-item-details">
                  <h4>{item.title}</h4>
                  <div className="cart-item-price">{formatPrice(item.priceUSD)}</div>
                  <div className="cart-qty-ctrl">
                    <button onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove item"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal-row">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotalUSD)}</strong>
            </div>
            <p className="cart-note-text">
              🌿 Every item is packed with recycled tissue & sealed with handwritten wax stamp.
            </p>
            <button className="cart-checkout-btn" onClick={openCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
