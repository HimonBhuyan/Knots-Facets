import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
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
  BookmarkCheck
} from 'lucide-react';
import { OrderDirectLinkCard } from './OrderDirectLinkCard';

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
    formatPrice,
    showToast
  } = useCart();

  // Mode: 'device' (orders saved locally) or 'lookup' (guest search by Order ID + Email/Phone)
  const [activeTab, setActiveTab] = useState<'device' | 'lookup'>('device');

  // Search in local orders
  const [localSearch, setLocalSearch] = useState('');

  // Guest Lookup form state
  const [lookupId, setLookupId] = useState('');
  const [lookupContact, setLookupContact] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Simulation overrides for stage progression
  const [stageOverrides, setStageOverrides] = useState<Record<string, number>>({});

  // Filter local orders
  const filteredOrders = orders.filter(
    o =>
      !localSearch.trim() ||
      o.orderId.toLowerCase().includes(localSearch.trim().toLowerCase()) ||
      o.customerName.toLowerCase().includes(localSearch.trim().toLowerCase())
  );

  // Select active order
  const activeOrder =
    orders.find(o => o.orderId === selectedOrderId) ||
    filteredOrders[0] ||
    orders[0] ||
    null;

  // When drawer opens, if an order was requested, make sure it is selected
  useEffect(() => {
    if (selectedOrderId && orders.some(o => o.orderId === selectedOrderId)) {
      setActiveTab('device');
    }
  }, [selectedOrderId, orders]);

  const currentStage = activeOrder
    ? stageOverrides[activeOrder.orderId] ?? activeOrder.stageIndex ?? 1
    : 1;

  const advanceStage = (orderId: string) => {
    const next = Math.min(4, currentStage + 1);
    setStageOverrides(prev => ({ ...prev, [orderId]: next }));
    showToast(`📦 Order #${orderId} updated: ${TRACKING_STAGES[next].title}`, '✨');
  };

  const handleGuestLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setIsLookingUp(true);

    setTimeout(() => {
      const res = lookupGuestOrder(lookupId, lookupContact);
      setIsLookingUp(false);
      if (res.success && res.order) {
        setLookupError(null);
        setActiveTab('device');
        setSelectedOrderId(res.order.orderId);
      } else {
        setLookupError(res.error || 'No matching order found.');
      }
    }, 450);
  };

  const fillSampleOrder = () => {
    setLookupId('KF-2026-841920');
    setLookupContact('aarav.collector@example.com');
    setLookupError(null);
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
            <Package size={20} color="#9B7765" />
            <h2>Atelier Order Tracker</h2>
          </div>
          <button className="cart-close-btn" onClick={closeOrders} aria-label="Close Order Tracker">
            <X size={18} />
          </button>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="ot-tab-strip">
          <button
            type="button"
            className={`ot-tab-btn ${activeTab === 'device' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('device');
              setLookupError(null);
            }}
          >
            <BookmarkCheck size={14} />
            <span>This Device ({orders.length})</span>
          </button>
          <button
            type="button"
            className={`ot-tab-btn ${activeTab === 'lookup' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('lookup');
              setLookupError(null);
            }}
          >
            <Shield size={14} />
            <span>Guest Lookup (No Login)</span>
          </button>
        </div>

        {/* ================= TAB 1: THIS DEVICE (LOCAL HISTORY) ================= */}
        {activeTab === 'device' && (
          <>
            {/* Search filter within local orders */}
            {orders.length > 1 && (
              <div className="order-tracker-search">
                <Search size={15} className="ot-search-icon" />
                <input
                  type="text"
                  placeholder="Filter saved orders by ID or name..."
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                />
              </div>
            )}

            {/* Order Selector Pills if multiple orders exist */}
            {filteredOrders.length > 1 && (
              <div className="order-selector-strip">
                {filteredOrders.map(ord => (
                  <button
                    key={ord.orderId}
                    type="button"
                    className={`order-pill-btn ${activeOrder?.orderId === ord.orderId ? 'active' : ''}`}
                    onClick={() => setSelectedOrderId(ord.orderId)}
                  >
                    <span>#{ord.orderId}</span>
                    <small>{ord.date}</small>
                  </button>
                ))}
              </div>
            )}

            <div className="cart-items order-tracker-body">
              {!activeOrder ? (
                <div className="cart-empty-state">
                  <Package size={42} color="#9B7765" style={{ marginBottom: '12px' }} />
                  <h3>No Orders Saved On This Device</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', marginBottom: '16px' }}>
                    If you placed an order on another device or cleared your browser, look it up securely using your Order ID and Email or Phone.
                  </p>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab('lookup')}
                  >
                    <Shield size={14} />
                    <span>Open Guest Order Lookup</span>
                  </button>
                </div>
              ) : (
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

                  {/* Verified Session Pill */}
                  <div className="ot-verified-pill">
                    <CheckCircle2 size={13} color="#2A6B48" />
                    <span>Verified Guest Session &bull; Linked to this device</span>
                  </div>

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

                  {currentStage < 4 && (
                    <button
                      type="button"
                      className="ot-simulate-btn"
                      onClick={() => advanceStage(activeOrder.orderId)}
                    >
                      <Sparkles size={14} />
                      <span>Simulate Next Studio Stage &rarr;</span>
                    </button>
                  )}

                  {/* Reserved Pieces in this Order */}
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

                  <div className="ot-courier-meta">
                    <Truck size={16} />
                    <div>
                      <strong>{activeOrder.shippingMethodLabel}</strong>
                      <small>Gateway Ref: {activeOrder.txnId} &bull; {activeOrder.paymentMethodLabel}</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= TAB 2: GUEST ORDER LOOKUP ================= */}
        {activeTab === 'lookup' && (
          <div className="cart-items order-tracker-body">
            <div className="ot-lookup-panel">
              <div className="ot-lookup-intro">
                <div className="ot-lookup-icon-badge">
                  <Shield size={24} color="#9B7765" />
                </div>
                <h3>Look Up Any Previous Order</h3>
                <p>
                  Access your order details and live dispatch status from any device without creating an account or password.
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
                      placeholder="e.g. KF-2026-841920"
                      value={lookupId}
                      onChange={e => setLookupId(e.target.value)}
                      required
                    />
                  </div>
                  <small>Found on your invoice or confirmation screen</small>
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
                  <small>The contact detail used during checkout</small>
                </div>

                <button
                  type="submit"
                  className="btn-dark ot-lookup-submit-btn"
                  disabled={isLookingUp || !lookupId.trim() || !lookupContact.trim()}
                >
                  {isLookingUp ? (
                    <span>Verifying Order Records...</span>
                  ) : (
                    <>
                      <span>Verify &amp; Track Parcel</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Sample testing shortcut */}
              <div className="ot-sample-chip-card">
                <span>Want to test guest lookup?</span>
                <button
                  type="button"
                  className="ot-sample-chip-btn"
                  onClick={fillSampleOrder}
                >
                  Fill Sample Order #KF-2026-841920 &rarr;
                </button>
              </div>

              <div className="ot-lookup-safety-notice">
                <Shield size={14} />
                <span>
                  <strong>Private &amp; Secure Verification:</strong> We match your Order ID against the contact detail provided to protect your delivery address and purchase history.
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
