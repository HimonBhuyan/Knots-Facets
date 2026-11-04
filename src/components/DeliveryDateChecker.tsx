import React, { useState, useEffect } from 'react';
import {
  calculateDeliveryEstimate,
  DeliveryEstimate,
  getSavedPostalCode,
  savePostalCode
} from '../utils/deliveryEstimator';
import { Truck, MapPin, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface DeliveryDateCheckerProps {
  category?: string;
  shippingTier?: 'standard' | 'express';
  variant?: 'card' | 'compact' | 'checkout';
  onEstimateChange?: (estimate: DeliveryEstimate | null) => void;
  initialPin?: string;
}

export const DeliveryDateChecker: React.FC<DeliveryDateCheckerProps> = ({
  category = 'jewellery',
  shippingTier = 'standard',
  variant = 'card',
  onEstimateChange,
  initialPin
}) => {
  const [pinInput, setPinInput] = useState(() => initialPin || getSavedPostalCode() || '');
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(() => {
    const pin = initialPin || getSavedPostalCode();
    return pin ? calculateDeliveryEstimate(pin, category, shippingTier) : null;
  });
  const [isChecked, setIsChecked] = useState(() => Boolean(initialPin || getSavedPostalCode()));

  // Keep in sync if initialPin or shippingTier changes
  useEffect(() => {
    if (initialPin && initialPin !== pinInput) {
      setPinInput(initialPin);
      const est = calculateDeliveryEstimate(initialPin, category, shippingTier);
      setEstimate(est);
      setIsChecked(Boolean(est));
      onEstimateChange?.(est);
    }
  }, [initialPin]);

  useEffect(() => {
    if (pinInput.trim().length >= 3) {
      const est = calculateDeliveryEstimate(pinInput, category, shippingTier);
      setEstimate(est);
      onEstimateChange?.(est);
    }
  }, [shippingTier, category]);

  const handleCheck = (overridePin?: string) => {
    const target = (overridePin ?? pinInput).trim();
    if (!target) return;
    const est = calculateDeliveryEstimate(target, category, shippingTier);
    setEstimate(est);
    setIsChecked(true);
    if (est) {
      savePostalCode(target);
      onEstimateChange?.(est);
    }
  };

  const applySamplePin = (sample: string) => {
    setPinInput(sample);
    handleCheck(sample);
  };

  return (
    <div className={`delivery-checker-wrap ${variant}`}>
      <div className="dc-header">
        <div className="dc-title-group">
          <Truck size={16} className="dc-icon" />
          <strong>Check Estimated Delivery Date</strong>
        </div>
        {estimate && (
          <span className="dc-zone-pill">
            <MapPin size={11} /> {estimate.locationLabel}
          </span>
        )}
      </div>

      <div className="dc-form-row">
        <div className="dc-input-frame">
          <MapPin size={14} className="dc-field-pin" />
          <input
            type="text"
            placeholder="Enter Postal / PIN Code (e.g. 781001 or 10001)..."
            value={pinInput}
            onChange={e => {
              setPinInput(e.target.value);
              if (e.target.value.trim().length >= 4) {
                const est = calculateDeliveryEstimate(e.target.value, category, shippingTier);
                setEstimate(est);
                if (est) {
                  savePostalCode(e.target.value);
                  onEstimateChange?.(est);
                }
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCheck();
              }
            }}
            maxLength={10}
          />
        </div>
        <button
          type="button"
          className="dc-check-btn"
          onClick={() => handleCheck()}
          disabled={!pinInput.trim()}
        >
          <span>Calculate</span>
        </button>
      </div>

      {/* Quick Sample Selector */}
      {!estimate && (
        <div className="dc-samples-row">
          <span>Try popular hubs:</span>
          <button type="button" onClick={() => applySamplePin('781001')}>
            Guwahati (781001)
          </button>
          <button type="button" onClick={() => applySamplePin('110001')}>
            Delhi (110001)
          </button>
          <button type="button" onClick={() => applySamplePin('400001')}>
            Mumbai (400001)
          </button>
          <button type="button" onClick={() => applySamplePin('10001')}>
            New York (10001)
          </button>
        </div>
      )}

      {/* Output Delivery Banner */}
      {estimate && (
        <div className="dc-result-card">
          <div className="dc-delivery-primary">
            <Sparkles size={16} color="#C29B38" />
            <div className="dc-delivery-lead">
              <span>Estimated Delivery Window</span>
              <strong>{estimate.estimatedDeliveryRange}</strong>
            </div>
            <span className="dc-verified-badge">
              <CheckCircle2 size={12} /> Live Route Verified
            </span>
          </div>

          <div className="dc-breakdown-row">
            <div className="dc-step-chip">
              <Clock size={12} />
              <span>{estimate.craftingText}</span>
            </div>
            <div className="dc-step-divider">&bull;</div>
            <div className="dc-step-chip">
              <Truck size={12} />
              <span>{estimate.transitText}</span>
            </div>
            <div className="dc-step-divider">&bull;</div>
            <div className="dc-courier-chip">
              <span>via {estimate.courierPartner}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

