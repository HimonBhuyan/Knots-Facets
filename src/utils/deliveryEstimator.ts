export interface DeliveryEstimate {
  pin: string;
  locationLabel: string;
  craftingDays: number;
  craftingText: string;
  transitDaysMin: number;
  transitDaysMax: number;
  transitText: string;
  estimatedDeliveryRange: string;
  courierPartner: string;
  isLocalGuwahati: boolean;
  isInternational: boolean;
}

/**
 * Adds business days to a given start date (skipping Sundays).
 */
export const addBusinessDays = (startDate: Date, days: number): Date => {
  const result = new Date(startDate);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0) {
      // Skip Sunday
      added++;
    }
  }
  return result;
};

/**
 * Formats a Date object into "Nov 9"
 */
export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Calculates crafting time, courier transit time, and arrival dates
 * based on the destination PIN/Postal Code, shipping tier, and product category.
 */
export const calculateDeliveryEstimate = (
  rawPin: string,
  category: 'jewellery' | 'crochet' | 'gifting' | string = 'jewellery',
  shippingTier: 'standard' | 'express' = 'standard'
): DeliveryEstimate | null => {
  if (!rawPin) return null;
  const pin = rawPin.trim().toUpperCase().replace(/\s+/g, '');
  if (pin.length < 3) return null;

  // 1. Determine Studio Crafting Days
  // Jewellery wire-wrapping: 1-2 days; Slow crochet stitching: 2-3 days
  const craftingDays = category === 'crochet' ? 3 : 2;
  const craftingText = `Guwahati Studio Crafting: ${craftingDays} Days`;

  // 2. Determine Location Zone & Transit Days
  let locationLabel = 'Domestic Tracked Transit';
  let transitDaysMin = 4;
  let transitDaysMax = 6;
  let courierPartner = 'BlueDart Air & India Post';
  let isLocalGuwahati = false;
  let isInternational = false;

  const isNumericOnly = /^\d+$/.test(pin);

  if (isNumericOnly && pin.length === 6) {
    // Indian 6-Digit PIN codes
    if (pin.startsWith('781001') || pin.startsWith('7810')) {
      locationLabel = 'Guwahati Riverfront & Urban Quarter';
      transitDaysMin = 1;
      transitDaysMax = shippingTier === 'express' ? 1 : 2;
      courierPartner = 'Guwahati Atelier Courier Express';
      isLocalGuwahati = true;
    } else if (pin.startsWith('78') || pin.startsWith('79')) {
      locationLabel = 'Assam & North East Craft Zone';
      transitDaysMin = shippingTier === 'express' ? 1 : 2;
      transitDaysMax = shippingTier === 'express' ? 2 : 3;
      courierPartner = 'BlueDart Priority Regional';
      isLocalGuwahati = true;
    } else if (pin.startsWith('11')) {
      locationLabel = 'Delhi / NCR Metro Hub';
      transitDaysMin = shippingTier === 'express' ? 2 : 3;
      transitDaysMax = shippingTier === 'express' ? 3 : 4;
      courierPartner = 'Air Priority Express';
    } else if (pin.startsWith('40')) {
      locationLabel = 'Mumbai Metro Hub';
      transitDaysMin = shippingTier === 'express' ? 2 : 3;
      transitDaysMax = shippingTier === 'express' ? 3 : 4;
      courierPartner = 'Air Priority Express';
    } else if (pin.startsWith('56')) {
      locationLabel = 'Bengaluru Tech Corridor';
      transitDaysMin = shippingTier === 'express' ? 2 : 3;
      transitDaysMax = shippingTier === 'express' ? 3 : 4;
      courierPartner = 'Air Priority Express';
    } else if (pin.startsWith('70')) {
      locationLabel = 'Kolkata Direct Air Hub';
      transitDaysMin = shippingTier === 'express' ? 1 : 2;
      transitDaysMax = shippingTier === 'express' ? 2 : 3;
      courierPartner = 'BlueDart Express Air';
    } else if (pin.startsWith('60') || pin.startsWith('50')) {
      locationLabel = 'South India Metro Hub';
      transitDaysMin = shippingTier === 'express' ? 2 : 3;
      transitDaysMax = shippingTier === 'express' ? 3 : 4;
      courierPartner = 'Air Priority Express';
    } else {
      locationLabel = 'Domestic Priority Zone';
      transitDaysMin = shippingTier === 'express' ? 2 : 3;
      transitDaysMax = shippingTier === 'express' ? 4 : 5;
      courierPartner = 'BlueDart / Delhivery Tracked';
    }
  } else if (isNumericOnly && pin.length === 5) {
    // US 5-Digit ZIP code (e.g. 10001, 90210)
    locationLabel = 'United States (Express Air Courier)';
    transitDaysMin = shippingTier === 'express' ? 3 : 5;
    transitDaysMax = shippingTier === 'express' ? 5 : 7;
    courierPartner = 'DHL Express Worldwide & FedEx';
    isInternational = true;
  } else {
    // Alphanumeric international (UK: SW1A, Canada, Europe)
    locationLabel = 'International Priority Destination';
    transitDaysMin = shippingTier === 'express' ? 3 : 5;
    transitDaysMax = shippingTier === 'express' ? 5 : 8;
    courierPartner = 'DHL Express Worldwide';
    isInternational = true;
  }

  // 3. Compute Dates
  const now = new Date();
  const craftEndDate = addBusinessDays(now, craftingDays);
  const deliveryMinDate = addBusinessDays(craftEndDate, transitDaysMin);
  const deliveryMaxDate = addBusinessDays(craftEndDate, transitDaysMax);

  const startFormatted = formatShortDate(deliveryMinDate);
  const endFormatted = formatShortDate(deliveryMaxDate);
  const estimatedDeliveryRange = `${startFormatted} – ${endFormatted}`;

  const transitText =
    shippingTier === 'express'
      ? `Priority Express: ${transitDaysMin}–${transitDaysMax} Days`
      : `Standard Air: ${transitDaysMin}–${transitDaysMax} Days`;

  return {
    pin,
    locationLabel,
    craftingDays,
    craftingText,
    transitDaysMin,
    transitDaysMax,
    transitText,
    estimatedDeliveryRange,
    courierPartner,
    isLocalGuwahati,
    isInternational
  };
};

/**
 * Persists and retrieves the user's last verified PIN code in localStorage
 */
export const getSavedPostalCode = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('kf_pincode') || '';
  } catch {
    return '';
  }
};

export const savePostalCode = (pin: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('kf_pincode', pin.trim().toUpperCase());
  } catch {}
};

