import React, { useState, useEffect } from 'react';
import { SavedOrder } from '../types';
import { buildOrderDirectUrl } from '../utils/orderSecurity';
import QRCode from 'qrcode';
import { Copy, Check, QrCode, Share2, ShieldCheck, ExternalLink } from 'lucide-react';

interface OrderDirectLinkCardProps {
  order: SavedOrder;
  variant?: 'invoice' | 'drawer';
}

export const OrderDirectLinkCard: React.FC<OrderDirectLinkCardProps> = ({
  order,
  variant = 'drawer'
}) => {
  const [copied, setCopied] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>('');
  const [showQrExpanded, setShowQrExpanded] = useState(variant === 'invoice');

  const { fullUrl, shortUrl, key } = buildOrderDirectUrl(order);

  useEffect(() => {
    let isMounted = true;
    QRCode.toString(
      fullUrl,
      {
        type: 'svg',
        margin: 1,
        color: {
          dark: '#29231F',
          light: '#00000000'
        }
      },
      (err, svgString) => {
        if (!err && svgString && isMounted) {
          setQrSvg(svgString);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [fullUrl]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `📦 Track my Knots & Facets handcrafted order #${order.orderId}:\n${fullUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  return (
    <div className={`order-direct-card ${variant}`}>
      <div className="odc-header">
        <div className="odc-title-lockup">
          <ShieldCheck size={18} className="odc-shield-icon" />
          <div>
            <h4>Guest 1-Click Tracking &amp; Mobile Transfer</h4>
            <span className="odc-sub">
              Zero login required &bull; 256-Bit verification key: <strong>{key}</strong>
            </span>
          </div>
        </div>
        <button
          type="button"
          className="odc-qr-toggle-btn"
          onClick={() => setShowQrExpanded(prev => !prev)}
          aria-label="Toggle QR Code"
        >
          <QrCode size={15} />
          <span>{showQrExpanded ? 'Hide QR' : 'Scan on Mobile'}</span>
        </button>
      </div>

      {showQrExpanded && (
        <div className="odc-qr-pane">
          <div className="odc-qr-frame">
            {qrSvg ? (
              <div
                className="odc-qr-svg-wrap"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : (
              <div className="odc-qr-loading">Generating Scannable QR...</div>
            )}
          </div>
          <div className="odc-qr-caption">
            <strong>Point your smartphone camera to track</strong>
            <p>
              Instantly opens this parcel on your phone and saves it to your mobile device's history — no password or account needed.
            </p>
          </div>
        </div>
      )}

      {/* Action Strip: Copy Link, WhatsApp, Short Link */}
      <div className="odc-action-bar">
        <button
          type="button"
          className={`odc-action-btn copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Direct Link Copied!' : 'Copy 1-Click Tracking Link'}</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="odc-action-btn whatsapp-btn"
        >
          <Share2 size={14} />
          <span>Share via WhatsApp</span>
        </a>
      </div>

      <div className="odc-footer-note">
        <small>
          <strong>Alternative Guest Lookup:</strong> You can also look up this order anytime on any device by entering Order ID <code>#{order.orderId}</code> with your billing email <code>{order.email}</code> or phone.
        </small>
      </div>
    </div>
  );
};

