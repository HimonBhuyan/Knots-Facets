import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CurrencyCode } from '../types';
import { CATALOG, CURRENCIES } from '../data/catalog';

interface Toast {
  id: string;
  message: string;
  icon?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotalUSD: number;
  activeCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usd: number) => string;
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  toasts: Toast[];
  showToast: (message: string, icon?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('kf_currency') as CurrencyCode;
      return saved && CURRENCIES[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('kf_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kf_currency', activeCurrency);
    } catch {}
  }, [activeCurrency]);

  const showToast = (message: string, icon = '✨') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const formatPrice = (usd: number): string => {
    const conf = CURRENCIES[activeCurrency] || CURRENCIES.USD;
    const converted = Math.round(usd * conf.rate);
    return `${conf.symbol}${converted.toLocaleString()}`;
  };

  const addToCart = (productId: string, qty = 1) => {
    const product = CATALOG.find(p => p.id === productId);
    if (!product) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            priceUSD: product.priceUSD,
            image: product.image,
            categoryLabel: product.categoryLabel,
            qty
          }
        ];
      }
    });

    showToast(`"${product.title}" added to your bag`, '🛍️');
    setIsCartOpen(true);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.id === productId);
    setCart(prev => prev.filter(i => i.id !== productId));
    if (item) showToast(`Removed "${item.title}" from bag`, '🌿');
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotalUSD = cart.reduce((sum, item) => sum + item.priceUSD * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotalUSD,
        activeCurrency,
        setCurrency: setActiveCurrency,
        formatPrice,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        toasts,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
