import React, { useEffect, useState } from 'react';
import { m, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  // Track window scroll depth [0, 1]
  const { scrollYProgress } = useScroll();

  // Smooth out progress updates with refined spring physics (or instantaneous if reduced motion is requested)
  const scaleXSpring = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.0005,
  });

  const activeScaleX = isReducedMotion ? scrollYProgress : scaleXSpring;

  useEffect(() => {
    // Keep aria-valuenow updated for accessibility
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const pct = Math.min(100, Math.max(0, Math.round(latest * 100)));
      setScrollPercent(pct);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div
      role="progressbar"
      aria-label="Portfolio scroll progress"
      aria-valuenow={scrollPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 80,
        pointerEvents: 'none',
        background: 'rgba(255, 255, 255, 0.04)',
      }}
    >
      {/* Animated gradient progress fill with laser glow effect */}
      <m.div
        style={{
          width: '100%',
          height: '100%',
          scaleX: activeScaleX,
          transformOrigin: '0%',
          background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 60%, #fbbf24 92%, #fef08a 100%)',
          boxShadow: '0 0 12px rgba(245, 158, 11, 0.65), 0 0 3px rgba(251, 191, 36, 0.8)',
        }}
      />
    </div>
  );
};
