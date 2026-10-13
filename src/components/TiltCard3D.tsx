import React, { useRef, useState, useCallback, useEffect } from 'react';
import { m, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  id?: string;
  maxTilt?: number;
  scrollParallax?: boolean;
  index?: number;
  parallaxSpeed?: number;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  style = {},
  onClick,
  id,
  maxTilt = 7,
  scrollParallax = false,
  index,
  parallaxSpeed = 30
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  // Framer Motion motion values for cursor tracking relative to card center [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const hoverState = useMotionValue(0);

  // Framer Motion spring physics for smooth, organic 3D responsiveness
  const springConfig = { damping: 22, stiffness: 220, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const smoothHover = useSpring(hoverState, { damping: 20, stiffness: 200, mass: 0.5 });

  // Map mouse movement to subtle 3D rotational tilt
  // Moving cursor down tilts card along X axis
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  // Moving cursor right tilts card along Y axis
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Subtle 3D lift and scale on hover
  const scale = useTransform(smoothHover, [0, 1], [1, 1.015]);
  const translateZ = useTransform(smoothHover, [0, 1], [0, 20]);

  // Dynamic 3D specular glare sheen coordinates
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], [0, 100]);
  const glareOpacity = useTransform(smoothHover, [0, 1], [0, 0.15]);
  const glareBackground = useMotionTemplate`radial-gradient(circle 360px at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareOpacity}) 0%, transparent 80%)`;

  // Dynamic tactile shadow elevation
  const boxShadow = useTransform(
    smoothHover,
    [0, 1],
    [
      '0 8px 24px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-subtle)',
      '0 24px 48px -12px rgba(0, 0, 0, 0.72), 0 0 0 1px var(--border-medium), 0 0 24px rgba(245, 158, 11, 0.15)'
    ]
  );

  // Scroll Parallax Engine for multiplane spatial positioning
  const updateScrollParallax = useCallback(() => {
    if (!containerRef.current || reducedMotionRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;

    // Cull if far outside viewport
    if (rect.bottom < -150 || rect.top > vh + 150) return;

    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = vh / 2;
    const progress = (elementCenter - viewportCenter) / (vh * 0.5);
    const clampedProgress = Math.max(-1.4, Math.min(1.4, progress));

    // Multiplane differential velocity
    const colFactor = index !== undefined ? (index % 2 === 0 ? 1.0 : -0.75) : 0.8;
    const translateY = clampedProgress * parallaxSpeed * colFactor;

    // Subtle ambient pitch based on scroll position
    const scrollPitch = clampedProgress * 2.2;

    containerRef.current.style.transform = `translateY(${translateY.toFixed(2)}px) rotateX(${scrollPitch.toFixed(2)}deg)`;
  }, [index, parallaxSpeed]);

  useEffect(() => {
    reducedMotionRef.current = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!scrollParallax || reducedMotionRef.current) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollParallax, updateScrollParallax]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Normalized coordinates from -0.5 to +0.5 relative to center of card
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(normX);
    mouseY.set(normY);
    hoverState.set(1);
  }, [mouseX, mouseY, hoverState]);

  const handleMouseEnter = useCallback(() => {
    if (reducedMotionRef.current) return;
    setIsHovered(true);
    hoverState.set(1);
  }, [hoverState]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    hoverState.set(0);
    mouseX.set(0);
    mouseY.set(0);
  }, [hoverState, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        perspective: '1200px',
        willChange: scrollParallax ? 'transform' : 'auto',
        transformStyle: 'preserve-3d'
      }}
    >
      <m.div
        ref={cardRef}
        id={id}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`architectural-card ${className}`}
        style={{
          ...style,
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
          scale,
          z: translateZ,
          boxShadow,
          position: 'relative',
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default'
        }}
      >
        {/* Dynamic 3D Specular Sheen Glare */}
        <m.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: glareBackground,
            zIndex: 10,
            transition: isHovered ? 'none' : 'opacity 0.3s ease'
          }}
        />

        {/* Content wrapper with preserve-3d so child elements project forward along Z axis */}
        <div style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </m.div>
    </div>
  );
};

