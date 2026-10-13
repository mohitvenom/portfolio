import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { scrollTo } from '../utils/lenis';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      return heroElement.getBoundingClientRect().bottom <= 80;
    }
    return window.scrollY > 500;
  });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScrollCheck = () => {
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        // Visible only once the user has scrolled past the hero section
        // (i.e. the bottom of the hero section is at or above the top of the viewport)
        setIsVisible(rect.bottom <= 80);
      } else {
        // Fallback if hero section is not found in DOM
        setIsVisible(window.scrollY > 500);
      }
    };

    // Listen to scroll and resize events
    window.addEventListener('scroll', handleScrollCheck, { passive: true });
    window.addEventListener('resize', handleScrollCheck, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollCheck);
      window.removeEventListener('resize', handleScrollCheck);
    };
  }, []);

  const handleScrollToTop = () => {
    // Lenis smooth scroll with native fallback
    scrollTo(0, { duration: 1.2 });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          className="back-to-top-container"
          initial={{ opacity: 0, scale: 0.75, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: 16 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
        >
          <m.button
            type="button"
            onClick={handleScrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Back to top of portfolio"
            title="Back to Top"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: isHovered ? '1px solid var(--accent-primary)' : '1px solid var(--border-medium)',
              color: isHovered ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isHovered 
                ? '0 10px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(245, 158, 11, 0.25)' 
                : '0 6px 20px rgba(0, 0, 0, 0.45), 0 0 10px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
              outline: 'none',
              padding: 0,
            }}
          >
            <ArrowUp size={19} strokeWidth={2.4} />
          </m.button>

          {/* Micro-label tooltip on hover */}
          <AnimatePresence>
            {isHovered && (
              <m.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  right: 'calc(100% + 10px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  pointerEvents: 'none',
                }}
              >
                Top ↑
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </AnimatePresence>
  );
};
