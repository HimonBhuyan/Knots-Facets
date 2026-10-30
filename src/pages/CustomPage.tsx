import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PageId } from '../types';
import { CATALOG } from '../data/catalog';
import { Sparkles, Gift, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CustomPageProps {
  setActivePage: (page: PageId) => void;
}

const CREATION_TYPES = [
  {
    id: 'bridal',
    title: 'Bespoke Bridal Suite',
    price: 120,
    image: '/images/collection-jewellery.jpg',
    desc: 'Custom crystal drop earrings, matching necklace and hairpin tailored for weddings.'
  },
  {
    id: 'tote',
    title: 'Tailored Crochet Bag',
    price: 95,
    image: '/images/crochet_bag.jpg',
    desc: 'Custom dimensions, stitch texture, and choice of bridle leather or braided yarn handles.'
  },
  {
    id: 'suncatcher',
    title: 'Crystal Prismatic Suncatcher',
    price: 65,
    image: '/images/hero.jpg',
    desc: 'Brass geometric framework with faceted Austrian crystals for window rainbows.'
  },
  {
    id: 'suite',
    title: 'Curated Keepsake Gift Suite',
    price: 110,
    image: '/images/packaging_gifting.jpg',
    desc: 'Jewellery piece + floral crochet accessory packed in a wax-sealed wooden box.'
  }
];

const PALETTES = [
  {
    title: 'Champagne & Pearl',
    desc: 'Soft warm ivory, raw silk, and radiant gold.',
    colors: ['#F4EBD9', '#E2CEB9', '#FAF8F5']
  },
  {
    title: 'Rose & Amethyst',
    desc: 'Smoky lavender, dusty rose, and lilac crystals.',
    colors: ['#E8D3D8', '#B39BB2', '#FAF3F4']
  },
  {
    title: 'Sage & Natural Flax',
    desc: 'Earthy eucalyptus, unbleached linen, and dewdrop glass.',
    colors: ['#D1D9CE', '#8C9E86', '#EFECE6']
  },
  {
    title: 'Terracotta & Amber',
    desc: 'Warm sun-baked clay, amber glass, and raw brass.',
    colors: ['#C9826B', '#9B7765', '#EAD7CE']
  }
];

const METALS = [
  { title: '14k Gold-Filled (+ $15)', price: 15, desc: 'Warm heirloom glow, hypoallergenic & tarnish-resistant.' },
  { title: '925 Sterling Silver (+ $10)', price: 10, desc: 'Cool luminous finish for crystal refractions.' },
  { title: 'Antique Raw Brass (Included)', price: 0, desc: 'Earthy vintage patina with organic cotton cord.' }
];

const WAX_SEALS = [
  { id: 'gold', label: 'Antique Metallic Gold', color: '#C29B38' },
  { id: 'rosewood', label: 'Rosewood Crimson', color: '#8A3B3B' },
  { id: 'sage', label: 'Botanical Forest Sage', color: '#5E7460' }
];

export const CustomPage: React.FC<CustomPageProps> = ({ setActivePage }) => {
  const { formatPrice, addCustomItemToCart, openCheckout } = useCart();

  const [activeTab, setActiveTab] = useState<'bespoke' | 'bundle'>('bespoke');

  // Tab 1: Bespoke Configurator State
  const [selectedType, setSelectedType] = useState(CREATION_TYPES[0]);
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0]);
  const [selectedMetal, setSelectedMetal] = useState(METALS[0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    notes: ''
  });

  // Tab 2: Interactive Keepsake Gift Box Builder State
  const jewelleryPieces = CATALOG.filter(p => p.category === 'jewellery');
  const crochetPieces = CATALOG.filter(p => p.category === 'crochet');
  const [bundleJewel, setBundleJewel] = useState(jewelleryPieces[0]);
  const [bundleCrochet, setBundleCrochet] = useState(crochetPieces[0]);
  const [selectedSeal, setSelectedSeal] = useState(WAX_SEALS[0]);
  const [bundleNote, setBundleNote] = useState('');

  const totalPriceUSD = selectedType.price + selectedMetal.price;

  // Add Bespoke Commission to Bag
  const handleAddBespokeToBag = (proceedToCheckout = false) => {
    const customId = `bespoke-${selectedType.id}-${selectedPalette.title.toLowerCase().replace(/\s+/g, '-')}`;
    addCustomItemToCart({
      id: customId,
      title: `${selectedType.title} (${selectedPalette.title})`,
      priceUSD: totalPriceUSD,
      image: selectedType.image,
      categoryLabel: `Bespoke • ${selectedMetal.title.split('(')[0].trim()}`
    });
    if (proceedToCheckout) {
      openCheckout();
    }
  };

  // Bundle Pricing (15% Bundle Discount)
  const rawBundleUSD = bundleJewel.priceUSD + bundleCrochet.priceUSD;
  const discountedBundleUSD = Math.round(rawBundleUSD * 0.85);
  const bundleSavingsUSD = rawBundleUSD - discountedBundleUSD;

  const handleAddBundleToBag = (proceedToCheckout = false) => {
    const bundleId = `bundle-${bundleJewel.id}-${bundleCrochet.id}-${selectedSeal.id}`;
    addCustomItemToCart({
      id: bundleId,
      title: `Keepsake Duet: ${bundleJewel.title.split(' ')[0]} + ${bundleCrochet.title.split(' ')[2] || 'Crochet'}`,
      priceUSD: discountedBundleUSD,
      image: '/images/packaging_gifting.jpg',
      categoryLabel: `15% Bundle • ${selectedSeal.label} Wax Seal`
    });
    if (proceedToCheckout) {
      openCheckout();
    }
  };

  return (
    <div className="custom-page">
      <section className="page-banner">
        <span className="eyebrow">Studio Atelier Commissions &amp; Gifting</span>
        <h1 className="page-title">Bespoke Creations &amp; Keepsake Builder</h1>
        <p className="page-subtitle">
          Design a custom-made heirloom tailored to your palette, or pair a crystal piece with a slow-stitched crochet creation for an automatic 15% Keepsake Box discount.
        </p>

        {/* Mode Switcher Pills */}
        <div className="custom-mode-tabs">
          <button
            type="button"
            className={`custom-mode-btn ${activeTab === 'bespoke' ? 'active' : ''}`}
            onClick={() => setActiveTab('bespoke')}
          >
            <Sparkles size={16} />
            <span>01. Bespoke 4-Step Configurator</span>
          </button>
          <button
            type="button"
            className={`custom-mode-btn ${activeTab === 'bundle' ? 'active' : ''}`}
            onClick={() => setActiveTab('bundle')}
          >
            <Gift size={16} />
            <span>02. Build a Keepsake Gift Box (Save 15%)</span>
          </button>
        </div>
      </section>

      <div className="section-block">
        {activeTab === 'bespoke' ? (
          <div className="bespoke-split-layout">
            {/* Left: 4-Step Interactive Configurator */}
            <form
              className="configurator-wrap"
              onSubmit={e => {
                e.preventDefault();
                handleAddBespokeToBag(true);
              }}
            >
              {/* Step 1: Type */}
              <div className="config-step">
                <div className="step-number">Step 01 / 04</div>
                <h2 className="step-title">Choose Your Creation Type</h2>
                <div className="option-grid">
                  {CREATION_TYPES.map(opt => (
                    <div
                      key={opt.title}
                      className={`option-card ${selectedType.title === opt.title ? 'selected' : ''}`}
                      onClick={() => setSelectedType(opt)}
                      role="button"
                      tabIndex={0}
                    >
                      <h4>{opt.title}</h4>
                      <p>{opt.desc}</p>
                      <div className="option-price-tag">Base {formatPrice(opt.price)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Palette */}
              <div className="config-step">
                <div className="step-number">Step 02 / 04</div>
                <h2 className="step-title">Select Color Harmony</h2>
                <div className="palette-grid">
                  {PALETTES.map(pal => (
                    <div
                      key={pal.title}
                      className={`palette-card ${selectedPalette.title === pal.title ? 'selected' : ''}`}
                      onClick={() => setSelectedPalette(pal)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="swatch-bubbles">
                        {pal.colors.map((c, i) => (
                          <span key={i} className="swatch" style={{ background: c }} />
                        ))}
                      </div>
                      <h4>{pal.title}</h4>
                      <p>{pal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Metal & Finish */}
              <div className="config-step">
                <div className="step-number">Step 03 / 04</div>
                <h2 className="step-title">Select Metal &amp; Wire Finish</h2>
                <div className="option-grid">
                  {METALS.map(metal => (
                    <div
                      key={metal.title}
                      className={`option-card ${selectedMetal.title === metal.title ? 'selected' : ''}`}
                      onClick={() => setSelectedMetal(metal)}
                      role="button"
                      tabIndex={0}
                    >
                      <h4>{metal.title}</h4>
                      <p>{metal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Engraving / Sizing Notes */}
              <div className="config-step">
                <div className="step-number">Step 04 / 04</div>
                <h2 className="step-title">Personalization &amp; Sizing Notes</h2>
                <div className="checkout-form-grid">
                  <div className="chk-field">
                    <label>Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Elena Rostova"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="chk-field">
                    <label>Target Occasion Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="chk-field full">
                    <label>Chain Length, Stitch Pattern, or Engraving Request</label>
                    <textarea
                      rows={3}
                      placeholder="Share preferred chain length (e.g. 16 inch collar), strap drop, or wax-seal initials..."
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Right: Sticky Live Atelier Commission Preview Card */}
            <aside className="bespoke-preview-sticky">
              <div className="bespoke-preview-card">
                <div className="bp-img-wrap">
                  <img src={selectedType.image} alt={selectedType.title} />
                  <span className="bp-badge">LIVE ATELIER PREVIEW</span>
                </div>

                <div className="bp-body">
                  <span className="bp-category">CUSTOM STUDIO COMMISSION</span>
                  <h3>{selectedType.title}</h3>

                  <div className="bp-spec-list">
                    <div className="bp-spec-row">
                      <span>Color Harmony</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {selectedPalette.colors.map((c, idx) => (
                          <i
                            key={idx}
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: c,
                              border: '1px solid rgba(41,35,31,0.2)',
                              display: 'inline-block'
                            }}
                          />
                        ))}
                        <strong>{selectedPalette.title}</strong>
                      </div>
                    </div>
                    <div className="bp-spec-row">
                      <span>Metal Finish</span>
                      <strong>{selectedMetal.title.split('(')[0].trim()}</strong>
                    </div>
                    <div className="bp-spec-row">
                      <span>Crafting Lead Time</span>
                      <strong>5–7 Studio Days</strong>
                    </div>
                  </div>

                  <div className="bp-price-row">
                    <span>Estimated Commission Total</span>
                    <strong>{formatPrice(totalPriceUSD)}</strong>
                  </div>

                  <div className="bp-actions">
                    <button
                      type="button"
                      className="btn-dark"
                      style={{ width: '100%' }}
                      onClick={() => handleAddBespokeToBag(true)}
                    >
                      <span>Commission &amp; Proceed to Checkout</span>
                      <ArrowRight size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ width: '100%' }}
                      onClick={() => handleAddBespokeToBag(false)}
                    >
                      <ShoppingBag size={15} />
                      <span>Add Commission to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* ==================== TAB 2: INTERACTIVE KEEPSAKE GIFT BOX BUILDER ==================== */
          <div className="bespoke-split-layout">
            <div className="configurator-wrap">
              {/* Step 1: Pick 1 Glass & Crystal Piece */}
              <div className="config-step">
                <div className="step-number">Box Element 01 / 03</div>
                <h2 className="step-title">Select 1 Glass &amp; Crystal Jewellery Piece</h2>
                <div className="bundle-picker-grid">
                  {jewelleryPieces.map(prod => (
                    <div
                      key={prod.id}
                      className={`bundle-item-card ${bundleJewel.id === prod.id ? 'selected' : ''}`}
                      onClick={() => setBundleJewel(prod)}
                      role="button"
                      tabIndex={0}
                    >
                      <img src={prod.image} alt={prod.title} />
                      <div className="bundle-item-info">
                        <h4>{prod.title}</h4>
                        <span>{formatPrice(prod.priceUSD)}</span>
                      </div>
                      {bundleJewel.id === prod.id && (
                        <CheckCircle2 size={18} className="bundle-check" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Pick 1 Slow-Stitched Crochet Piece */}
              <div className="config-step">
                <div className="step-number">Box Element 02 / 03</div>
                <h2 className="step-title">Pair with 1 Slow-Stitched Crochet Creation</h2>
                <div className="bundle-picker-grid">
                  {crochetPieces.map(prod => (
                    <div
                      key={prod.id}
                      className={`bundle-item-card ${bundleCrochet.id === prod.id ? 'selected' : ''}`}
                      onClick={() => setBundleCrochet(prod)}
                      role="button"
                      tabIndex={0}
                    >
                      <img src={prod.image} alt={prod.title} />
                      <div className="bundle-item-info">
                        <h4>{prod.title}</h4>
                        <span>{formatPrice(prod.priceUSD)}</span>
                      </div>
                      {bundleCrochet.id === prod.id && (
                        <CheckCircle2 size={18} className="bundle-check" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Pick Wax Seal Color & Calligraphy Note */}
              <div className="config-step">
                <div className="step-number">Box Element 03 / 03</div>
                <h2 className="step-title">Choose Wax Seal Impression &amp; Gift Note</h2>
                <div className="wax-seal-options">
                  {WAX_SEALS.map(seal => (
                    <button
                      key={seal.id}
                      type="button"
                      className={`wax-seal-pill ${selectedSeal.id === seal.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSeal(seal)}
                    >
                      <span className="wax-dot" style={{ background: seal.color }} />
                      <span>{seal.label}</span>
                    </button>
                  ))}
                </div>

                <div className="chk-field full" style={{ marginTop: '16px' }}>
                  <label>Handwritten Calligraphy Card Message (Included)</label>
                  <textarea
                    rows={2}
                    placeholder="Write a personal note to be sealed inside the keepsake box..."
                    value={bundleNote}
                    onChange={e => setBundleNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right: Sticky Keepsake Box Summary */}
            <aside className="bespoke-preview-sticky">
              <div className="bespoke-preview-card">
                <div className="bp-img-wrap">
                  <img src="/images/packaging_gifting.jpg" alt="Keepsake Gift Suite" />
                  <span className="bp-badge" style={{ background: '#2E6F40', color: '#fff' }}>
                    15% BUNDLE SAVINGS UNLOCKED
                  </span>
                </div>

                <div className="bp-body">
                  <span className="bp-category">CURATED KEEPSAKE DUET</span>
                  <h3>The Wax-Sealed Keepsake Suite</h3>

                  <div className="bundle-mini-pair">
                    <div className="bmp-row">
                      <img src={bundleJewel.image} alt={bundleJewel.title} />
                      <div>
                        <small>01 • CRYSTAL PIECE</small>
                        <strong>{bundleJewel.title}</strong>
                      </div>
                      <span>{formatPrice(bundleJewel.priceUSD)}</span>
                    </div>
                    <div className="bmp-row">
                      <img src={bundleCrochet.image} alt={bundleCrochet.title} />
                      <div>
                        <small>02 • CROCHET PIECE</small>
                        <strong>{bundleCrochet.title}</strong>
                      </div>
                      <span>{formatPrice(bundleCrochet.priceUSD)}</span>
                    </div>
                  </div>

                  <div className="bp-spec-list">
                    <div className="bp-spec-row">
                      <span>Wax Seal Stamp</span>
                      <strong>{selectedSeal.label}</strong>
                    </div>
                    <div className="bp-spec-row" style={{ color: '#2E6F40' }}>
                      <span>15% Duet Savings</span>
                      <strong>−{formatPrice(bundleSavingsUSD)}</strong>
                    </div>
                  </div>

                  <div className="bp-price-row">
                    <div>
                      <span>Bundle Total</span>
                      <small
                        style={{
                          display: 'block',
                          textDecoration: 'line-through',
                          color: 'var(--ink-muted)'
                        }}
                      >
                        Was {formatPrice(rawBundleUSD)}
                      </small>
                    </div>
                    <strong>{formatPrice(discountedBundleUSD)}</strong>
                  </div>

                  <div className="bp-actions">
                    <button
                      type="button"
                      className="btn-dark"
                      style={{ width: '100%' }}
                      onClick={() => handleAddBundleToBag(true)}
                    >
                      <span>Checkout Keepsake Box</span>
                      <ArrowRight size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ width: '100%' }}
                      onClick={() => handleAddBundleToBag(false)}
                    >
                      <ShoppingBag size={15} />
                      <span>Add Keepsake Suite to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
