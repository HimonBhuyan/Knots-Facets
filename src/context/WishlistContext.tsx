import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { CATALOG } from '../data/catalog';
import { Product } from '../types';

interface WishlistContextType {
  wishlist: string[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistProducts: Product[];
  moveToBag: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'knots_facets_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToCart, showToast } = useCart();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // storage quota or private mode
    }
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    const product = CATALOG.find(p => p.id === productId);
    const title = product?.title || 'Heirloom Piece';

    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed "${title}" from your Saved Heirlooms`, '🤍');
        return prev.filter(id => id !== productId);
      } else {
        showToast(`Saved "${title}" to your Wishlist`, '✨');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const wishlistProducts = CATALOG.filter(p => wishlist.includes(p.id));

  const moveToBag = (productId: string) => {
    addToCart(productId);
    setWishlist(prev => prev.filter(id => id !== productId));
    const product = CATALOG.find(p => p.id === productId);
    showToast(`Moved "${product?.title || 'Piece'}" to your Shopping Bag`, '🛍️');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        toggleWishlist,
        isInWishlist,
        wishlistProducts,
        moveToBag
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
