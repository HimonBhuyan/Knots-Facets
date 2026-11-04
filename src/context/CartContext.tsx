import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CurrencyCode, SavedOrder } from '../types';
import { CATALOG, CURRENCIES } from '../data/catalog';
import { verifyOrderOwnership, decodeOrderToken } from '../utils/orderSecurity';

interface Toast {
  id: string;
  message: string;
  icon?: string;
}

export const SAMPLE_INITIAL_ORDER: SavedOrder = {
  orderId: 'KF-2026-841920',
  txnId: 'pay_KF982A71BC',
  date: 'Oct 28, 2026',
  customerName: 'Aarav Sharma',
  email: 'aarav.collector@example.com',
  phone: '+91 98765 43210',
  address: '42 Roseberry Lane, Uzan Bazar, Suite 3B',
  city: 'Guwahati',
  state: 'Assam',
  postalCode: '781001',
  country: 'India',
  paymentMethodLabel: 'VISA••••8894 (256-Bit SSL Card Gateway)',
  shippingMethodLabel: 'Priority Express Air Courier (2–3 Business Days)',
  items: [
    {
      id: CATALOG[0].id,
      title: CATALOG[0].title,
      priceUSD: CATALOG[0].priceUSD,
      image: CATALOG[0].image,
      categoryLabel: CATALOG[0].categoryLabel,
      qty: 1
    },
    {
      id: CATALOG[3].id,
      title: CATALOG[3].title,
      priceUSD: CATALOG[3].priceUSD,
      image: CATALOG[3].image,
      categoryLabel: CATALOG[3].categoryLabel,
      qty: 1
    }
  ],
  subtotalUSD: 84,
  discountUSD: 0,
  shippingUSD: 0,
  giftWrapUSD: 0,
  totalUSD: 84,
  giftNote: 'May these facets catch every morning sunrise.',
  stageIndex: 2
};

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotalUSD: number;
  activeCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usd: number) => string;
  addToCart: (productId: string, qty?: number) => void;
  addCustomItemToCart: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
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
  orders: SavedOrder[];
  saveOrder: (order: SavedOrder) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  lookupGuestOrder: (orderId: string, contactDetail: string) => { success: boolean; order?: SavedOrder; error?: string };
  importOrderFromToken: (token: string) => SavedOrder | null;
  isOrdersOpen: boolean;
  openOrders: (orderId?: string | unknown) => void;
  closeOrders: () => void;
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

  const [orders, setOrders] = useState<SavedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kf_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [SAMPLE_INITIAL_ORDER];
    } catch {
      return [SAMPLE_INITIAL_ORDER];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
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

  useEffect(() => {
    try {
      localStorage.setItem('kf_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

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

  const addCustomItemToCart = (customItem: Omit<CartItem, 'qty'>, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === customItem.id);
      if (existing) {
        return prev.map(item =>
          item.id === customItem.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...customItem, qty }];
    });

    showToast(`"${customItem.title}" added to your bag`, '✨');
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

  // Master list of all orders created in atelier session / local registry
  const getAllKnownOrders = (): SavedOrder[] => {
    try {
      const allSaved = localStorage.getItem('kf_all_orders');
      const allList: SavedOrder[] = allSaved ? JSON.parse(allSaved) : [];
      const map = new Map<string, SavedOrder>();
      [SAMPLE_INITIAL_ORDER, ...orders, ...allList].forEach(ord => {
        if (ord && ord.orderId) {
          map.set(ord.orderId.trim().toUpperCase(), ord);
        }
      });
      return Array.from(map.values());
    } catch {
      return [SAMPLE_INITIAL_ORDER, ...orders];
    }
  };

  const persistToAllOrders = (ord: SavedOrder) => {
    try {
      const known = getAllKnownOrders();
      const map = new Map<string, SavedOrder>();
      known.forEach(o => map.set(o.orderId.trim().toUpperCase(), o));
      map.set(ord.orderId.trim().toUpperCase(), ord);
      localStorage.setItem('kf_all_orders', JSON.stringify(Array.from(map.values())));
    } catch {}
  };

  const saveOrder = (newOrder: SavedOrder) => {
    const readyOrder = { ...newOrder, stageIndex: newOrder.stageIndex ?? 1 };
    setOrders(prev => {
      const filtered = prev.filter(o => o.orderId !== readyOrder.orderId);
      return [readyOrder, ...filtered];
    });
    persistToAllOrders(readyOrder);
    setSelectedOrderId(readyOrder.orderId);
  };

  const lookupGuestOrder = (orderId: string, contactDetail: string) => {
    const cleanId = (orderId || '').trim().toUpperCase().replace(/^#/, '');
    if (!cleanId) {
      return { success: false, error: 'Please enter an Order ID (e.g. KF-2026-841920).' };
    }
    if (!contactDetail || !contactDetail.trim()) {
      return { success: false, error: 'Please enter the Billing Email or Phone used during checkout.' };
    }

    const allOrders = getAllKnownOrders();
    const candidate = allOrders.find(
      o => o.orderId.trim().toUpperCase().replace(/^#/, '') === cleanId
    );

    if (!candidate) {
      return {
        success: false,
        error: `No parcel found with Order ID #${cleanId}. Please verify the ID on your invoice or receipt.`
      };
    }

    const isMatch = verifyOrderOwnership(candidate, contactDetail);
    if (!isMatch) {
      return {
        success: false,
        error: `The contact detail entered does not match Order #${cleanId}. Please verify your email or phone.`
      };
    }

    setOrders(prev => {
      const exists = prev.some(o => o.orderId === candidate.orderId);
      return exists ? prev : [candidate, ...prev];
    });
    setSelectedOrderId(candidate.orderId);
    showToast(`✨ Verified Order #${candidate.orderId} and linked to this device!`, '📦');
    return { success: true, order: candidate };
  };

  const importOrderFromToken = (token: string): SavedOrder | null => {
    const decoded = decodeOrderToken(token);
    if (!decoded) return null;

    setOrders(prev => {
      const filtered = prev.filter(o => o.orderId !== decoded.orderId);
      return [decoded, ...filtered];
    });
    persistToAllOrders(decoded);
    setSelectedOrderId(decoded.orderId);
    setIsOrdersOpen(true);
    showToast(`✨ Order #${decoded.orderId} loaded via secure direct link!`, '🔗');
    return decoded;
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

  const openOrders = (orderId?: string | unknown) => {
    if (typeof orderId === 'string' && orderId) setSelectedOrderId(orderId);
    setIsOrdersOpen(true);
  };
  const closeOrders = () => setIsOrdersOpen(false);

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
        addCustomItemToCart,
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
        orders,
        saveOrder,
        selectedOrderId,
        setSelectedOrderId,
        lookupGuestOrder,
        importOrderFromToken,
        isOrdersOpen,
        openOrders,
        closeOrders,
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
