export type Category = 'jewellery' | 'crochet' | 'gifting';

export interface Product {
  id: string;
  title: string;
  category: Category;
  categoryLabel: string;
  priceUSD: number;
  image: string;
  galleryImages?: string[];
  badge: string;
  material: string;
  description: string;
  inStock: boolean;
  tags: string[];
}

export interface CartItem {
  id: string;
  title: string;
  priceUSD: number;
  image: string;
  categoryLabel: string;
  qty: number;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyConfig {
  symbol: string;
  rate: number;
  label: string;
}

export type PageId = 'home' | 'shop' | 'story' | 'lookbook' | 'custom' | 'contact' | 'checkout';

export interface LookbookItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  mood: 'crystal' | 'fibre' | 'atelier' | 'gifting';
  moodLabel: string;
}

export interface SavedOrder {
  orderId: string;
  txnId: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethodLabel: string;
  shippingMethodLabel: string;
  items: CartItem[];
  subtotalUSD: number;
  discountUSD: number;
  shippingUSD: number;
  giftWrapUSD: number;
  totalUSD: number;
  giftNote?: string;
  stageIndex?: number; // 0..4 for 5-stage studio crafting & courier tracking
}
