import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PageId } from '../types';

interface CustomPageProps {
  setActivePage: (page: PageId) => void;
}

export const CustomPage: React.FC<CustomPageProps> = ({ setActivePage }) => {
  const { formatPrice, showToast } = useCart();

  const [selectedType, setSelectedType] = useState({
    title: 'Bespoke Bridal Suite',
    price: 120
  });

  const [selectedPalette, setSelectedPalette] = useState('Champagne & Pearl');

  const [selectedMetal, setSelectedMetal] = useState({
    title: '14k Gold-Filled (+ $15)',
    price: 15
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    notes: ''
  });

  const totalPriceUSD = selectedType.price + selectedMetal.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      `✨ Thank you ${formData.name || 'friend'}! Your bespoke request for "${selectedType.title}" (${selectedPalette}) has been sent to our studio bench.`,
      '💌'
    );
    setFormData({ name: '', email: '', date: '', notes: '' });
    setTimeout(() => {
      setActivePage('shop');
    }, 2800);
  };

  return (
    <div className="custom-page">
      <section className="page-banner">
        <span className="eyebrow">Studio Atelier Commissions</span>
        <h1 className="page-title">Bespoke Creations Configurator</h1>
        <p className="page-subtitle">
          Whether you are planning a wedding suite, requesting a custom colorway, or crafting a tailored gift box, we collaborate directly with you to bring your vision to life.
        </p>
      </section>

      <div className="section-block">
        <form className="configurator-wrap" onSubmit={handleSubmit}>
          {/* Step 1: Type */}
          <div className="config-step">
            <div className="step-number">Step 01 / 04</div>
            <h2 className="step-title">Choose Your Creation Type</h2>
            <div className="option-grid">
              {[
                { title: 'Bespoke Bridal Suite', price: 120, desc: 'Custom crystal drop earrings, matching necklace and hairpin tailored for weddings.' },
                { title: 'Tailored Crochet Bag', price: 95, desc: 'Custom dimensions, stitch texture, and choice of bridle leather or braided yarn handles.' },
                { title: 'Crystal Prismatic Suncatcher', price: 65, desc: 'Brass geometric framework with faceted Austrian crystals for window rainbows.' },
                { title: 'Curated Keepsake Gift Suite', price: 110, desc: 'Jewellery piece + floral crochet accessory packed in a wax-sealed wooden box.' }
              ].map(opt => (
                <div
                  key={opt.title}
                  className={`option-card ${selectedType.title === opt.title ? 'selected' : ''}`}
                  onClick={() => setSelectedType(opt)}
                  role="button"
                  tabIndex={0}
                >
                  <h4>{opt.title}</h4>
                  <p>{opt.desc}</p>
                  <div className="option-price-tag">From {formatPrice(opt.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Palette */}
          <div className="config-step">
            <div className="step-number">Step 02 / 04</div>
            <h2 className="step-title">Select Color Harmony</h2>
            <div className="palette-grid">
              {[
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
              ].map(pal => (
                <div
                  key={pal.title}
                  className={`palette-card ${selectedPalette === pal.title ? 'selected' : ''}`}
                  onClick={() => setSelectedPalette(pal.title)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="swatch-bubbles">
                    {pal.colors.map((c, i) => (
                      <span key={i} className="swatch" style={{ background: c }} />
                    ))}
                  </div>
                  <strong style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '1.15rem', marginBottom: '4px' }}>
                    {pal.title}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{pal.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Hardware */}
          <div className="config-step">
            <div className="step-number">Step 03 / 04</div>
            <h2 className="step-title">Hardware &amp; Metal Upgrade</h2>
            <div className="option-grid">
              {[
                { title: '14k Gold-Filled (+ $15)', price: 15, desc: 'Thick 14k gold bonded layer. Non-tarnishing, hypoallergenic and shower-safe.' },
                { title: '925 Sterling Silver (+ $10)', price: 10, desc: 'Bright lustrous solid silver wire and components. Timeless and cool-toned.' },
                { title: 'Vintage Raw Brass (Standard)', price: 0, desc: 'Aged golden hue that develops an organic antique patina over time.' }
              ].map(metal => (
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

          {/* Step 4: Details */}
          <div className="config-step">
            <div className="step-number">Step 04 / 04</div>
            <h2 className="step-title">Your Details &amp; Personal Notes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Claire Davies"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="claire@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>
                  Desired Delivery / Event Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: '0.9rem' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>
                Specific Dimensions, Sizing or Special Requests
              </label>
              <textarea
                rows={3}
                placeholder="E.g., 16-inch necklace length, gold monogram initial 'M', requested for autumn garden wedding..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: '0.9rem', fontFamily: 'var(--sans)' }}
              />
            </div>
          </div>

          {/* Estimate Bar */}
          <div className="config-summary-bar">
            <div className="config-estimate">
              <span>Estimated Studio Commission</span>
              <strong>{formatPrice(totalPriceUSD)}</strong>
            </div>
            <button type="submit" className="btn-dark" style={{ padding: '14px 32px', fontSize: '0.92rem' }}>
              Submit Bespoke Commission
            </button>
          </div>
        </form>

        {/* Care Guide Section */}
        <section id="care" style={{ marginTop: '80px' }}>
          <div className="section-header">
            <span className="eyebrow">Heirloom Longevity</span>
            <h2 className="title">Studio Care &amp; Washing Guide</h2>
            <p className="subtext">Our creations are made to last for years when cared for with gentle consideration.</p>
          </div>

          <div className="care-grid" style={{ marginBottom: '60px' }}>
            <div className="care-card">
              <h3>💎 Crystal &amp; Glass Care</h3>
              <ul>
                <li><strong>Soft Polishing:</strong> Gently wipe crystal facets with a dry lint-free microfiber cloth to restore brilliant refraction.</li>
                <li><strong>Chemical Caution:</strong> Put on jewellery *after* applying perfumes, hairsprays, and lotions to prevent cloudy residue.</li>
                <li><strong>Water Exposure:</strong> While our 14k gold-filled wire resists moisture, remove pieces before swimming or chlorinated pools.</li>
                <li><strong>Safe Storage:</strong> Keep in your velvet studio pouch away from abrasive metals to avoid scratching delicate glass corners.</li>
              </ul>
            </div>

            <div className="care-card">
              <h3>🌿 Cotton &amp; Fibre Care</h3>
              <ul>
                <li><strong>Hand Wash Only:</strong> Submerge in lukewarm water with a drop of gentle wool/silk detergent or mild baby shampoo.</li>
                <li><strong>No Wringing:</strong> Never twist or wring crochet stitches. Instead, press flat between two clean cotton towels to absorb water.</li>
                <li><strong>Reshaping:</strong> Lay flat on a clean surface in natural shape to dry. Avoid hanging while damp to prevent stitch stretching.</li>
                <li><strong>Leather Trim:</strong> Avoid soaking leather handles in water; condition yearly with a tiny drop of natural beeswax balm.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
