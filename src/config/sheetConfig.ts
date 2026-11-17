/**
 * Knots & Facets — Google Sheets Cloud Sync Configuration
 *
 * Connects the store to a Google Sheet for zero-code order management.
 * - Checkout automatically posts new orders to your Google Sheet.
 * - Order Tracker drawer fetches live stage status (Crafting, QC, Dispatched, Delivered)
 *   and Courier AWB tracking numbers directly from the sheet.
 */
export const GOOGLE_SHEET_CONFIG = {
  // Paste your deployed Google Apps Script Web App URL here:
  // e.g. "https://script.google.com/macros/s/AKfycb.../exec"
  webAppUrl: '',

  // Allows fallback to time-based progress if the sheet URL is empty or offline
  fallbackToTimeEstimate: true
};
