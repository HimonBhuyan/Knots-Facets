import React, { useState, useMemo } from 'react';
import { PageId, CartItem } from '../types';
import { useCart } from '../context/CartContext';
import { CATALOG } from '../data/catalog';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  Wallet,
  Truck,
  Gift,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Tag,
  Printer,
  Copy,
  Check,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';

interface CheckoutPageProps {
  setActivePage: (page: PageId) => void;
}

type PaymentMethodId = 'card' | 'upi' | 'wallet' | 'cod';
type ShippingMethodId = 'standard' | 'express';

interface ConfirmedOrder {
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
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ setActivePage }) => {
  const {
    cart,
    subtotalUSD,
    formatPrice,
    updateQty,
    removeFromCart,
    addToCart,
    clearCart,
    saveOrder,
    showToast
  } = useCart();

  // Shipping & Contact State
  const [contact, setContact] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  // Delivery & Packaging Options
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('standard');
  const [heirloomBox, setHeirloomBox] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Promo Code Engine
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; pct: number; freeShip?: boolean } | null>(null);

  // Payment Gateway State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<'klarna' | 'paypal' | 'applepay'>('klarna');

  // Gateway Processing & Order Confirmation State
  const [gatewayStage, setGatewayStage] = useState<0 | 1 | 2 | 3>(0);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Card Brand Detection
  const detectedCardBrand = useMemo(() => {
    const clean = cardDetails.number.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'MASTERCARD';
    if (/^3[47]/.test(clean)) return 'AMEX';
    if (/^(60|65|81|82|508)/.test(clean)) return 'RUPAY';
    return 'ATELIER CARD';
  }, [cardDetails.number]);

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    setCardDetails(prev => ({ ...prev, number: groups ? groups.join(' ') : digits }));
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setCardDetails(prev => ({ ...prev, expiry: `${digits.slice(0, 2)}/${digits.slice(2)}` }));
    } else {
      setCardDetails(prev => ({ ...prev, expiry: digits }));
    }
  };

  // Fill Demo Test Card for instant testing
  const fillDemoData = () => {
    setContact(prev => ({
      fullName: prev.fullName || 'Aarav Sharma',
      email: prev.email || 'aarav.collector@example.com',
      phone: prev.phone || '+91 98765 43210',
      address: prev.address || '42 Roseberry Lane, Uzan Bazar',
      apartment: prev.apartment || 'Suite 3B',
      city: prev.city || 'Guwahati',
      state: prev.state || 'Assam',
      postalCode: prev.postalCode || '781001',
      country: prev.country || 'India'
    }));
    setCardDetails({
      number: '4532 8910 4421 8894',
      name: 'AARAV SHARMA',
      expiry: '08/29',
      cvv: '842'
    });
    showToast('✨ Demo collector & test card filled for instant checkout!', '💳');
  };

  // Promo Code Application
  const applyPromoCode = (codeRaw?: string) => {
    const code = (codeRaw ?? promoInput).trim().toUpperCase();
    if (!code) return;
    if (code === 'KNOTS10') {
      setAppliedPromo({ code: 'KNOTS10', pct: 10 });
      setPromoInput('KNOTS10');
      showToast('🎉 Promo KNOTS10 applied — 10% OFF your order!', '🏷️');
    } else if (code === 'ATELIER15') {
      setAppliedPromo({ code: 'ATELIER15', pct: 15 });
      setPromoInput('ATELIER15');
      showToast('✨ Promo ATELIER15 applied — 15% VIP Collector Discount!', '💎');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', pct: 0, freeShip: true });
      setPromoInput('FREESHIP');
      showToast('🚚 Promo FREESHIP applied — Complimentary Express Courier!', '📦');
    } else {
      showToast('Invalid promo code. Try KNOTS10 or ATELIER15.', '⚠️');
    }
  };

  // Financial Calculations
  const isFreeThresholdMet = subtotalUSD >= 80;
  const discountUSD = appliedPromo ? Math.round((subtotalUSD * appliedPromo.pct) / 100) : 0;
  const shippingUSD = useMemo(() => {
    if (appliedPromo?.freeShip) return 0;
    if (shippingMethod === 'standard') return isFreeThresholdMet ? 0 : 8;
    return 18;
  }, [shippingMethod, isFreeThresholdMet, appliedPromo]);

  const giftWrapUSD = heirloomBox ? (isFreeThresholdMet ? 0 : 6) : 0;
  const codFeeUSD = paymentMethod === 'cod' ? 3 : 0;
  const totalUSD = Math.max(0, subtotalUSD - discountUSD + shippingUSD + giftWrapUSD + codFeeUSD);

  // Verify UPI ID
  const handleVerifyUpi = () => {
    if (!upiId.includes('@') || upiId.trim().length < 5) {
      showToast('Please enter a valid UPI ID (e.g. name@okaxis)', '⚠️');
      return;
    }
    setIsUpiVerified(true);
    showToast(`✓ Verified UPI VPA: ${upiId}`, '📲');
  };

  // Handle Payment Gateway Submission
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your bag is empty. Add a handcrafted piece first!', '🛍️');
      return;
    }

    if (paymentMethod === 'card') {
      const cleanNum = cardDetails.number.replace(/\D/g, '');
      if (cleanNum.length < 13) {
        showToast('Please enter a valid 16-digit card number or click "Fill Test Card".', '💳');
        return;
      }
    }

    // Trigger 3-Stage Animated Payment Gateway Handshake
    setGatewayStage(1);
    setTimeout(() => setGatewayStage(2), 900);
    setTimeout(() => setGatewayStage(3), 1850);
    setTimeout(() => {
      const randomOrderNum = Math.floor(100000 + Math.random() * 900000);
      const randomTxn = 'pay_KF' + Math.random().toString(36).substring(2, 10).toUpperCase();

      const methodLabels: Record<PaymentMethodId, string> = {
        card: `${detectedCardBrand}••••${cardDetails.number.slice(-4) || '8894'} (256-Bit SSL Card Gateway)`,
        upi: `UPI Instant Gateway (${upiId || upiApp.toUpperCase() + ' QR Verified'})`,
        wallet:
          selectedWallet === 'klarna'
            ? 'Klarna 4x Interest-Free Split Pay'
            : selectedWallet === 'paypal'
            ? 'PayPal Express Checkout'
            : 'Apple Pay Biometric Token',
        cod: 'Pay on Delivery (Verified Studio Dispatch)'
      };

      const orderSnapshot: ConfirmedOrder = {
        orderId: `KF-2026-${randomOrderNum}`,
        txnId: randomTxn,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        customerName: contact.fullName || 'Valued Collector',
        email: contact.email || 'collector@knotsandfacets.com',
        phone: contact.phone || '+91 98765 43210',
        address: `${contact.address}${contact.apartment ? ', ' + contact.apartment : ''}`,
        city: contact.city,
        state: contact.state,
        postalCode: contact.postalCode,
        country: contact.country,
        paymentMethodLabel: methodLabels[paymentMethod],
        shippingMethodLabel:
          shippingMethod === 'express'
            ? 'Priority Express Air Courier (2–3 Business Days)'
            : 'Standard Tracked Atelier Post (5–7 Business Days)',
        items: [...cart],
        subtotalUSD,
        discountUSD,
        shippingUSD,
        giftWrapUSD: giftWrapUSD + codFeeUSD,
        totalUSD,
        giftNote: giftNote.trim() || undefined
      };

      setConfirmedOrder(orderSnapshot);
      saveOrder(orderSnapshot);
      setGatewayStage(0);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`🎉 Payment Successful! Order #${orderSnapshot.orderId} confirmed.`, '✨');
    }, 2750);
  };

  const copyOrderId = () => {
    if (!confirmedOrder) return;
    navigator.clipboard?.writeText(confirmedOrder.orderId);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  // ==================== CONFIRMED PROFESSIONAL INVOICE & PROVENANCE RECEIPT ====================
  if (confirmedOrder) {
    const invoiceNo = confirmedOrder.orderId.replace('KF-', 'INV-');
    return (
      <div className="checkout-page-wrap invoice-page-container">
        {/* Non-Print Screen Action Bar */}
        <div className="invoice-screen-toolbar">
          <div className="invoice-toolbar-status">
            <span className="invoice-status-dot" />
            <div>
              <strong>Payment Settled &amp; Reservation Confirmed</strong>
              <span>A copy of this tax invoice &amp; provenance certificate has been sent to {confirmedOrder.email}</span>
            </div>
          </div>
          <div className="invoice-toolbar-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={copyOrderId}
            >
              {copiedOrder ? <Check size={15} /> : <Copy size={15} />}
              <span>{copiedOrder ? 'Copied Order ID' : `Copy #${confirmedOrder.orderId}`}</span>
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => window.print()}
            >
              <Printer size={15} />
              <span>Print / Save PDF Invoice</span>
            </button>
            <button
              type="button"
              className="btn-dark"
              onClick={() => setActivePage('shop')}
            >
              <span>Return to Atelier</span>
            </button>
          </div>
        </div>

        {/* Printable Luxury Archival Invoice Document */}
        <article className="atelier-invoice-sheet" aria-label="Official Atelier Tax Invoice and Provenance Receipt">
          {/* Corner Archival Ornaments */}
          <span className="inv-corner tl" aria-hidden="true" />
          <span className="inv-corner tr" aria-hidden="true" />
          <span className="inv-corner bl" aria-hidden="true" />
          <span className="inv-corner br" aria-hidden="true" />

          {/* Subtle Center Emblem Watermark */}
          <img
            src="/images/logo-mark.png"
            alt=""
            className="inv-watermark"
            aria-hidden="true"
          />

          {/* 1. Letterhead & Invoice Document Header */}
          <header className="inv-header">
            <div className="inv-brand-col">
              <div className="inv-logo-lockup">
                <img src="/images/logo-mark.png" alt="Knots & Facets" className="inv-logo-img" />
                <div>
                  <h1 className="inv-brand-name">KNOTS &amp; FACETS</h1>
                  <span className="inv-brand-sub">ARTISAN JEWELRY &amp; ADORNMENTS</span>
                </div>
              </div>
              <address className="inv-studio-address">
                Atelier No. 14, Riverfront Craft Quarter, Uzan Bazar<br />
                Guwahati, Assam 781001 &bull; India<br />
                Studio Reg / GSTIN: <strong>18AABCK2026F1Z5</strong> &bull; concierge@knotsandfacets.com
              </address>
            </div>

            <div className="inv-doc-col">
              <div className="inv-paid-stamp">
                <CheckCircle2 size={14} />
                <span>PAID &bull; VERIFIED SETTLEMENT</span>
              </div>
              <h2 className="inv-doc-title">TAX INVOICE &amp; RECEIPT</h2>
              <p className="inv-doc-sub">Original Copy for Collector &amp; Provenance Dossier</p>

              <dl className="inv-doc-meta">
                <div>
                  <dt>Invoice Number</dt>
                  <dd>{invoiceNo}</dd>
                </div>
                <div>
                  <dt>Order Reference</dt>
                  <dd>#{confirmedOrder.orderId}</dd>
                </div>
                <div>
                  <dt>Date of Issue</dt>
                  <dd>{confirmedOrder.date}</dd>
                </div>
                <div>
                  <dt>Gateway Auth ID</dt>
                  <dd>{confirmedOrder.txnId}</dd>
                </div>
              </dl>
            </div>
          </header>

          {/* 2. Three-Column Party, Payment & Fulfilment Grid */}
          <section className="inv-parties-grid">
            <div className="inv-party-box">
              <span className="inv-box-eyebrow">01 &bull; BILLED &amp; DISPATCHED TO</span>
              <strong>{confirmedOrder.customerName}</strong>
              <p>
                {confirmedOrder.address}<br />
                {confirmedOrder.city}, {confirmedOrder.state} {confirmedOrder.postalCode}<br />
                {confirmedOrder.country}
              </p>
              <small>{confirmedOrder.email} &bull; {confirmedOrder.phone}</small>
            </div>

            <div className="inv-party-box">
              <span className="inv-box-eyebrow">02 &bull; PAYMENT GATEWAY LEDGER</span>
              <strong>{confirmedOrder.paymentMethodLabel}</strong>
              <p>
                Authorization: 3D Secure 2.0 / 256-Bit SSL<br />
                Settlement Status: <strong>Captured in Full</strong><br />
                Transaction Ref: {confirmedOrder.txnId}
              </p>
              <small>Zero pending balance due upon delivery</small>
            </div>

            <div className="inv-party-box">
              <span className="inv-box-eyebrow">03 &bull; ATELIER FULFILMENT</span>
              <strong>{confirmedOrder.shippingMethodLabel}</strong>
              <p>
                Origin: Guwahati Studio Workbench<br />
                Presentation: Wax-Sealed Cotton &amp; Lavender<br />
                Inspection: Passed Master Artisan QC
              </p>
              <small>Tracking link dispatched via email upon courier handover</small>
            </div>
          </section>

          {/* 3. Formal Itemized Schedule Table */}
          <section className="inv-table-section">
            <table className="inv-items-table">
              <thead>
                <tr>
                  <th style={{ width: '48px' }}>#</th>
                  <th>Piece &amp; Handcrafted Provenance</th>
                  <th>Craft / HSN</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ textAlign: 'right' }}>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrder.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="inv-td-num">{String(idx + 1).padStart(2, '0')}</td>
                    <td>
                      <div className="inv-item-cell">
                        <img src={item.image} alt={item.title} />
                        <div>
                          <strong>{item.title}</strong>
                          <span>
                            {item.categoryLabel} &bull; SKU: {item.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="inv-td-code">
                      {item.categoryLabel.toLowerCase().includes('crochet')
                        ? '6307 · Organic Fibre'
                        : '7117 · Faceted Crystal'}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.qty}</td>
                    <td style={{ textAlign: 'right' }}>{formatPrice(item.priceUSD)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {formatPrice(item.priceUSD * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 4. Bottom Split: Certificate of Authenticity (Left) + Financial Summary Ledger (Right) */}
          <section className="inv-bottom-split">
            <div className="inv-provenance-col">
              {confirmedOrder.giftNote && (
                <div className="inv-gift-note-card">
                  <span>💌 ENCLOSED CALLIGRAPHY GIFT CARD</span>
                  <p>“{confirmedOrder.giftNote}”</p>
                </div>
              )}

              <div className="inv-certificate-box">
                <div className="inv-cert-text">
                  <span className="inv-box-eyebrow">CERTIFICATE OF HANDCRAFTED PROVENANCE</span>
                  <p>
                    We hereby certify that the pieces itemized on this invoice were individually handcrafted in small batches at the Knots &amp; Facets Atelier using lead-free faceted glass crystals, 14k gold-filled findings, and 100% unbleached organic cotton fibres.
                  </p>
                  <div className="inv-signature-row">
                    <div>
                      <span className="inv-sig-script">Himon Bhuyan</span>
                      <small>MASTER ARTISAN &amp; FOUNDER, KNOTS &amp; FACETS</small>
                    </div>
                    {/* Vector Barcode */}
                    <div className="inv-barcode" aria-hidden="true">
                      <svg viewBox="0 0 140 34" width="128" height="30">
                        <path
                          d="M4 2h3v30H4zM10 2h1.5v30H10zM15 2h4v30h-4zM22 2h2v30h-2zM27 2h1.5v30H27zM32 2h5v30h-5zM40 2h2v30h-2zM45 2h3v30h-3zM52 2h1.5v30H52zM57 2h4v30h-4zM64 2h2v30h-2zM69 2h5v30h-5zM77 2h1.5v30H77zM82 2h3v30h-3zM88 2h2v30h-2zM94 2h4v30h-4zM101 2h1.5v30H101zM106 2h5v30h-5zM114 2h2v30h-2zM119 2h3v30h-3zM126 2h1.5v30H126zM131 2h4v30h-4z"
                          fill="#29231F"
                        />
                      </svg>
                      <span>{confirmedOrder.orderId}</span>
                    </div>
                  </div>
                </div>

                {/* Official Wax Seal Stamp SVG */}
                <div className="inv-wax-stamp" aria-hidden="true">
                  <svg viewBox="0 0 100 100" width="84" height="84">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#9B7765" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="37" fill="none" stroke="#9B7765" strokeWidth="1.2" />
                    <polygon points="50,22 68,50 50,78 32,50" fill="rgba(155, 119, 101, 0.12)" stroke="#9B7765" strokeWidth="1.4" />
                    <text x="50" y="48" textAnchor="middle" fill="#7A5B4C" fontSize="6.5" fontWeight="700" letterSpacing="1.2">
                      AUTHENTIC
                    </text>
                    <text x="50" y="57" textAnchor="middle" fill="#7A5B4C" fontSize="6" fontWeight="600" letterSpacing="1">
                      ATELIER SEAL
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="inv-ledger-col">
              <div className="inv-ledger-box">
                <div className="inv-ledger-row">
                  <span>Merchandise Subtotal</span>
                  <span>{formatPrice(confirmedOrder.subtotalUSD)}</span>
                </div>
                {confirmedOrder.discountUSD > 0 && (
                  <div className="inv-ledger-row discount">
                    <span>Collector Privilege Discount</span>
                    <span>−{formatPrice(confirmedOrder.discountUSD)}</span>
                  </div>
                )}
                <div className="inv-ledger-row">
                  <span>Insured Dispatch &amp; Tracking</span>
                  <span>
                    {confirmedOrder.shippingUSD === 0
                      ? 'Complimentary ($0.00)'
                      : formatPrice(confirmedOrder.shippingUSD)}
                  </span>
                </div>
                <div className="inv-ledger-row">
                  <span>Wax-Sealed Gift Presentation</span>
                  <span>
                    {confirmedOrder.giftWrapUSD === 0
                      ? 'Included'
                      : formatPrice(confirmedOrder.giftWrapUSD)}
                  </span>
                </div>
                <div className="inv-ledger-row">
                  <span>Studio Craft Tax / GST</span>
                  <span>Inclusive</span>
                </div>
                <div className="inv-ledger-total">
                  <div>
                    <span>TOTAL SETTLED</span>
                    <small>Paid via {confirmedOrder.paymentMethodLabel.split('(')[0]}</small>
                  </div>
                  <strong>{formatPrice(confirmedOrder.totalUSD)}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Archival Footer Note */}
          <footer className="inv-footer">
            <span>KNOTS &amp; FACETS ATELIER &bull; HANDCRAFTED SLOW GOODS</span>
            <span>14-DAY COMPLIMENTARY STUDIO CARE &amp; RE-POLISHING GUARANTEE</span>
            <span>PAGE 01 OF 01</span>
          </footer>
        </article>
      </div>
    );
  }

  // ==================== EMPTY CART FALLBACK ====================
  if (cart.length === 0) {
    return (
      <div className="checkout-page-wrap">
        <div className="checkout-empty-box">
          <img src="/images/logo-mark.png" alt="Knots & Facets" width="76" height="76" />
          <h2>Your Atelier Bag is Currently Empty</h2>
          <p>
            Add one of our handcrafted crystal pieces or slow-stitched crochet creations to proceed to the checkout &amp; payment gateway.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-dark"
              onClick={() => {
                addToCart(CATALOG[0].id, 1);
              }}
            >
              <Sparkles size={15} />
              <span>Quick-Add Bestseller ({formatPrice(CATALOG[0].priceUSD)})</span>
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setActivePage('shop')}
            >
              <span>Browse Full Catalog</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrap">
      {/* Live 256-Bit Payment Gateway Processing Modal */}
      {gatewayStage > 0 && (
        <div className="gateway-processing-overlay" role="alert" aria-live="assertive">
          <div className="gateway-processing-card">
            <div className="gateway-spinner-wrap">
              <div className="gateway-spinner-ring" />
              <img src="/images/logo-mark.png" alt="" width="54" height="54" />
            </div>
            <span className="gateway-ssl-pill">
              <Lock size={12} /> 256-BIT TLS ENCRYPTED GATEWAY
            </span>
            <h3>
              {gatewayStage === 1 && 'Connecting to Secure Payment Gateway...'}
              {gatewayStage === 2 && 'Verifying Payment Authorization...'}
              {gatewayStage === 3 && 'Minting Your Atelier Order Receipt...'}
            </h3>
            <p>Please do not close or refresh this window while we confirm your reservation.</p>
            <div className="gateway-steps-check">
              <div className={`gw-step ${gatewayStage >= 1 ? 'done' : ''}`}>
                <CheckCircle2 size={15} /> <span>Encrypted Handshake Verified</span>
              </div>
              <div className={`gw-step ${gatewayStage >= 2 ? 'done' : ''}`}>
                <CheckCircle2 size={15} /> <span>Payment Method Authorized ({formatPrice(totalUSD)})</span>
              </div>
              <div className={`gw-step ${gatewayStage >= 3 ? 'done' : ''}`}>
                <CheckCircle2 size={15} /> <span>Studio Dispatch Ticket Reserved</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Security Header */}
      <div className="checkout-top-bar">
        <button
          type="button"
          className="checkout-back-btn"
          onClick={() => setActivePage('shop')}
        >
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </button>

        <div className="checkout-steps-indicator">
          <span className="chk-step active">01. Shipping</span>
          <span className="chk-divider">/</span>
          <span className="chk-step active">02. Packaging</span>
          <span className="chk-divider">/</span>
          <span className="chk-step active">03. Payment Gateway</span>
        </div>

        <div className="checkout-ssl-badge">
          <ShieldCheck size={16} />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <form className="checkout-main-grid" onSubmit={handleProcessPayment}>
        {/* ==================== LEFT COLUMN: SHIPPING & PAYMENT GATEWAY ==================== */}
        <div className="checkout-left-col">
          {/* Quick Demo Auto-Fill Banner */}
          <div className="checkout-demo-bar">
            <div>
              <strong>⚡ Express Gateway Test Mode</strong>
              <span>Want to test the payment flow immediately? Auto-fill demo shipping &amp; test card details.</span>
            </div>
            <button type="button" className="checkout-demo-btn" onClick={fillDemoData}>
              Auto-Fill Test Details
            </button>
          </div>

          {/* 1. Collector Contact & Delivery Address */}
          <section className="checkout-card-section">
            <div className="checkout-sec-header">
              <span className="checkout-sec-num">01</span>
              <div>
                <h2>Collector Contact &amp; Delivery Address</h2>
                <p>Where should our studio dispatch your wax-sealed parcel?</p>
              </div>
            </div>

            <div className="checkout-form-grid">
              <div className="chk-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={contact.fullName}
                  onChange={e => setContact({ ...contact, fullName: e.target.value })}
                />
              </div>
              <div className="chk-field">
                <label>Email Address (For Receipt &amp; Tracking) *</label>
                <input
                  type="email"
                  required
                  placeholder="elena@example.com"
                  value={contact.email}
                  onChange={e => setContact({ ...contact, email: e.target.value })}
                />
              </div>
              <div className="chk-field">
                <label>Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={contact.phone}
                  onChange={e => setContact({ ...contact, phone: e.target.value })}
                />
              </div>
              <div className="chk-field">
                <label>Country / Region *</label>
                <select
                  value={contact.country}
                  onChange={e => setContact({ ...contact, country: e.target.value })}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France / European Union</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
              <div className="chk-field full">
                <label>Street Address &amp; House Name *</label>
                <input
                  type="text"
                  required
                  placeholder="14 Highfield Lane, Uzan Bazar"
                  value={contact.address}
                  onChange={e => setContact({ ...contact, address: e.target.value })}
                />
              </div>
              <div className="chk-field">
                <label>Apartment, Suite, or Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="Apt 4B / Near Botanical Gardens"
                  value={contact.apartment}
                  onChange={e => setContact({ ...contact, apartment: e.target.value })}
                />
              </div>
              <div className="chk-field">
                <label>City / Town *</label>
                <input
                  type="text"
                  required
                  placeholder="Guwahati"
                  value={contact.city}
                  onChange={e => setContact({ ...contact, city: e.target.value })}
                />
              </div>
              <div className="chk-field">
                <label>State / Province *</label>
                <input
                  type="text"
                  required
                  placeholder="Assam"
                  value={contact.state}
                  onChange={e => setContact({ ...contact, state: e.target.value })}
                />
              </div>
              <div className="chk-field">
                <label>Postal / PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="781001"
                  value={contact.postalCode}
                  onChange={e => setContact({ ...contact, postalCode: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* 2. Shipping Tier & Wax-Sealed Gift Presentation */}
          <section className="checkout-card-section">
            <div className="checkout-sec-header">
              <span className="checkout-sec-num">02</span>
              <div>
                <h2>Shipping Method &amp; Atelier Presentation</h2>
                <p>Every order is cushioned in organic cotton tissue with dried French lavender.</p>
              </div>
            </div>

            <div className="checkout-radio-grid">
              <label
                className={`checkout-option-card ${shippingMethod === 'standard' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('standard')}
              >
                <div className="chk-opt-top">
                  <div className="chk-opt-title">
                    <Truck size={17} />
                    <strong>Standard Tracked Atelier Post</strong>
                  </div>
                  <span className="chk-opt-price">
                    {isFreeThresholdMet || appliedPromo?.freeShip ? 'FREE' : formatPrice(8)}
                  </span>
                </div>
                <p>Insured eco-parcel with live tracking updates (5–7 business days).</p>
              </label>

              <label
                className={`checkout-option-card ${shippingMethod === 'express' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('express')}
              >
                <div className="chk-opt-top">
                  <div className="chk-opt-title">
                    <Sparkles size={17} />
                    <strong>Priority Express Air Courier</strong>
                  </div>
                  <span className="chk-opt-price">
                    {appliedPromo?.freeShip ? 'FREE' : formatPrice(18)}
                  </span>
                </div>
                <p>Expedited priority air dispatch via DHL / BlueDart (2–3 business days).</p>
              </label>
            </div>

            {/* Signature Gift Box Upgrade */}
            <div
              className={`checkout-gift-toggle ${heirloomBox ? 'active' : ''}`}
              onClick={() => setHeirloomBox(!heirloomBox)}
            >
              <div className="chk-gift-left">
                <Gift size={20} />
                <div>
                  <strong>
                    Include Heirloom Velvet Keepsake Box &amp; Wax-Sealed Calligraphy Note
                  </strong>
                  <small>
                    {isFreeThresholdMet
                      ? 'Complimentary with your $80+ order!'
                      : `Add for ${formatPrice(6)} (Free on orders over ${formatPrice(80)})`}
                  </small>
                </div>
              </div>
              <input
                type="checkbox"
                checked={heirloomBox}
                onChange={e => setHeirloomBox(e.target.checked)}
                onClick={e => e.stopPropagation()}
              />
            </div>

            <div className="chk-field full" style={{ marginTop: '14px' }}>
              <label>Handwritten Gift Note / Studio Instructions (Optional)</label>
              <textarea
                rows={2}
                placeholder="Write a personal message for the wax-sealed card, or share any sizing notes..."
                value={giftNote}
                onChange={e => setGiftNote(e.target.value)}
              />
            </div>
          </section>

          {/* 3. Multi-Mode Payment Gateway */}
          <section className="checkout-card-section payment-gateway-section">
            <div className="checkout-sec-header">
              <span className="checkout-sec-num">03</span>
              <div>
                <h2>Atelier Payment Gateway</h2>
                <p>All transactions are encrypted end-to-end with 3D Secure 2.0 protection.</p>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="payment-method-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={paymentMethod === 'card'}
                className={`pay-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={17} />
                <span>Card</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={paymentMethod === 'upi'}
                className={`pay-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <Smartphone size={17} />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={paymentMethod === 'wallet'}
                className={`pay-tab-btn ${paymentMethod === 'wallet' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <Wallet size={17} />
                <span>Wallets &amp; Pay-in-4</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={paymentMethod === 'cod'}
                className={`pay-tab-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <Truck size={17} />
                <span>Pay on Delivery</span>
              </button>
            </div>

            {/* TAB 1: CREDIT / DEBIT CARD GATEWAY */}
            {paymentMethod === 'card' && (
              <div className="payment-panel">
                {/* Interactive Live Visual Credit Card */}
                <div className="live-credit-card">
                  <div className="lcc-top">
                    <div className="lcc-chip-wrap">
                      <span className="lcc-emv-chip" />
                      <img src="/images/logo-mark.png" alt="" width="34" height="34" />
                    </div>
                    <span className="lcc-brand-badge">{detectedCardBrand}</span>
                  </div>
                  <div className="lcc-number">
                    {cardDetails.number || '•••• •••• •••• ••••'}
                  </div>
                  <div className="lcc-bottom">
                    <div>
                      <small>COLLECTOR NAME</small>
                      <strong>{cardDetails.name || contact.fullName.toUpperCase() || 'ELENA ROSTOVA'}</strong>
                    </div>
                    <div>
                      <small>EXPIRES</small>
                      <strong>{cardDetails.expiry || 'MM/YY'}</strong>
                    </div>
                    <div>
                      <small>CVV</small>
                      <strong>{cardDetails.cvv ? '•••' : '•••'}</strong>
                    </div>
                  </div>
                </div>

                <div className="checkout-form-grid">
                  <div className="chk-field full">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>Card Number *</label>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>
                        Visa &bull; Mastercard &bull; Amex &bull; RuPay
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="4532 8910 4421 8894"
                      value={cardDetails.number}
                      onChange={e => handleCardNumberChange(e.target.value)}
                    />
                  </div>
                  <div className="chk-field full">
                    <label>Name on Card *</label>
                    <input
                      type="text"
                      required
                      placeholder="ELENA ROSTOVA"
                      value={cardDetails.name}
                      onChange={e => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="chk-field">
                    <label>Expiry Date (MM/YY) *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="08/29"
                      value={cardDetails.expiry}
                      onChange={e => handleExpiryChange(e.target.value)}
                    />
                  </div>
                  <div className="chk-field">
                    <label>Security Code (CVV) *</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      required
                      placeholder="•••"
                      value={cardDetails.cvv}
                      onChange={e =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INSTANT UPI & DYNAMIC QR GATEWAY */}
            {paymentMethod === 'upi' && (
              <div className="payment-panel">
                <div className="upi-apps-row">
                  {(
                    [
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm' },
                      { id: 'bhim', label: 'BHIM UPI' }
                    ] as const
                  ).map(app => (
                    <button
                      key={app.id}
                      type="button"
                      className={`upi-app-pill ${upiApp === app.id ? 'active' : ''}`}
                      onClick={() => setUpiApp(app.id)}
                    >
                      <span>{app.label}</span>
                    </button>
                  ))}
                </div>

                <div className="upi-gateway-split">
                  <div className="upi-vpa-box">
                    <label>Enter Your UPI ID (VPA)</label>
                    <div className="upi-input-group">
                      <input
                        type="text"
                        placeholder="collector@okaxis"
                        value={upiId}
                        onChange={e => {
                          setUpiId(e.target.value);
                          setIsUpiVerified(false);
                        }}
                      />
                      <button type="button" onClick={handleVerifyUpi}>
                        Verify
                      </button>
                    </div>
                    {isUpiVerified && (
                      <div className="upi-verified-msg">
                        <CheckCircle2 size={14} />
                        <span>Verified VPA &bull; Ready for Instant Collect Request</span>
                      </div>
                    )}
                    <p className="upi-hint">
                      Or scan the encrypted Atelier QR code on the right using any UPI app on your phone.
                    </p>
                  </div>

                  {/* Scannable Dynamic SVG QR Code */}
                  <div className="upi-qr-card">
                    <div className="upi-qr-frame">
                      <svg viewBox="0 0 120 120" width="116" height="116" aria-label="Atelier UPI QR Code">
                        <rect width="120" height="120" rx="8" fill="#FFFCF8" />
                        {/* Corner Finder Patterns */}
                        <rect x="10" y="10" width="28" height="28" fill="none" stroke="#29231F" strokeWidth="4" />
                        <rect x="18" y="18" width="12" height="12" fill="#29231F" />
                        <rect x="82" y="10" width="28" height="28" fill="none" stroke="#29231F" strokeWidth="4" />
                        <rect x="90" y="18" width="12" height="12" fill="#29231F" />
                        <rect x="10" y="82" width="28" height="28" fill="none" stroke="#29231F" strokeWidth="4" />
                        <rect x="18" y="90" width="12" height="12" fill="#29231F" />
                        {/* Data Matrix Modules */}
                        <path
                          d="M46 12h6v6h-6zM58 12h12v6H58zM46 24h12v6H46zM64 24h6v12h-6zM46 36h6v6h-6zM12 46h12v6H12zM30 46h6v12h-6zM44 46h8v8h-8zM70 46h12v6H70zM90 46h18v6H90zM12 58h6v12h-6zM24 64h12v6H24zM82 58h6v18h-6zM96 60h12v6H96zM46 76h12v6H46zM64 76h12v6H64zM46 88h6v18h-6zM58 94h18v6H58zM82 84h14v6H82zM100 84h8v12h-8zM84 96h12v12H84z"
                          fill="#29231F"
                        />
                        {/* Center Brand Diamond */}
                        <polygon points="60,48 72,60 60,72 48,60" fill="#9B7765" />
                      </svg>
                    </div>
                    <small>Scan to Pay {formatPrice(totalUSD)}</small>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXPRESS WALLETS & PAY-IN-4 */}
            {paymentMethod === 'wallet' && (
              <div className="payment-panel">
                <div className="checkout-radio-grid">
                  <label
                    className={`checkout-option-card ${selectedWallet === 'klarna' ? 'selected' : ''}`}
                    onClick={() => setSelectedWallet('klarna')}
                  >
                    <div className="chk-opt-top">
                      <strong>Klarna / Simpl — 4 Interest-Free Payments</strong>
                      <span className="chk-opt-price">0% APR</span>
                    </div>
                    <p>
                      Split your {formatPrice(totalUSD)} order into 4 payments of{' '}
                      <strong>{formatPrice(totalUSD / 4)}</strong> every 2 weeks.
                    </p>
                  </label>

                  <label
                    className={`checkout-option-card ${selectedWallet === 'paypal' ? 'selected' : ''}`}
                    onClick={() => setSelectedWallet('paypal')}
                  >
                    <div className="chk-opt-top">
                      <strong>PayPal Express Buyer Protection</strong>
                      <span className="chk-opt-price">Instant</span>
                    </div>
                    <p>Pay securely with your PayPal balance or linked international bank account.</p>
                  </label>

                  <label
                    className={`checkout-option-card ${selectedWallet === 'applepay' ? 'selected' : ''}`}
                    onClick={() => setSelectedWallet('applepay')}
                  >
                    <div className="chk-opt-top">
                      <strong>Apple Pay / Google Wallet Token</strong>
                      <span className="chk-opt-price">Biometric</span>
                    </div>
                    <p>One-touch Touch ID / Face ID tokenized payment authorization.</p>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 4: PAY ON DELIVERY (COD) */}
            {paymentMethod === 'cod' && (
              <div className="payment-panel">
                <div className="cod-notice-card">
                  <Truck size={22} />
                  <div>
                    <strong>Pay on Delivery Available (+{formatPrice(3)} Cash Handling Fee)</strong>
                    <p>
                      Pay via Cash or UPI QR directly to the courier partner when your wax-sealed parcel arrives at your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Payment CTA */}
            <button type="submit" className="checkout-pay-submit-btn">
              <Lock size={17} />
              <span>
                {paymentMethod === 'cod'
                  ? `Confirm COD Order — ${formatPrice(totalUSD)}`
                  : `Pay ${formatPrice(totalUSD)} Securely`}
              </span>
            </button>

            <div className="checkout-trust-row">
              <span>🔒 PCI-DSS Level 1 Compliant</span>
              <span>💎 100% Authenticity Wax Seal</span>
              <span>↩️ 14-Day Studio Care Guarantee</span>
            </div>
          </section>
        </div>

        {/* ==================== RIGHT COLUMN: STICKY ORDER SUMMARY ==================== */}
        <aside className="checkout-right-col">
          <div className="checkout-summary-card">
            <div className="chk-sum-header">
              <h3>Atelier Order Summary</h3>
              <span>{cart.reduce((s, i) => s + i.qty, 0)} Pieces</span>
            </div>

            <div className="chk-sum-items">
              {cart.map(item => (
                <div key={item.id} className="chk-sum-item">
                  <img src={item.image} alt={item.title} />
                  <div className="chk-sum-info">
                    <h4>{item.title}</h4>
                    <small>{item.categoryLabel}</small>
                    <div className="chk-sum-qty">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                      <button
                        type="button"
                        className="chk-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <strong className="chk-sum-price">
                    {formatPrice(item.priceUSD * item.qty)}
                  </strong>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="chk-promo-box">
              <label>
                <Tag size={13} /> Collector Promo or Gift Code
              </label>
              <div className="chk-promo-input-row">
                <input
                  type="text"
                  placeholder="Enter code (e.g. KNOTS10)"
                  value={promoInput}
                  onChange={e => setPromoInput(e.target.value)}
                />
                <button type="button" onClick={() => applyPromoCode()}>
                  Apply
                </button>
              </div>
              <div className="chk-promo-pills">
                <button type="button" onClick={() => applyPromoCode('KNOTS10')}>
                  KNOTS10 (10% OFF)
                </button>
                <button type="button" onClick={() => applyPromoCode('ATELIER15')}>
                  ATELIER15 (15% OFF)
                </button>
                <button type="button" onClick={() => applyPromoCode('FREESHIP')}>
                  FREESHIP
                </button>
              </div>
            </div>

            {/* Breakdown */}
            <div className="chk-breakdown">
              <div className="chk-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotalUSD)}</span>
              </div>
              {appliedPromo && discountUSD > 0 && (
                <div className="chk-row discount">
                  <span>Promo ({appliedPromo.code})</span>
                  <span>−{formatPrice(discountUSD)}</span>
                </div>
              )}
              <div className="chk-row">
                <span>Shipping ({shippingMethod === 'express' ? 'Express Air' : 'Standard Tracked'})</span>
                <span>{shippingUSD === 0 ? 'FREE' : formatPrice(shippingUSD)}</span>
              </div>
              {heirloomBox && (
                <div className="chk-row">
                  <span>Heirloom Velvet Gift Box</span>
                  <span>{giftWrapUSD === 0 ? 'FREE' : formatPrice(giftWrapUSD)}</span>
                </div>
              )}
              {codFeeUSD > 0 && (
                <div className="chk-row">
                  <span>COD Handling Fee</span>
                  <span>{formatPrice(codFeeUSD)}</span>
                </div>
              )}
              <div className="chk-row grand-total">
                <span>Total Due</span>
                <strong>{formatPrice(totalUSD)}</strong>
              </div>
            </div>

            <div className="chk-wax-guarantee">
              <img src="/images/logo-mark.png" alt="" width="34" height="34" />
              <p>
                Packed by hand in our Guwahati studio with unbleached tissue, lavender sprigs &amp; an authentic wax stamp.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

