import React, { useState, useRef, useEffect } from 'react';
import { VolumeX } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const StudioSoundscape: React.FC = () => {
  const { showToast } = useCart();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const chimeIntervalRef = useRef<number | null>(null);

  // Initialize and toggle Web Audio ambient engine
  const toggleSoundscape = async () => {
    if (!isPlaying) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // Master Gain (gentle step up from original 0.07 -> 0.18)
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.2);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // 1. Warm Ambient Drone (Harmonic 432Hz fundamental, same as original)
        const droneOsc1 = ctx.createOscillator();
        const droneOsc2 = ctx.createOscillator();
        const droneFilter = ctx.createBiquadFilter();

        droneOsc1.type = 'sine';
        droneOsc1.frequency.setValueAtTime(108, ctx.currentTime); // A2 sub-harmonic

        droneOsc2.type = 'triangle';
        droneOsc2.frequency.setValueAtTime(216, ctx.currentTime); // A3 harmonic

        droneFilter.type = 'lowpass';
        droneFilter.frequency.setValueAtTime(360, ctx.currentTime);

        const droneGain = ctx.createGain();
        droneGain.gain.value = 0.55;

        droneOsc1.connect(droneFilter);
        droneOsc2.connect(droneFilter);
        droneFilter.connect(droneGain);
        droneGain.connect(masterGain);

        droneOsc1.start();
        droneOsc2.start();

        // 2. Randomized Crystalline Pentatonic Chimes
        // (Original Solfeggio / celestial overtone scale, nudged from 0.04 -> 0.09)
        const chimePitches = [528, 660, 792, 880, 1056, 1188];

        const triggerChime = () => {
          if (!audioCtxRef.current || !masterGainRef.current) return;
          const now = audioCtxRef.current.currentTime;
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();
          const panner = audioCtxRef.current.createStereoPanner
            ? audioCtxRef.current.createStereoPanner()
            : null;

          const freq = chimePitches[Math.floor(Math.random() * chimePitches.length)];
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.09, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

          if (panner) {
            panner.pan.setValueAtTime(Math.random() * 1.6 - 0.8, now);
            osc.connect(panner);
            panner.connect(gain);
          } else {
            osc.connect(gain);
          }

          gain.connect(masterGainRef.current);

          osc.start(now);
          osc.stop(now + 2.5);
        };

        // Fire initial gentle chime
        triggerChime();

        // Repeat periodic chimes
        chimeIntervalRef.current = window.setInterval(() => {
          if (Math.random() > 0.25) {
            triggerChime();
          }
        }, 2200);

        setIsPlaying(true);
        showToast('✨ Atelier Morning Soundscape Activated', '🎵');
      } catch {
        showToast('Audio playback unavailable in this browser', '⚠️');
      }
    } else {
      // Fade out and suspend
      if (audioCtxRef.current && masterGainRef.current) {
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          if (chimeIntervalRef.current) clearInterval(chimeIntervalRef.current);
          if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            audioCtxRef.current.suspend();
          }
          setIsPlaying(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (chimeIntervalRef.current) clearInterval(chimeIntervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      className={`soundscape-toggle ${isPlaying ? 'playing' : ''}`}
      onClick={toggleSoundscape}
      aria-label={isPlaying ? 'Mute Studio Soundscape' : 'Enable Studio Soundscape'}
      title={isPlaying ? 'Mute calming atelier ambience' : 'Listen to ambient atelier soundscape'}
    >
      {isPlaying ? (
        <>
          <div className="soundscape-waves" aria-hidden="true">
            <span className="wave-bar bar-1" />
            <span className="wave-bar bar-2" />
            <span className="wave-bar bar-3" />
          </div>
          <span className="soundscape-label">Studio Audio</span>
        </>
      ) : (
        <>
          <VolumeX size={16} />
          <span className="soundscape-label">Soundscape</span>
        </>
      )}
    </button>
  );
};
