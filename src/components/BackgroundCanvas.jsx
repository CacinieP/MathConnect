import { useEffect, useRef } from 'react';

const MOBILE_BREAKPOINT = 640;
const PARTICLE_COUNT_DESKTOP = 55;
const PARTICLE_COUNT_MOBILE = 22;
const CONNECTION_DISTANCE = 120;

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function getParticleCount(reducedParticles) {
  if (reducedParticles) return isMobile() ? 8 : 18;
  return isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
}

export default function BackgroundCanvas({ themeColor = '#38bdf8', reducedParticles = false }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = prefersReducedMotion.matches;

    const handleMotionChange = (e) => {
      reducedMotionRef.current = e.matches;
    };
    prefersReducedMotion.addEventListener('change', handleMotionChange);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      const count = getParticleCount(reducedParticles);
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.25 + 0.08,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (reducedMotionRef.current) {
        // Static faint dots when reduced motion is preferred
        particlesRef.current.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.4})`;
          ctx.fill();
        });
        return;
      }

      const particles = particlesRef.current;
      const isMobileView = isMobile();

      // Update positions
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      // Draw connections first (behind particles)
      if (!isMobileView) {
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECTION_DISTANCE) {
              const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.12;
              ctx.globalAlpha = alpha;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      prefersReducedMotion.removeEventListener('change', handleMotionChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [themeColor, reducedParticles]);

  return <canvas ref={canvasRef} className="background-canvas" aria-hidden="true" />;
}
