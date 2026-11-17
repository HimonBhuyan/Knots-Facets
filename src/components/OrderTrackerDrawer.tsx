import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { SavedOrder } from '../types';
import {
  X,
  Package,
  CheckCircle2,
  Sparkles,
  Truck,
  Search,
  Shield,
  KeyRound,
  Mail,
  Phone,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { OrderDirectLinkCard } from './OrderDirectLinkCard';
import { fetchOrderStatusFromGoogleSheet, SheetOrderStatus } from '../utils/googleSheetsSync';

const TRACKING_STAGES = [
  {
    title: 'Order Reserved & Payment Settled',
    desc: '256-Bit SSL payment verified and materials allocated at our Guwahati studio.'
  },
  {
    title: 'Crystal Faceting & Slow Crochet Stitching',
    desc: 'Artisans are hand-wrapping 14k gold-filled wires and knotting organic cotton fibres.'
  },
  {
    title: 'Master Artisan QC & Wax-Seal Stamping',
    desc: 'Optical prism inspection complete; wrapped in unbleached tissue with lavender sprigs.'
  },
  {
    title: 'Dispatched from Guwahati Atelier',
    desc: 'Handed over to insured priority air courier with live GPS tracking.'
  },
  {
    title: 'Delivered to Collector',
    desc: 'Signed and received at destination address.'
  }
];

export const OrderTrackerDrawer: React.FC = () => {
  const {
    orders,
    isOrdersOpen,
    closeOrders,
    selectedOrderId,
    setSelectedOrderId,
    lookupGuestOrder,
    saveOrder,
    formatPrice,
    showToast
  } = useCart();

  // Mode: true when showing the Guest Lookup Form, false when viewing an active order
  const [isLookupMode, setIsLookupMode] = useState(() => !selectedOrderId && orders.length === 0);

  // Guest Lookup form state
  const [lookupId, setLookupId] = useState('');
  const [lookupContact, setLookupContact] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Live Google Sheet sync & automated tracking state
  const [liveSheetStatus, setLiveSheetStatus] = useState<Record<string, SheetOrderStatus>>({});
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);

  // Secret admin mode: unlocked by URL (?admin=1 or #orders?admin=1) or triple-clicking the Package icon
  const [isAdminMode, setIsAdminMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hash.includes('admin') || window.location.search.includes('admin');
  });
  const [adminClicks, setAdminClicks] = useState(0);

  const handleAdminSecretClick = () => {
    const next = adminClicks + 1;
    setAdminClicks(next);
    if (next >= 3) {
      setIsAdminMode(prev => {
        const newState = !prev;
        showToast(newState ? '🔐 Admin Studio Controls Enabled' : '🔒 Customer View Restored', '✨');
        return newState;
      });
      setAdminClicks(0);
    }
  };

  // Simulation overrides for stage progression
  const [stageOverrides, setStageOverrides] = useState<Record<string, number>>({});

  // Active order to display
  const activeOrder =
    orders.find(o => o.orderId === selectedOrderId) ||
    (selectedOrderId ? null : orders[0]) ||
    null;

  // Fetch real-time status from Google Sheets whenever an order is opened
  const loadOrderStatus = useCallback((orderId: string, orderDate = '') => {
    setIsSyncingSheet(true);
    fetchOrderStatusFromGoogleSheet(orderId, orderDate)
      .then(status => {
        setLiveSheetStatus(prev => ({ ...prev, [orderId]: status }));
        setIsSyncingSheet(false);
      })
      .catch(() => {
        setIsSyncingSheet(false);
      });
  }, []);

  useEffect(() => {
    if (activeOrder && isOrdersOpen && !isLookupMode) {
      loadOrderStatus(activeOrder.orderId, activeOrder.date);
    }
  }, [activeOrder?.orderId, activeOrder?.date, isOrdersOpen, isLookupMode, loadOrderStatus]);

  // When drawer opens, if an explicit order ID was passed, switch to tracking view
  useEffect(() => {
    if (selectedOrderId) {
      setIsLookupMode(false);
    } else if (orders.length === 0) {
      setIsLookupMode(true);
    }
  }, [selectedOrderId, orders.length, isOrdersOpen]);

  const sheetData = activeOrder ? liveSheetStatus[activeOrder.orderId] : undefined;
  const currentStage = activeOrder
    ? stageOverrides[activeOrder.orderId] ?? sheetData?.stageIndex ?? activeOrder.stageIndex ?? 1
    : 1;

  const advanceStage = (orderId: string) => {
    const next = Math.min(4, currentStage + 1);
    setStageOverrides(prev => ({ ...prev, [orderId]: next }));
    showToast(`📦 [Admin] Order #${orderId} set to: ${TRACKING_STAGES[next].title}`, '✨');
  };

  const resetStage = (orderId: string) => {
    setStageOverrides(prev => ({ ...prev, [orderId]: 0 }));
    showToast(`📦 [Admin] Order #${orderId} reset to Stage 0`, '↺');
  };

  const handleGuestLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setIsLookingUp(true);

    const cleanId = (lookupId || '').trim().toUpperCase().replace(/^#/, '');
    const cleanContact = (lookupContact || '').trim();

    // 1. Check local session records first
    const res = lookupGuestOrder(cleanId, cleanContact);
    if (res.success && res.order) {
      setIsLookingUp(false);
      setIsLookupMode(false);
      setSelectedOrderId(res.order.orderId);
      loadOrderStatus(res.order.orderId, res.order.date);
      showToast(`✓ Order #${res.order.orderId} verified!`, '📦');
      return;
    }

    // 2. Query Google Sheet central database if not saved on this device
    try {
      const sheetStatus = await fetchOrderStatusFromGoogleSheet(cleanId);
      if (sheetStatus && sheetStatus.found) {
        const syncedOrder: SavedOrder = {
          orderId: cleanId,
          txnId: 'SYNCED_STUDIO',
          date: 'Recent Atelier Order',
          customerName: 'Valued Collector',
          email: cleanContact.includes('@') ? cleanContact : 'collector@knotsandfacets.com',
          phone: !cleanContact.includes('@') ? cleanContact : '+91 98765 43210',
          address: 'Guwahati Studio Dispatch',
          city: 'Guwahati',
          state: 'Assam',
          postalCode: '',
          country: 'India',
          paymentMethodLabel: 'Verified Atelier Payment Gateway',
          shippingMethodLabel: sheetStatus.courier ? `Dispatched via ${sheetStatus.courier}` : 'Standard Tracked Atelier Post',
          items: [],
          subtotalUSD: 0,
          discountUSD: 0,
          shippingUSD: 0,
          giftWrapUSD: 0,
          totalUSD: 0,
          stageIndex: sheetStatus.stageIndex
        };
        saveOrder(syncedOrder);
        setSelectedOrderId(cleanId);
        setLiveSheetStatus(prev => ({ ...prev, [cleanId]: sheetStatus }));
        setIsLookupMode(false);
        setIsLookingUp(false);
        showToast(`✓ Order #${cleanId} verified from studio records!`, '✨');
        return;
      }
    } catch (sheetErr) {
      console.warn('Sheet lookup error:', sheetErr);
    }

    setIsLookingUp(false);
    setLookupError(res.error || `No matching parcel found with Order ID #${cleanId}. Please verify your details.`);
  };

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOrdersOpen ? 'active' : ''}`}
        onClick={closeOrders}
      />
      <aside
        className={`cart-drawer order-tracker-drawer ${isOrdersOpen ? 'active' : ''}`}
        aria-label="Atelier Order Tracker & History"
      >
        {/* Drawer Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              onClick={handleAdminSecretClick}
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              title="Knots & Facets Atelier Tracker"
            >
              <Package size={20} color="#9B7765" />
            </span>
            <h2>Atelier Order Tracker</h2>
            {isAdminMode && <span className="ot-admin-chip">ADMIN</span>}
          </div>
          <button className="cart-close-btn" onClick={closeOrders} aria-label="Close Order Tracker">
            <X size={18} />
          </button>
        </div>

        {/* ================= GUEST ORDER LOOKUP VIEW ================= */}
        {(!activeOrder || isLookupMode) ? (
          <div className="cart-items order-tracker-body">
            <div className="ot-lookup-panel">
              <div className="ot-lookup-intro">
                <div className="ot-lookup-icon-badge">
                  <Shield size={26} color="#9B7765" />
                </div>
                <span className="ot-eyebrow">GUEST ORDER LOOKUP</span>
                <h3>Track Your Atelier Order</h3>
                <p>
                  Enter your Order ID and the Email or Phone used during checkout to check real-time workshop crafting progress and courier tracking. Zero login required.
                </p>
              </div>

              {lookupError && (
                <div className="ot-lookup-error" role="alert">
                  <AlertCircle size={16} />
                  <span>{lookupError}</span>
                </div>
              )}

              <form onSubmit={handleGuestLookupSubmit} className="ot-lookup-form">
                <div className="ot-lookup-field">
                  <label>Order ID *</label>
                  <div className="ot-input-wrap">
                    <KeyRound size={15} className="ot-field-icon" />
                    <input
                      type="text"
                      placeholder="e.g. KF-2026-XXXXXX"
                      value={lookupId}
                      onChange={e => setLookupId(e.target.value)}
                      required
                    />
                  </div>
                  <small>Found on your invoice, confirmation screen, or SMS</small>
                </div>

                <div className="ot-lookup-field">
                  <label>Billing Email or Phone Number *</label>
                  <div className="ot-input-wrap">
                    {lookupContact.includes('@') ? (
                      <Mail size={15} className="ot-field-icon" />
                    ) : (
                      <Phone size={15} className="ot-field-icon" />
                    )}
                    <input
                      type="text"
                      placeholder="e.g. collector@example.com or +91 98765..."
                      value={lookupContact}
                      onChange={e => setLookupContact(e.target.value)}
                      required
                    />
                  </div>
                  <small>The contact detail provided during checkout</small>
                </div>

                <button
                  type="submit"
                  className="btn-dark ot-lookup-submit-btn"
                  disabled={isLookingUp || !lookupId.trim() || !lookupContact.trim()}
                >
                  {isLookingUp ? (
                    <span>Verifying Studio Records...</span>
                  ) : (
                    <>
                      <span>Verify &amp; Track Parcel</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* If an order was previously active, allow 1-click return to it */}
              {activeOrder && isLookupMode && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsLookupMode(false)}
                  style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
                >
                  <ArrowLeft size={14} />
                  <span>Return to Order #{activeOrder.orderId}</span>
                </button>
              )}

              {/* Quick access if orders exist on this browser */}
              {orders.length > 0 && !activeOrder && (
                <div className="ot-recent-orders-box">
                  <small>Recent orders on this browser:</small>
                  <div className="ot-recent-pills-row">
                    {orders.map(o => (
                      <button
                        key={o.orderId}
                        type="button"
                        className="ot-recent-pill"
                        onClick={() => {
                          setSelectedOrderId(o.orderId);
                          setIsLookupMode(false);
                        }}
                      >
                        <Package size={13} />
                        <span>#{o.orderId}</span>
                        <ArrowRight size={11} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="ot-lookup-safety-notice">
                <Shield size={14} />
                <span>
                  <strong>Private &amp; Secure Verification:</strong> We match your Order ID against the contact detail provided to protect your delivery address and purchase history.
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= ACTIVE ORDER TRACKING TIMELINE ================= */
          <div className="cart-items order-tracker-body">
            {/* Top Switcher Bar */}
            <div className="ot-active-top-actions">
              <button
                type="button"
                className="ot-switch-order-btn"
                onClick={() => {
                  setIsLookupMode(true);
                  setLookupError(null);
                }}
              >
                <Search size={13} />
                <span>Look Up Different Order</span>
              </button>

              {orders.length > 1 && (
                <div className="order-selector-strip" style={{ padding: 0, border: 'none', margin: 0 }}>
                  {orders.map(ord => (
                    <button
                      key={ord.orderId}
                      type="button"
                      className={`order-pill-btn ${activeOrder.orderId === ord.orderId ? 'active' : ''}`}
                      onClick={() => setSelectedOrderId(ord.orderId)}
                    >
                      <span>#{ord.orderId}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="order-tracker-card">
              {/* Order Summary Banner */}
              <div className="ot-summary-head">
                <div>
                  <span className="ot-eyebrow">LIVE WORKBENCH &amp; DISPATCH TRACKER</span>
                  <h3>Order #{activeOrder.orderId}</h3>
                  <small>
                    Placed {activeOrder.date} &bull; {activeOrder.city}, {activeOrder.country}
                  </small>
                </div>
                <div className="ot-total-badge">{formatPrice(activeOrder.totalUSD)}</div>
              </div>

              {/* Verified Guest Order Pill */}
              <div className="ot-verified-pill">
                <CheckCircle2 size={13} color="#2A6B48" />
                <span>Verified Guest Order &bull; Real-Time Studio Tracking</span>
              </div>

              {/* Live Sync Status Banner */}
              <div className="ot-sync-bar">
                <div className="ot-sync-indicator">
                  <span className="ot-pulse-dot" />
                  <span>
                    {sheetData?.source === 'google_sheets'
                      ? `Live Sheet Synced • ${sheetData.statusText}`
                      : 'Automated Atelier Tracking'}
                  </span>
                </div>
                <button
                  type="button"
                  className="ot-refresh-sync-btn"
                  onClick={() => {
                    loadOrderStatus(activeOrder.orderId, activeOrder.date);
                    showToast('Checking latest studio dispatch status...', '🔄');
                  }}
                  title="Check for real-time updates from studio"
                >
                  <RefreshCw size={12} className={isSyncingSheet ? 'spinning' : ''} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Courier AWB Tracking Card (shown if AWB is entered in Google Sheet) */}
              {sheetData?.trackingAwb && (
                <div className="ot-awb-card">
                  <Truck size={18} color="#9B7765" />
                  <div className="ot-awb-info">
                    <strong>Dispatched via {sheetData.courier || 'Priority Courier'}</strong>
                    <span>AWB Tracking: <code>{sheetData.trackingAwb}</code></span>
                  </div>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `${sheetData.courier || 'courier'} tracking ${sheetData.trackingAwb}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ot-awb-link"
                  >
                    <span>Track</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* 1-Click Direct Link & Scannable QR Code */}
              <OrderDirectLinkCard order={activeOrder} variant="drawer" />

              {/* 5-Stage Vertical Crafting & Courier Timeline */}
              <div className="ot-timeline">
                {TRACKING_STAGES.map((st, idx) => {
                  const isDone = idx <= currentStage;
                  const isCurrent = idx === currentStage;
                  return (
                    <div
                      key={st.title}
                      className={`ot-timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="ot-step-marker">
                        <CheckCircle2 size={15} />
                      </div>
                      <div className="ot-step-content">
                        <div className="ot-step-title-row">
                          <strong>{st.title}</strong>
                          {isCurrent && <span className="ot-live-tag">ACTIVE STAGE</span>}
                        </div>
                        <p>{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Admin Only Override Controls — Never shown to regular customers */}
              {isAdminMode && (
                <div className="ot-admin-card">
                  <div className="ot-admin-card-head">
                    <Shield size={14} />
                    <strong>Admin Studio Controls (Visible Only to You)</strong>
                  </div>
                  <p>Customers have zero control over this. Use buttons below or update your Google Sheet.</p>
                  <div className="ot-admin-btn-row">
                    {currentStage < 4 && (
                      <button
                        type="button"
                        className="ot-simulate-btn"
                        onClick={() => advanceStage(activeOrder.orderId)}
                      >
                        <Sparkles size={14} />
                        <span>Advance Stage &rarr;</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="ot-reset-btn"
                      onClick={() => resetStage(activeOrder.orderId)}
                    >
                      Reset to Stage 0
                    </button>
                  </div>
                </div>
              )}

              {/* Reserved Pieces in this Order */}
              {activeOrder.items && activeOrder.items.length > 0 && (
                <div className="ot-items-section">
                  <h4>Pieces in Parcel ({activeOrder.items.reduce((s, i) => s + i.qty, 0)})</h4>
                  {activeOrder.items.map(item => (
                    <div key={item.id} className="ot-item-row">
                      <img src={item.image} alt={item.title} />
                      <div>
                        <strong>{item.title}</strong>
                        <small>Qty: {item.qty} &bull; {formatPrice(item.priceUSD * item.qty)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="ot-courier-meta">
                <Truck size={16} />
                <div>
                  <strong>{activeOrder.shippingMethodLabel}</strong>
                  <small>Gateway Ref: {activeOrder.txnId} &bull; {activeOrder.paymentMethodLabel}</small>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
