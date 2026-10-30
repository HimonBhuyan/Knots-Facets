import React, { useState, useRef, useEffect } from 'react';
import { VolumeX } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const StudioSoundscape: React.FC = () => {
  const { showToast } = useCart();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const chimeIntervalRef = useRef<number | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);

  const stopAllNodes = () => {
    if (chimeIntervalRef.current) {
      clearInterval(chimeIntervalRef.current);
      chimeIntervalRef.current = null;
    }
    activeOscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    activeOscillatorsRef.current = [];
  };

  // Initialize and toggle Web Audio ambient engine
  const toggleSoundscape = async () => {
    if (!isPlaying) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        stopAllNodes();

        // Dynamics Compressor for warm, full, clearly audible output on laptop/mobile speakers
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-18, ctx.currentTime);
        compressor.knee.setValueAtTime(12, ctx.currentTime);
        compressor.ratio.setValueAtTime(4, ctx.currentTime);
        compressor.attack.setValueAtTime(0.01, ctx.currentTime);
        compressor.release.setValueAtTime(0.25, ctx.currentTime);
        compressor.connect(ctx.destination);

        // Master Gain — clearly audible level (0.65)
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.65, ctx.currentTime + 0.6);
        masterGain.connect(compressor);
        masterGainRef.current = masterGain;

        // 1. Warm Audible Midrange Pad Chord (A3, C4, E4, G4 — Am7 / Fmaj9 warmth)
        const padFreqs = [220, 261.63, 329.63, 392.0];
        const padFilter = ctx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.frequency.setValueAtTime(950, ctx.currentTime);

        // Gentle LFO breathing on the pad filter
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
        lfoGain.gain.setValueAtTime(280, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(padFilter.frequency);
        lfo.start();
        activeOscillatorsRef.current.push(lfo);

        const padGain = ctx.createGain();
        padGain.gain.setValueAtTime(0.22, ctx.currentTime);
        padFilter.connect(padGain);
        padGain.connect(masterGain);

        padFreqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          // Slight detune for lush chorus warmth
          osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);
          noteGain.gain.setValueAtTime(0.25, ctx.currentTime);
          osc.connect(noteGain);
          noteGain.connect(padFilter);
          osc.start();
          activeOscillatorsRef.current.push(osc);
        });

        // 2. Melodic Crystal Harp & Glass Suncatcher Chimes
        // Pentatonic / Lydian crystal notes in clearly audible 500Hz–1300Hz range
        const chimePitches = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.5];

        const triggerChime = (customFreq?: number, delaySec = 0) => {
          if (!audioCtxRef.current || !masterGainRef.current) return;
          const now = audioCtxRef.current.currentTime + delaySec;

          const freq =
            customFreq || chimePitches[Math.floor(Math.random() * chimePitches.length)];

          // Fundamental bell tone + 2x crystal harmonic overtone
          const oscFund = audioCtxRef.current.createOscillator();
          const oscHarm = audioCtxRef.current.createOscillator();
          const gainFund = audioCtxRef.current.createGain();
          const gainHarm = audioCtxRef.current.createGain();
          const panner = audioCtxRef.current.createStereoPanner
            ? audioCtxRef.current.createStereoPanner()
            : null;

          oscFund.type = 'sine';
          oscFund.frequency.setValueAtTime(freq, now);

          oscHarm.type = 'triangle';
          oscHarm.frequency.setValueAtTime(freq * 2, now);

          // Crisp crystal bell envelope
          gainFund.gain.setValueAtTime(0.001, now);
          gainFund.gain.linearRampToValueAtTime(0.38, now + 0.025);
          gainFund.gain.exponentialRampToValueAtTime(0.0008, now + 2.6);

          gainHarm.gain.setValueAtTime(0.001, now);
          gainHarm.gain.linearRampToValueAtTime(0.14, now + 0.015);
          gainHarm.gain.exponentialRampToValueAtTime(0.0005, now + 1.1);

          oscFund.connect(gainFund);
          oscHarm.connect(gainHarm);

          if (panner) {
            panner.pan.setValueAtTime(Math.random() * 1.2 - 0.6, now);
            gainFund.connect(panner);
            gainHarm.connect(panner);
            panner.connect(masterGainRef.current);
          } else {
            gainFund.connect(masterGainRef.current);
            gainHarm.connect(masterGainRef.current);
          }

          oscFund.start(now);
          oscHarm.start(now);
          oscFund.stop(now + 2.7);
          oscHarm.stop(now + 1.2);
        };

        // Play an immediate welcoming 4-note crystal harp arpeggio so the user hears it right away
        triggerChime(523.25, 0.02);
        triggerChime(659.25, 0.18);
        triggerChime(783.99, 0.34);
        triggerChime(1046.5, 0.52);

        // Continue melodic crystal chimes every 1.25s
        chimeIntervalRef.current = window.setInterval(() => {
          triggerChime();
          // Occasional gentle 2-note grace harmony
          if (Math.random() > 0.55) {
            triggerChime(undefined, 0.28);
          }
        }, 1250);

        setIsPlaying(true);
        showToast('✨ Atelier Crystal & Harp Soundscape Activated', '🎵');
      } catch {
        showToast('Audio playback unavailable in this browser', '⚠️');
      }
    } else {
      // Smooth fade-out and stop
      if (audioCtxRef.current && masterGainRef.current) {
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.setValueAtTime(
          Math.max(masterGainRef.current.gain.value, 0.01),
          now
        );
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        setTimeout(() => {
          stopAllNodes();
          if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            audioCtxRef.current.suspend();
          }
          setIsPlaying(false);
        }, 460);
      } else {
        stopAllNodes();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopAllNodes();
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
