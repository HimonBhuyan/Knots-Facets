import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, subtotalUSD, formatPrice, clearCart, showToast } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    note: ''
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    closeCheckout();
    showToast(`✨ Thank you ${formData.name || 'friend'}! Your bespoke order has been reserved with our atelier.`, '💌');
  };

  return (
    <div className="modal-overlay active" onClick={closeCheckout}>
      <div
        className="modal-content"
        style={{ maxWidth: '540px', padding: '36px 32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={closeCheckout} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '2.2rem' }}>✨</span>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', margin: '10px 0 6px' }}>
            Atelier Checkout
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: 0 }}>
            Complete your handcrafted order with personalized studio care.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>
                Recipient Name
              </label>
              <input
                type="text"
                required
                placeholder="Elena Rostova"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="elena@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>
                Shipping Address &amp; City
              </label>
              <input
                type="text"
                required
                placeholder="14 Highfield Lane, London"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>
                Gift Message or Custom Note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Please include a handwritten gift note saying..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: '0.9rem', fontFamily: 'var(--sans)' }}
              />
            </div>
          </div>

          <div style={{ background: 'var(--surface-alt)', padding: '16px', borderRadius: '14px', marginBottom: '20px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Total Due:</span>
              <strong style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem' }}>
                {formatPrice(subtotalUSD)}
              </strong>
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>
              📦 Includes Complimentary Tracked Packaging &amp; Wax-Sealed Authenticity Note
            </div>
          </div>

          <button
            type="submit"
            className="btn-dark"
            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-pill)', fontSize: '0.9rem' }}
          >
            Confirm &amp; Reserve Pieces
          </button>
        </form>
      </div>
    </div>
  );
};
