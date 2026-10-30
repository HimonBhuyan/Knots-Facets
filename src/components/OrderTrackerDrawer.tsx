import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Package, CheckCircle2, Sparkles, Truck, Search } from 'lucide-react';

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
  const { orders, isOrdersOpen, closeOrders, formatPrice, showToast } = useCart();
  const [searchId, setSearchId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [stageOverrides, setStageOverrides] = useState<Record<string, number>>({});

  const filteredOrders = orders.filter(
    o =>
      !searchId.trim() ||
      o.orderId.toLowerCase().includes(searchId.trim().toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchId.trim().toLowerCase())
  );

  const activeOrder =
    filteredOrders.find(o => o.orderId === selectedOrderId) || filteredOrders[0] || null;

  const currentStage = activeOrder
    ? stageOverrides[activeOrder.orderId] ?? activeOrder.stageIndex ?? 1
    : 1;

  const advanceStage = (orderId: string) => {
    const next = Math.min(4, currentStage + 1);
    setStageOverrides(prev => ({ ...prev, [orderId]: next }));
    showToast(`📦 Order #${orderId} updated: ${TRACKING_STAGES[next].title}`, '✨');
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
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={20} color="#9B7765" />
            <h2>Atelier Order Tracker ({orders.length})</h2>
          </div>
          <button className="cart-close-btn" onClick={closeOrders} aria-label="Close Order Tracker">
            <X size={18} />
          </button>
        </div>

        {/* Search / Order Lookup Bar */}
        <div className="order-tracker-search">
          <Search size={15} className="ot-search-icon" />
          <input
            type="text"
            placeholder="Lookup by Order ID (e.g. KF-2026)..."
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
          />
        </div>

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
              <h3>No Matching Orders Found</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
                Check your Order ID or complete a checkout to track your studio parcel in real time.
              </p>
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
      </aside>
    </>
  );
};
