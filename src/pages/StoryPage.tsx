import React from 'react';
import { PageId } from '../types';

interface StoryPageProps {
  setActivePage: (page: PageId) => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ setActivePage }) => {
  return (
    <div className="story-page">
      <section className="page-banner">
        <span className="eyebrow">The Atelier Philosophy</span>
        <h1 className="page-title">The Patience of Knots,<br />The Clarity of Facets</h1>
        <p className="page-subtitle">
          Knots &amp; Facets was born from a simple realization: the tactile grounding of textile art and the radiant clarity of glass jewellery are two halves of the same meditative expression.
        </p>
      </section>

      <div className="section-block">
        {/* Full-Width Studio Hero Banner */}
        <div className="story-hero" style={{ position: 'relative', marginBottom: '60px', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '21 / 9', minHeight: '400px' }}>
          <img
            src="/images/atelier_studio.jpg"
            alt="Knots &amp; Facets artisan workbench with crochet hooks and glass crystals"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(41,35,31,0.2) 0%, rgba(41,35,31,0.7) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(30px, 5vw, 60px)', color: 'var(--white)' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 400, margin: '0 0 10px' }}>
              Inside our Guwahati Studio Workbench
            </h2>
            <p style={{ maxWidth: '580px', fontSize: '1.05rem', margin: 0, opacity: 0.92 }}>
              Our atelier in Guwahati, Assam — where morning river sunlight reflects off uncut crystals, raw cotton spools, and hand-drawn jewelry sketches.
            </p>
          </div>
        </div>

        {/* Split Story 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(30px, 6vw, 80px)', alignItems: 'center', marginBottom: 'clamp(60px, 9vw, 100px)' }}>
          <div>
            <span className="eyebrow">Two Disciplines, One Heart</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', lineHeight: 1.15, margin: '0 0 20px' }}>
              A slow conversation between fibre and light.
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '20px' }}>
              In a world defined by industrial automation, we choose to work at human pace. Crochet cannot be replicated by any modern factory machine; every stitch requires the deliberate tension of human hands, looping natural cotton into heirloom accessories.
            </p>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.02rem', lineHeight: 1.8 }}>
              Beside the yarn bowls sit trays of Bohemian glass, Austrian crystal elements, and non-tarnish gold wire. Where crochet brings warmth and gentle tactile softness, faceted crystals capture the sunlight and turn ordinary gestures into luminous moments.
            </p>
          </div>
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <img src="/images/necklace_pendant.jpg" alt="Faceted crystal pendant refracting rainbow light" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Split Story 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(30px, 6vw, 80px)', alignItems: 'center', marginBottom: 'clamp(60px, 9vw, 100px)' }}>
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <img src="/images/crochet_bag.jpg" alt="Handcrafted natural cotton crochet tote bag" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span className="eyebrow">Mindful Making</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', lineHeight: 1.15, margin: '0 0 20px' }}>
              One piece at a time. Zero mass production.
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '20px' }}>
              We work in micro-batches and bespoke commissions. When you order a piece from Knots &amp; Facets, it is crafted specifically for you. The glass stones are hand-selected for clarity and refraction, while our crochet threads are tension-tested for durability and comfort against sensitive skin.
            </p>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.02rem', lineHeight: 1.8 }}>
              No two pieces are ever identical. The slight organic variance in bead facets or the subtle texture of cotton slub is the unmistakable signature of authentic human craftsmanship.
            </p>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="section-header center">
          <span className="eyebrow">Guiding Values</span>
          <h2 className="title">Our Craft Manifesto</h2>
          <p className="subtext">Every decision in our studio is rooted in four uncompromising commitments.</p>
        </div>

        <div className="pillars-grid" style={{ marginBottom: '80px' }}>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <h3>Slow Rhythm</h3>
            <p>We honor the time each piece demands. Rushing compromises beauty, so we give each knot and wire wrap our undivided focus.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ fontSize: '2rem', marginBottom: '16px' }}>🌱</div>
            <h3>Conscious Fibres</h3>
            <p>100% natural organic cotton, raw flax linen, and non-toxic plant dyes that are gentle on both your skin and the earth.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ fontSize: '2rem', marginBottom: '16px' }}>💎</div>
            <h3>Prismatic Clarity</h3>
            <p>We use genuine faceted glass and lead-free crystal elements that turn ambient room light into vibrant rainbow spectacles.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ fontSize: '2rem', marginBottom: '16px' }}>📦</div>
            <h3>Plastic-Free Gifting</h3>
            <p>From recycled kraft boxes to botanical dried sprigs and wax seal impressions, our unboxing experience is entirely biodegradable.</p>
          </div>
        </div>

        {/* Material Provenance Table */}
        <div style={{ marginBottom: '80px' }}>
          <div className="section-header">
            <span className="eyebrow">Material Transparency</span>
            <h2 className="title">What Goes Into Each Creation</h2>
            <p className="subtext">We believe you deserve to know exactly what touches your skin and graces your everyday rituals.</p>
          </div>

          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', overflowX: 'auto', padding: 'clamp(24px, 4vw, 44px)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', padding: '16px 20px', borderBottom: '2px solid var(--line)' }}>Component</th>
                  <th style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', padding: '16px 20px', borderBottom: '2px solid var(--line)' }}>Source &amp; Grade</th>
                  <th style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', padding: '16px 20px', borderBottom: '2px solid var(--line)' }}>Why We Choose It</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}><strong>Glass &amp; Crystal Elements</strong></td>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}>Bohemian Czech Glass &amp; Precision Cut Crystals</td>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}>Exceptional refractive index producing vivid rainbow flares in natural sunlight.</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}><strong>Earring Wires &amp; Chains</strong></td>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}>14k Gold-Filled &amp; 925 Sterling Silver</td>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}>Hypoallergenic, water-resistant, and non-tarnishing.</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}><strong>Crochet Yarn &amp; Thread</strong></td>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}>Organic Combed Cotton &amp; Belgian Flax Linen</td>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}>Breathable, wash-durable, and free from synthetic petroleum acrylics.</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}><strong>Bag Handles &amp; Trims</strong></td>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}>Vegetable-Tanned Bridle Leather</td>
                  <td style={{ padding: '18px 20px', borderBottom: '1px solid var(--line-light)' }}>Ages with a rich honey patina over time without chemical chrome tanning.</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 20px' }}><strong>Packaging &amp; Keepsake Boxes</strong></td>
                  <td style={{ padding: '18px 20px' }}>FSC-Certified Recycled Kraft &amp; Pure Beeswax</td>
                  <td style={{ padding: '18px 20px' }}>Completely plastic-free, recyclable, and reusable as a jewelry box.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Maker Quote Box */}
        <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius)', padding: 'clamp(36px, 6vw, 64px)', textAlign: 'center' }}>
          <blockquote style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)', lineHeight: 1.4, color: 'var(--ink)', maxWidth: '820px', margin: '0 auto 24px' }}>
            “When you wear a faceted crystal or carry a hand-crocheted bag, you are not merely accessorizing — you are carrying hours of stillness, meditation, and human presence.”
          </blockquote>
          <div style={{ fontSize: '0.88rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>
            — THE KNOTS &amp; FACETS ATELIER TEAM
          </div>
          <div style={{ marginTop: '28px', display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-dark" onClick={() => setActivePage('shop')}>
              Explore The Collection
            </button>
            <button className="btn-secondary" onClick={() => setActivePage('custom')}>
              Request a Custom Piece
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
