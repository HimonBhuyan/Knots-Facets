import { SavedOrder } from '../types';
import { GOOGLE_SHEET_CONFIG } from '../config/sheetConfig';

export interface SheetOrderStatus {
  found: boolean;
  orderId: string;
  stageIndex: number;
  statusText: string;
  courier?: string;
  trackingAwb?: string;
  notes?: string;
  source: 'google_sheets' | 'fallback_automated';
}

/**
 * Parses any human-written status in Google Sheet into the 0..4 tracker stage.
 * Accepts: 'Reserved', 'Crafting', 'Stitching', 'QC', 'Dispatched', 'Shipped', 'Delivered', or numbers 0..4
 */
export const parseStageFromStatusText = (statusText: string): number => {
  const s = (statusText || '').toLowerCase().trim();
  if (s.includes('deliver') || s === '4' || s.includes('complete')) return 4;
  if (s.includes('dispatch') || s.includes('ship') || s.includes('transit') || s.includes('courier') || s === '3') return 3;
  if (s.includes('qc') || s.includes('stamp') || s.includes('seal') || s.includes('pack') || s.includes('artisan') || s === '2') return 2;
  if (s.includes('stitch') || s.includes('facet') || s.includes('craft') || s.includes('wire') || s.includes('progress') || s === '1') return 1;
  if (s.includes('reserv') || s.includes('settle') || s.includes('paid') || s === '0') return 0;
  return 1;
};

/**
 * Intelligent time-based fallback when Google Sheet is unconfigured or offline.
 */
export const calculateFallbackStage = (orderDate: string): number => {
  try {
    const parsed = new Date(orderDate).getTime();
    if (isNaN(parsed)) return 1;
    const diffHours = (Date.now() - parsed) / (1000 * 60 * 60);

    if (diffHours < 12) return 0; // Day 0: Order Reserved
    if (diffHours < 36) return 1; // Day 1: Crafting & Stitching
    if (diffHours < 72) return 2; // Day 2: Master QC & Wax Seal
    if (diffHours < 120) return 3; // Day 3–5: Dispatched
    return 4; // Day 5+: Delivered
  } catch {
    return 1;
  }
};

/**
 * Posts newly placed orders directly to the Google Sheet via Google Apps Script Web App.
 */
export const syncOrderToGoogleSheet = async (order: SavedOrder): Promise<{ success: boolean; message: string }> => {
  const { webAppUrl } = GOOGLE_SHEET_CONFIG;

  if (!webAppUrl || !webAppUrl.trim()) {
    console.info('[GoogleSheetsSync] WebApp URL not yet configured. Order saved locally.');
    return { success: false, message: 'Google Sheet Web App URL not configured yet.' };
  }

  const itemsSummary = order.items
    .map(i => `${i.title} (x${i.qty})`)
    .join('; ');

  const totalINR = Math.round(order.totalUSD * 86.5);

  const payload = {
    action: 'newOrder',
    orderId: order.orderId,
    txnId: order.txnId,
    date: order.date,
    timestamp: new Date().toISOString(),
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    country: order.country,
    items: itemsSummary,
    totalUSD: order.totalUSD,
    totalINR: totalINR,
    paymentMethod: order.paymentMethodLabel,
    shippingMethod: order.shippingMethodLabel,
    giftNote: order.giftNote || '',
    initialStatus: 'Order Reserved'
  };

  try {
    // Google Apps Script accepts text/plain to avoid pre-flight CORS blocks
    await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      mode: 'no-cors' // Allows cross-origin post to Google Apps Script
    });

    console.info(`[GoogleSheetsSync] Order #${order.orderId} successfully dispatched to Google Sheet.`);
    return { success: true, message: 'Synced to Google Sheet' };
  } catch (error) {
    console.warn('[GoogleSheetsSync] Failed to post order to Google Sheet:', error);
    return { success: false, message: 'Network error posting to Google Sheet' };
  }
};

/**
 * Fetches the real-time stage status and courier tracking info for an order from Google Sheets.
 */
export const fetchOrderStatusFromGoogleSheet = async (
  orderId: string,
  orderDate = ''
): Promise<SheetOrderStatus> => {
  const { webAppUrl, fallbackToTimeEstimate } = GOOGLE_SHEET_CONFIG;

  if (webAppUrl && webAppUrl.trim()) {
    try {
      const url = `${webAppUrl}?action=getStatus&orderId=${encodeURIComponent(orderId)}`;
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.found) {
          const stageIndex = typeof data.stageIndex === 'number'
            ? data.stageIndex
            : parseStageFromStatusText(data.status || data.statusText);

          return {
            found: true,
            orderId,
            stageIndex,
            statusText: data.status || data.statusText || 'In Progress',
            courier: data.courier,
            trackingAwb: data.trackingAwb || data.awb,
            notes: data.notes,
            source: 'google_sheets'
          };
        }
      }
    } catch (err) {
      console.warn(`[GoogleSheetsSync] Could not reach Google Sheet for order #${orderId}, using automated fallback.`);
    }
  }

  // Fallback: Automated time-based stage
  const fallbackStage = fallbackToTimeEstimate && orderDate
    ? calculateFallbackStage(orderDate)
    : 1;

  return {
    found: true,
    orderId,
    stageIndex: fallbackStage,
    statusText: 'In Progress (Atelier Crafting Schedule)',
    source: 'fallback_automated'
  };
};
