import React from 'react';
import { PageId, CurrencyCode } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CURRENCIES } from '../data/catalog';
import { X, Sparkles, Heart, Feather, ShoppingBag, ArrowRight } from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activePage,
  setActivePage
}) => {
  const { activeCurrency, setCurrency, cartCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();

  const handleLinkClick = (id: PageId) => {
    setActivePage(id);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: Array<{ id: PageId; label: string; num: string; sub: string }> = [
    { id: 'home', label: 'Home', num: '01', sub: 'Atelier Introduction & Reveal' },
    { id: 'shop', label: 'Shop Catalog', num: '02', sub: 'Handcrafted Glass & Fibre' },
    { id: 'story', label: 'Our Story', num: '03', sub: 'Philosophy & Craft Lineage' },
    { id: 'lookbook', label: 'Lookbook', num: '04', sub: 'Editorial Masonry Visuals' },
    { id: 'custom', label: 'Custom Orders', num: '05', sub: '4-Step Bespoke Configurator' },
    { id: 'contact', label: 'Concierge & Care', num: '06', sub: 'Inquiries & Studio Care' },
  ];

  return (
    <>
      {/* Backdrop blur overlay */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Luxury Atelier Sidebar Drawer */}
      <aside
        className={`sidebar-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Atelier Navigation Sidebar"
        aria-hidden={!isOpen}
      >
        <div className="sidebar-inner">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-brand" onClick={() => handleLinkClick('home')}>
              <img
                src="/images/logo-mark.png"
                alt=""
                className="sidebar-logo-img"
                width="44"
                height="44"
                decoding="async"
              />
              <div>
                <h3>Knots &amp; Facets</h3>
                <span className="sidebar-tagline">Artisan Jewelry &amp; Adornments</span>
              </div>
            </div>

            <button
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Bag & Wishlist Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
            <div className="sidebar-bag-bar" style={{ marginBottom: 0 }} onClick={() => { onClose(); openCart(); }}>
              <div className="sidebar-bag-info">
                <ShoppingBag size={17} />
                <span>Bag</span>
              </div>
              <span className="sidebar-bag-count">{cartCount}</span>
            </div>

            <div className="sidebar-bag-bar" style={{ marginBottom: 0 }} onClick={() => { onClose(); openWishlist(); }}>
              <div className="sidebar-bag-info">
                <Heart size={17} />
                <span>Saved</span>
              </div>
              <span className="sidebar-bag-count" style={{ background: 'var(--ink)' }}>{wishlistCount}</span>
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="sidebar-nav">
            <div className="sidebar-section-title">Navigation</div>
            <ul className="sidebar-nav-list">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    className={`sidebar-nav-btn ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => handleLinkClick(item.id)}
                  >
                    <span className="sidebar-num">{item.num}</span>
                    <div className="sidebar-link-text">
                      <span className="sidebar-label">{item.label}</span>
                      <small className="sidebar-sub">{item.sub}</small>
                    </div>
                    <ArrowRight size={16} className="sidebar-arrow" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Curated Categories */}
          <div className="sidebar-categories">
            <div className="sidebar-section-title">Collections</div>
            <div className="sidebar-cats-grid">
              <button
                className="sidebar-cat-pill"
                onClick={() => handleLinkClick('shop')}
              >
                <Sparkles size={14} />
                <span>Glass &amp; Crystal</span>
              </button>
              <button
                className="sidebar-cat-pill"
                onClick={() => handleLinkClick('shop')}
              >
                <Feather size={14} />
                <span>Crochet &amp; Fibre</span>
              </button>
              <button
                className="sidebar-cat-pill"
                onClick={() => handleLinkClick('custom')}
              >
                <Heart size={14} />
                <span>Bespoke Bridal</span>
              </button>
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="sidebar-currency-wrap">
            <label htmlFor="sidebarCurrency">Atelier Currency</label>
            <select
              id="sidebarCurrency"
              className="sidebar-currency-select"
              value={activeCurrency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map(code => (
                <option key={code} value={code}>
                  {CURRENCIES[code].label} ({CURRENCIES[code].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Action CTA */}
          <div className="sidebar-actions">
            <button
              className="btn-dark sidebar-cta"
              onClick={() => handleLinkClick('custom')}
            >
              Commission Bespoke Piece
            </button>
          </div>

          {/* Studio Heritage Footer */}
          <div className="sidebar-footer">
            <p>🌿 100% Handcrafted slowly in Guwahati, Assam</p>
            <p>📦 Plastic-free packaging with wax seal</p>
            <span className="sidebar-est">EST. 2026 · GUWAHATI ATELIER</span>
          </div>
        </div>
      </aside>
    </>
  );
};
