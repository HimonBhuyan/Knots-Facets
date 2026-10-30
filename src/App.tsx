import React, { useState, useEffect, useCallback } from 'react';
import { PageId } from './types';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { usePageAnimations } from './hooks/usePageAnimations';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrderTrackerDrawer } from './components/OrderTrackerDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/ToastContainer';
import { LightRefractionOverlay } from './components/LightRefractionOverlay';
import { MobileQuickPurchaseBar } from './components/MobileQuickPurchaseBar';
import { AtelierLoader } from './components/AtelierLoader';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { StoryPage } from './pages/StoryPage';
import { LookbookPage } from './pages/LookbookPage';
import { CustomPage } from './pages/CustomPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';

const VALID_PAGES: PageId[] = ['home', 'shop', 'story', 'lookbook', 'custom', 'contact', 'checkout'];

const getPageFromHash = (): PageId => {
  const hash = window.location.hash.replace('#', '').trim().toLowerCase() as PageId;
  return VALID_PAGES.includes(hash) ? hash : 'home';
};

export const AppContent: React.FC = () => {
  const [activePage, setActivePageState] = useState<PageId>(() => getPageFromHash());
  const { isCheckoutOpen, closeCheckout } = useCart();

  const setActivePage = useCallback((page: PageId) => {
    setActivePageState(page);
    const targetHash = page === 'home' ? '#home' : `#${page}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
  }, []);

  // Sync browser Back / Forward buttons with activePage
  useEffect(() => {
    const onHashOrPop = () => {
      setActivePageState(getPageFromHash());
    };
    window.addEventListener('popstate', onHashOrPop);
    window.addEventListener('hashchange', onHashOrPop);
    return () => {
      window.removeEventListener('popstate', onHashOrPop);
      window.removeEventListener('hashchange', onHashOrPop);
    };
  }, []);

  // Route to full Checkout & Payment Gateway page whenever checkout is triggered
  useEffect(() => {
    if (isCheckoutOpen) {
      setActivePage('checkout');
      closeCheckout();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isCheckoutOpen, closeCheckout, setActivePage]);

  // Trigger animations on page mount & route change
  usePageAnimations(activePage);

  return (
    <div className="site-frame">
      {/* Bespoke Knot & Crystal Prism Preloader */}
      <AtelierLoader />

      {/* Prismatic Crystal Caustics Layer */}
      <LightRefractionOverlay />

      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <span>✨ Complimentary Handmade Gift Box on Orders Over <em>$80</em></span>
        <span>🌿 100% Slow Handcrafted in Studio</span>
      </div>

      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        isHeroPage={activePage === 'home'}
      />

      {/* Main Pages with Fade In */}
      <main id="mainContent" key={activePage} className="page-transition-wrap">
        {activePage === 'home' && <HomePage setActivePage={setActivePage} />}
        {activePage === 'shop' && <ShopPage />}
        {activePage === 'story' && <StoryPage setActivePage={setActivePage} />}
        {activePage === 'lookbook' && <LookbookPage setActivePage={setActivePage} />}
        {activePage === 'custom' && <CustomPage setActivePage={setActivePage} />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'checkout' && <CheckoutPage setActivePage={setActivePage} />}
      </main>

      {/* Luxury Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Interactive Global Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <OrderTrackerDrawer />
      <QuickViewModal />
      <ToastContainer />

      {/* Mobile Sticky 1-Tap Purchase Bar */}
      <MobileQuickPurchaseBar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <WishlistProvider>
        <AppContent />
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;
