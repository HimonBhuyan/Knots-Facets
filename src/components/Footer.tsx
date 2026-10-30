import React, { useState } from 'react';
import { PageId } from '../types';
import { useCart } from '../context/CartContext';

interface FooterProps {
  setActivePage: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('✨ Thank you for subscribing! Use code KNOTS10 for 10% off your order.', '💌');
    setEmail('');
  };

  const navTo = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Knots &amp; Facets</h3>
          <p>A dual-discipline handmade atelier based in Guwahati, Assam. Glass and crystal pieces that refract light, crochet accessories that bring warmth to daily life.</p>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
            EST. GUWAHATI ATELIER · ALL RIGHTS RESERVED
          </span>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><button onClick={() => navTo('home')}>Home</button></li>
            <li><button onClick={() => navTo('shop')}>Shop Catalog</button></li>
            <li><button onClick={() => navTo('story')}>Our Story</button></li>
            <li><button onClick={() => navTo('lookbook')}>Lookbook</button></li>
            <li><button onClick={() => navTo('custom')}>Bespoke Orders</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><button onClick={() => navTo('custom')}>Jewellery &amp; Fibre Care</button></li>
            <li><button onClick={() => navTo('contact')}>Shipping &amp; Delivery</button></li>
            <li><button onClick={() => navTo('contact')}>Studio Visits</button></li>
            <li><button onClick={() => navTo('custom')}>Bridal Commissions</button></li>
            <li><button onClick={() => navTo('contact')}>Direct Enquiries</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Studio Journal</h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', marginBottom: '12px' }}>
            Receive secret collection previews and 10% off your first handcrafted order.
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Knots &amp; Facets. Handcrafted with care in Guwahati, Assam.</span>
        <span>Thoughtfully made slow goods · Plastic-free packaging</span>
      </div>
    </footer>
  );
};
