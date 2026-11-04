import { SavedOrder } from '../types';

/**
 * Normalizes phone numbers by stripping all non-digit characters
 */
export const cleanPhone = (phone: string): string => {
  return (phone || '').replace(/\D/g, '');
};

/**
 * Generates a clean 6-character deterministic verification key
 * based on the Order ID and customer email
 */
export const generateOrderKey = (orderId: string, email: string): string => {
  const seed = `${orderId.trim().toUpperCase()}:${(email || '').trim().toLowerCase()}`;
  let hash = 0x811c9dc5; // FNV-1a 32-bit offset
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return hex.slice(0, 6).toUpperCase();
};

/**
 * Checks whether a given contact input (email or phone) matches an order's record.
 * Handles case-insensitivity, whitespace, international country code prefixes, and formatting.
 */
export const verifyOrderOwnership = (order: SavedOrder, contactInput: string): boolean => {
  if (!order || !contactInput) return false;
  const raw = contactInput.trim();
  if (!raw) return false;

  // 1. Check Email
  if (raw.includes('@')) {
    const inputEmail = raw.toLowerCase();
    const orderEmail = (order.email || '').trim().toLowerCase();
    return orderEmail === inputEmail;
  }

  // 2. Check Phone (digits only comparison)
  const inputDigits = cleanPhone(raw);
  const orderDigits = cleanPhone(order.phone || '');

  if (inputDigits.length >= 6 && orderDigits.length >= 6) {
    if (inputDigits === orderDigits) return true;
    // Handle phone with/without country code (e.g. 9876543210 vs 919876543210)
    if (orderDigits.endsWith(inputDigits) || inputDigits.endsWith(orderDigits)) {
      return true;
    }
  }

  // 3. Optional fallback: match exact full customer name (case-insensitive)
  if (raw.length >= 3 && order.customerName) {
    if (order.customerName.trim().toLowerCase() === raw.toLowerCase()) {
      return true;
    }
  }

  return false;
};

/**
 * UTF-8 safe URL-safe Base64 encoder
 */
const utf8ToBase64Url = (str: string): string => {
  const utf8Bytes = encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode(parseInt(p1, 16))
  );
  return btoa(utf8Bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * UTF-8 safe URL-safe Base64 decoder
 */
const base64UrlToUtf8 = (base64Url: string): string => {
  let b64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const esc = Array.prototype.map
    .call(bin, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('');
  return decodeURIComponent(esc);
};

/**
 * Encodes a SavedOrder into a portable URL-safe token.
 * This allows an order to be transmitted directly to any device via URL or QR code,
 * requiring zero account login or server database.
 */
export const encodeOrderToken = (order: SavedOrder): string => {
  try {
    // Keep essential order fields for a compact token
    const payload = {
      id: order.orderId,
      tx: order.txnId,
      d: order.date,
      cn: order.customerName,
      em: order.email,
      ph: order.phone,
      ad: order.address,
      ci: order.city,
      st: order.state,
      pc: order.postalCode,
      co: order.country,
      pm: order.paymentMethodLabel,
      sm: order.shippingMethodLabel,
      it: order.items.map(i => ({
        id: i.id,
        t: i.title,
        p: i.priceUSD,
        img: i.image,
        c: i.categoryLabel,
        q: i.qty
      })),
      sub: order.subtotalUSD,
      dis: order.discountUSD,
      shp: order.shippingUSD,
      gw: order.giftWrapUSD,
      tot: order.totalUSD,
      gn: order.giftNote,
      stg: order.stageIndex ?? 1
    };
    return utf8ToBase64Url(JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to encode order token:', err);
    return '';
  }
};

/**
 * Decodes a URL-safe token back into a full SavedOrder object.
 */
export const decodeOrderToken = (token: string): SavedOrder | null => {
  if (!token) return null;
  try {
    const jsonStr = base64UrlToUtf8(token);
    const p = JSON.parse(jsonStr);

    if (!p || (!p.id && !p.orderId)) return null;

    return {
      orderId: p.id || p.orderId,
      txnId: p.tx || p.txnId || `pay_${(p.id || '').replace(/\D/g, '')}`,
      date: p.d || p.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: p.cn || p.customerName || 'Valued Collector',
      email: p.em || p.email || 'collector@knotsandfacets.com',
      phone: p.ph || p.phone || '',
      address: p.ad || p.address || 'Studio Delivery Address',
      city: p.ci || p.city || 'Guwahati',
      state: p.st || p.state || 'Assam',
      postalCode: p.pc || p.postalCode || '781001',
      country: p.co || p.country || 'India',
      paymentMethodLabel: p.pm || p.paymentMethodLabel || 'Settled Gateway Payment',
      shippingMethodLabel: p.sm || p.shippingMethodLabel || 'Priority Express Courier',
      items: Array.isArray(p.it)
        ? p.it.map((item: any) => ({
            id: item.id,
            title: item.t || item.title,
            priceUSD: item.p ?? item.priceUSD ?? 0,
            image: item.img || item.image || '/images/logo-mark.png',
            categoryLabel: item.c || item.categoryLabel || 'Atelier Creation',
            qty: item.q ?? item.qty ?? 1
          }))
        : Array.isArray(p.items)
        ? p.items
        : [],
      subtotalUSD: p.sub ?? p.subtotalUSD ?? (p.tot ?? p.totalUSD ?? 0),
      discountUSD: p.dis ?? p.discountUSD ?? 0,
      shippingUSD: p.shp ?? p.shippingUSD ?? 0,
      giftWrapUSD: p.gw ?? p.giftWrapUSD ?? 0,
      totalUSD: p.tot ?? p.totalUSD ?? 0,
      giftNote: p.gn || p.giftNote,
      stageIndex: p.stg ?? p.stageIndex ?? 1
    };
  } catch (err) {
    console.error('Failed to decode order token:', err);
    return null;
  }
};

/**
 * Builds the direct tracking links for an order.
 * - fullUrl: carries the token, ensuring 100% cross-device transfer even if the phone has never visited the site before.
 * - shortUrl: clean vanity URL using Order ID and verification key.
 */
export const buildOrderDirectUrl = (
  order: SavedOrder,
  baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://knots-facets.vercel.app/'
): { fullUrl: string; shortUrl: string; key: string } => {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const key = generateOrderKey(order.orderId, order.email);
  const token = encodeOrderToken(order);

  const shortUrl = `${cleanBase}/#orders?id=${encodeURIComponent(order.orderId)}&key=${key}`;
  const fullUrl = token ? `${shortUrl}&token=${token}` : shortUrl;

  return { fullUrl, shortUrl, key };
};

