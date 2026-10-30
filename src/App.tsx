import React, { useState } from 'react';
import { PageId } from './types';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { usePageAnimations } from './hooks/usePageAnimations';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/ToastContainer';
import { LightRefractionOverlay } from './components/LightRefractionOverlay';
import { MobileQuickPurchaseBar } from './components/MobileQuickPurchaseBar';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { StoryPage } from './pages/StoryPage';
import { LookbookPage } from './pages/LookbookPage';
import { CustomPage } from './pages/CustomPage';
import { ContactPage } from './pages/ContactPage';

export const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('home');

  // Trigger animations on page mount & route change
  usePageAnimations(activePage);

  return (
    <div className="site-frame">
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
      </main>

      {/* Luxury Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Interactive Global Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <CheckoutModal />
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
