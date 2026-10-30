import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Mail, MessageCircle, MapPin, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useCart();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    topic: 'bespoke',
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      q: 'How long does it take to make and ship an order?',
      a: 'Because every piece is handcrafted in our studio, ready-to-ship catalog pieces depart within 2–3 business days. Bespoke custom commissions and bridal suites typically require 7–12 business days to select stones, knot the fibers, and wire-wrap. If you have an urgent event, please let us know!'
    },
    {
      q: 'What packaging do you use for gifts?',
      a: 'Every single Knots & Facets order arrives ready for gifting. We use FSC-certified recyclable rigid kraft keepsake boxes, organic cotton tissue paper, a dried lavender botanical sprig, and an authentic hand-pressed wax seal with our diamond motif. Plastic is never used.'
    },
    {
      q: 'Can I customize necklace lengths or crochet strap sizes?',
      a: 'Yes, absolutely! Since all jewelry chains and crochet handles are measured and assembled by hand in our studio, we can customize chain lengths from 14 inches to 24 inches or modify bag strap drop heights at no additional cost. Just note your preference in your order comments or via our Custom Orders page.'
    },
    {
      q: 'Are the earring wires suitable for sensitive ears?',
      a: 'Yes. We strictly use 14k gold-filled wire and 925 sterling silver for all earring hooks and posts. Gold-filled contains a substantial layer of real 14k gold mechanically bonded to a brass core, making it nickel-free, hypoallergenic, and resistant to tarnishing or flaking.'
    },
    {
      q: 'Do you offer international shipping?',
      a: 'We ship worldwide with fully tracked postal services. Delivery typically takes 4–7 business days to North America and Europe, and 6–10 business days to Asia and Australasia. Complimentary tracked shipping is automatically unlocked on all orders over $80 USD.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✨ Thank you ${form.name}! Your inquiry has been received. Our studio team will reply within 24 hours.`, '💌');
    setForm({ topic: 'bespoke', name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="page-banner">
        <span className="eyebrow">Direct Atelier Communication</span>
        <h1 className="page-title">Ask About a Piece</h1>
        <p className="page-subtitle">
          We welcome all inquiries — whether you have questions about a specific stone, want to discuss bridal bespoke sets, or wish to say hello to our workshop.
        </p>
      </section>

      <div className="section-block">
        <div className="contact-layout">
          {/* Left info */}
          <div className="contact-info-card">
            <h2>Guwahati Atelier &amp; Studio</h2>
            <p>
              Every piece is created and shipped directly from our independent studio workshop in Guwahati, Assam. We respond to all correspondence personally within 24 business hours.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="detail-icon">
                  <Mail size={18} />
                </div>
                <div className="detail-text">
                  <strong>Studio Email</strong>
                  <a href="mailto:hello@knotsandfacets.com">hello@knotsandfacets.com</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon">
                  <MessageCircle size={18} />
                </div>
                <div className="detail-text">
                  <strong>Studio Hotline &amp; WhatsApp</strong>
                  <span>+91 98640 12345 / +91 (0361) 273-8901</span>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon">
                  <MapPin size={18} />
                </div>
                <div className="detail-text">
                  <strong>Studio Address</strong>
                  <span>Knots &amp; Facets Atelier, Uzan Bazar, Riverfront Quarter, Guwahati, Assam — 781001</span>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon">
                  <Clock size={18} />
                </div>
                <div className="detail-text">
                  <strong>Bench Hours</strong>
                  <span>Tuesday – Saturday: 10:00 AM – 5:30 PM</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--surface-alt)', padding: '18px 22px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
              <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                🕊️ Slow Studio Guarantee
              </strong>
              Orders are carefully hand-assembled and wrapped with botanical sprigs and certified wax stamps before departure.
            </div>
          </div>

          {/* Right form */}
          <div className="contact-form-card">
            <h2>Send a Note to Our Bench</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contactTopic">Inquiry Type</label>
                <select
                  id="contactTopic"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  required
                >
                  <option value="bespoke">Custom Commission / Bespoke Request</option>
                  <option value="bridal">Bridal Party &amp; Wedding Sets</option>
                  <option value="order">Existing Order Status or Sizing</option>
                  <option value="wholesale">Stockist &amp; Boutique Wholesale</option>
                  <option value="general">General Studio Question</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label htmlFor="contactName">Your Name</label>
                  <input
                    type="text"
                    id="contactName"
                    required
                    placeholder="Elena Rostova"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactEmail">Your Email</label>
                  <input
                    type="email"
                    id="contactEmail"
                    required
                    placeholder="elena@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactSubject">Subject</label>
                <input
                  type="text"
                  id="contactSubject"
                  required
                  placeholder="Custom colorway inquiry for Solstice pendant..."
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactMessage">Your Message</label>
                <textarea
                  id="contactMessage"
                  rows={5}
                  required
                  placeholder="Tell us about the piece you have in mind, your timeline, or any questions you may have..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-dark" style={{ width: '100%', padding: '14px', fontSize: '0.92rem' }}>
                Send Note to Atelier
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Accordion */}
        <section id="faq" style={{ marginTop: '60px' }}>
          <div className="section-header center">
            <span className="eyebrow">Common Questions</span>
            <h2 className="title">Studio FAQ</h2>
            <p className="subtext">
              Everything you need to know about our handmade process, shipping timelines, and custom orders.
            </p>
          </div>

          <div className="faq-container" style={{ marginBottom: '60px' }}>
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'active' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                  >
                    {faq.q}
                  </button>
                  <div className="faq-answer">{faq.a}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
