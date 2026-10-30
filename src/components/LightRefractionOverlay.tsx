import React, { useEffect, useRef, useState } from 'react';

export const LightRefractionOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEnabled] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEnabled) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });

    let mouse = { x: width * 0.7, y: height * 0.35 };
    let current = { x: mouse.x, y: mouse.y };
    let animId: number;
    let angle = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth lag interpolation
      current.x += (mouse.x - current.x) * 0.06;
      current.y += (mouse.y - current.y) * 0.06;
      angle += 0.008;

      // 1. Primary Soft Prismatic Caustic Halo
      const radius = 240;
      const grad = ctx.createRadialGradient(
        current.x,
        current.y,
        0,
        current.x,
        current.y,
        radius
      );

      grad.addColorStop(0, 'rgba(255, 250, 240, 0.16)');
      grad.addColorStop(0.35, 'rgba(235, 215, 185, 0.08)');
      grad.addColorStop(0.65, 'rgba(194, 155, 56, 0.05)');
      grad.addColorStop(1, 'rgba(248, 245, 240, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(current.x, current.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Secondary Chromatic Spectral Flares (Faceted refraction streaks)
      const flares = [
        { angleOffset: 0.4, dist: 90, color: 'rgba(215, 170, 140, 0.12)', r: 45 },
        { angleOffset: 1.8, dist: 140, color: 'rgba(194, 155, 56, 0.09)', r: 35 },
        { angleOffset: 3.2, dist: 190, color: 'rgba(165, 195, 215, 0.08)', r: 50 },
        { angleOffset: 4.6, dist: 110, color: 'rgba(225, 190, 220, 0.09)', r: 40 },
      ];

      flares.forEach(f => {
        const theta = angle + f.angleOffset;
        const fx = current.x + Math.cos(theta) * f.dist;
        const fy = current.y + Math.sin(theta) * f.dist;

        const fGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, f.r);
        fGrad.addColorStop(0, f.color);
        fGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, f.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="light-refraction-caustics"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 25,
        mixBlendMode: 'screen',
        opacity: 0.85
      }}
    />
  );
};
