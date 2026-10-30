import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

interface LiveAtelierTickerProps {
  onExplore?: () => void;
}

export const LiveAtelierTicker: React.FC<LiveAtelierTickerProps> = ({ onExplore }) => {
  // Live collector count simulation that breathes naturally (17 - 24)
  const [activeCollectors, setActiveCollectors] = useState(19);
  
  // Real-time countdown to next afternoon dispatch cutoff
  const [timeLeft, setTimeLeft] = useState('2h 48m');

  // Live rotating artisan dispatches
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const liveEvents = [
    {
      type: 'artisan',
      city: 'Kyoto, Japan',
      piece: 'Celestial Prismatic Drop Earrings',
      timeAgo: '3m ago'
    },
    {
      type: 'workbench',
      city: 'Guwahati Studio Bench',
      piece: 'Hand-weaving Heritage Crochet Tote in Natural Flax',
      timeAgo: 'Just now'
    },
    {
      type: 'dispatch',
      city: 'Zurich, Switzerland',
      piece: 'Solstice Kite-Cut Crystal Pendant',
      timeAgo: '7m ago'
    },
    {
      type: 'wax-seal',
      city: 'Edinburgh, UK',
      piece: 'Botanical Hair Accessories Set (Custom Gift Box)',
      timeAgo: '12m ago'
    }
  ];

  useEffect(() => {
    // Gentle variation of active collectors
    const collectorInterval = setInterval(() => {
      setActiveCollectors(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 16 ? 17 : next > 26 ? 24 : next;
      });
    }, 7000);

    // Rotate live activity events
    const eventInterval = setInterval(() => {
      setActiveEventIndex(prev => (prev + 1) % liveEvents.length);
    }, 4500);

    // Calculate dynamic countdown
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(17, 0, 0, 0); // 5:00 PM studio courier dispatch
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }
      const diffMs = target.getTime() - now.getTime();
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hrs}h ${mins}m`);
    };
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 60000);

    return () => {
      clearInterval(collectorInterval);
      clearInterval(eventInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const currentEvent = liveEvents[activeEventIndex];

  return (
    <div className="live-atelier-banner" role="region" aria-label="Live Atelier Studio Activity">
      {/* Left Static Indicator: Live Studio Pulse */}
      <div className="live-status-pill">
        <span className="live-beacon">
          <span className="beacon-ping" />
          <span className="beacon-core" />
        </span>
        <div className="live-status-text">
          <span className="live-tag">GUWAHATI ATELIER · LIVE</span>
          <span className="live-viewer-count">
            <span className="count-num">{activeCollectors}</span> collectors in studio
          </span>
        </div>
      </div>

      {/* Center Live Event Broadcast */}
      <div className="live-broadcast-wrap">
        <div className="live-broadcast-pill" key={activeEventIndex}>
          <span className="broadcast-icon">✨</span>
          <span className="broadcast-msg">
            <strong className="broadcast-city">{currentEvent.city}:</strong>{' '}
            <span className="broadcast-piece">{currentEvent.piece}</span>
          </span>
          <span className="broadcast-time">{currentEvent.timeAgo}</span>
        </div>
      </div>

      {/* Infinite Seamless Marquee Track */}
      <div className="live-marquee-viewport">
        <div className="live-marquee-track">
          <span className="marquee-segment">
            <Sparkles size={13} className="marquee-icon" /> Handcrafted in Guwahati, Assam
          </span>
          <span className="marquee-sep">•</span>
          <span className="marquee-segment">
            <Clock size={13} className="marquee-icon" /> Guwahati Dispatch in {timeLeft}
          </span>
          <span className="marquee-sep">•</span>
          <span className="marquee-segment">
            <ShieldCheck size={13} className="marquee-icon" /> Lead-Free Bohemian Crystal
          </span>
          <span className="marquee-sep">•</span>
          <span className="marquee-segment">
            <Globe size={13} className="marquee-icon" /> Pan-India &amp; Global Shipping
          </span>
          <span className="marquee-sep">•</span>
          <span className="marquee-segment">
            <Sparkles size={13} className="marquee-icon" /> Wax-Sealed French Lavender Unboxing
          </span>
          <span className="marquee-sep">•</span>

          {/* Duplicated for seamless loop */}
          <span className="marquee-segment">
            <Sparkles size={13} className="marquee-icon" /> Handcrafted in Guwahati, Assam
          </span>
          <span className="marquee-sep">•</span>
          <span className="marquee-segment">
            <Clock size={13} className="marquee-icon" /> Guwahati Dispatch in {timeLeft}
          </span>
          <span className="marquee-sep">•</span>
          <span className="marquee-segment">
            <ShieldCheck size={13} className="marquee-icon" /> Lead-Free Bohemian Crystal
          </span>
          <span className="marquee-sep">•</span>
          <span className="marquee-segment">
            <Globe size={13} className="marquee-icon" /> Pan-India &amp; Global Shipping
          </span>
          <span className="marquee-sep">•</span>
          <span className="marquee-segment">
            <Sparkles size={13} className="marquee-icon" /> Wax-Sealed French Lavender Unboxing
          </span>
          <span className="marquee-sep">•</span>
        </div>
      </div>

      {/* Right Quick Jump Action */}
      {onExplore && (
        <button className="live-explore-btn" onClick={onExplore}>
          <span>View Catalog</span>
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
};
