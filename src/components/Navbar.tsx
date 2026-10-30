import React, { useState, useEffect } from 'react';
import { PageId, CurrencyCode } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CURRENCIES } from '../data/catalog';
import { ShoppingBag, Menu, Heart } from 'lucide-react';
import { SidebarDrawer } from './SidebarDrawer';
import { StudioSoundscape } from './StudioSoundscape';

interface NavbarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  isHeroPage?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, isHeroPage }) => {
  const { cartCount, openCart, activeCurrency, setCurrency } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 450);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'story', label: 'Our Story' },
    { id: 'lookbook', label: 'Lookbook' },
    { id: 'custom', label: 'Custom Orders' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: PageId) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`site-nav ${isScrolled ? 'scrolled' : ''} ${isHeroPage ? 'hero-nav-fixed' : ''}`} role="banner">
        {/* Mobile Left Menu Trigger */}
        <button
          className="mobile-menu-trigger"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open Atelier Menu & Sidebar"
        >
          <Menu size={22} />
          <span className="menu-btn-label">Menu</span>
        </button>

        {/* Brand Logo & Name */}
        <button className="brand" onClick={() => handleNavClick('home')} aria-label="Knots & Facets Home">
          <svg viewBox="0 0 40 40" fill="none" stroke="#29231F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 4.5 31.5 14 20 35.5 8.5 14z" />
            <path d="M8.5 14h23M14.2 14 20 4.5 25.8 14M14.2 14 20 35.5 25.8 14" stroke="#9B7765" strokeWidth="1" />
            <path d="M5 27c0-6 8-6 8 0s-9 7-9 1 9-14 18-10 4 13-4 10" stroke="#29231F" strokeWidth="1.2" />
          </svg>
          <span className="brand-text">Knots &amp; Facets</span>
        </button>

        {/* Desktop Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.id}>
                <button
                  className={activePage === link.id ? 'active' : ''}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Nav Actions (Soundscape, Wishlist, Currency, Cart, Desktop Sidebar Toggle) */}
        <div className="nav-actions">
          {/* Ambient Soundscape Engine */}
          <StudioSoundscape />

          {/* Wishlist Heirlooms Button */}
          <button
            className="nav-icon-btn nav-wishlist-btn"
            onClick={openWishlist}
            aria-label="Open Saved Wishlist"
            title="Saved Heirlooms"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="badge-count wishlist-badge">
                {wishlistCount}
              </span>
            )}
          </button>

          <select
            className="currency-select"
            value={activeCurrency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            aria-label="Select Currency"
          >
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map(code => (
              <option key={code} value={code}>
                {CURRENCIES[code].symbol} {code}
              </option>
            ))}
          </select>

          <button className="nav-icon-btn" onClick={openCart} aria-label="Open Shopping Bag">
            <ShoppingBag size={18} />
            <span className={`badge-count ${cartBump ? 'bump' : ''}`}>
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* Luxury Atelier Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
        setActivePage={setActivePage}
      />
    </>
  );
};
