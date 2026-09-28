import { useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { content } from '../data/content';
import { scrollTo } from '../utils/lenis';
import { Download, ChevronDown } from 'lucide-react';

// Decrypt Text Animation Component
const DecryptText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayText(text);
      return;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    let iteration = 0;
    let interval: number;

    interval = window.setInterval(() => {
      setDisplayText(text.split('').map((_, index) => {
        if (index < iteration) {
          return text[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {/* Real text for screen readers */}
      <span className="sr-only" style={{ 
        position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', 
        overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 
      }}>
        {text}
      </span>
      {/* Animated text for sighted users */}
      <span aria-hidden="true" style={{ whiteSpace: 'pre-wrap' }}>{displayText || text}</span>
    </span>
  );
};

// Neural Network Canvas Background
const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [fps, setFps] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const showFps = import.meta.env.DEV && new URLSearchParams(window.location.search).get('fps') === '1';
    let frameCount = 0;
    let lastTime = performance.now();

    // Respect reduced motion - do not render animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Reduce nodes on mobile
    const isMobile = width < 768;
    const numNodes = isMobile ? 30 : 70;
    
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    const nodes: Node[] = Array.from({ length: numNodes }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    let mouseX = -1000;
    let mouseY = -1000;
    let isVisible = document.visibilityState === 'visible';
    let isIntersecting = true;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        draw(true); // Redraw static frame on resize
      }
    };

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && isIntersecting && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (!animationId) animationId = requestAnimationFrame(() => draw());
      }
    };

    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
      if (isIntersecting && isVisible && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (!animationId) animationId = requestAnimationFrame(() => draw());
      }
    });
    observer.observe(canvas);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    // Use a spatial grid to optimize collision/edges if node count is high,
    // but 70 nodes is 4900 checks max, well under the ~30k budget for 60fps on low-end.
    
    const draw = (staticFrame = false) => {
      if ((!isVisible || !isIntersecting) && !staticFrame) {
        animationId = 0;
        return; // Pause loop
      }

      ctx.clearRect(0, 0, width, height);
      
      const connectDistance = 150;
      const mouseInfluence = 200;

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        const dxMouse = mouseX - node.x;
        const dyMouse = mouseY - node.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (!staticFrame) {
          // Cursor attraction
          if (distMouse < mouseInfluence) {
            const force = (mouseInfluence - distMouse) / mouseInfluence;
            node.vx += (dxMouse / distMouse) * force * 0.05;
            node.vy += (dyMouse / distMouse) * force * 0.05;
          }

          // Friction and limit speed
          node.vx *= 0.98;
          node.vy *= 0.98;
          
          // Base drift
          node.vx += (Math.random() - 0.5) * 0.02;
          node.vy += (Math.random() - 0.5) * 0.02;

          node.x += node.vx;
          node.y += node.vy;

          // Bounce
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        
        // Brighten if near mouse
        if (!staticFrame && distMouse < mouseInfluence) {
          ctx.fillStyle = 'rgba(255, 176, 0, 0.8)';
        } else {
          ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        }
        
        ctx.fill();

        // Connect edges
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            
            const opacity = 1 - (dist / connectDistance);
            
            // Highlight edge if both nodes are near cursor
            if (!staticFrame) {
              const otherDistMouse = Math.sqrt(Math.pow(mouseX - other.x, 2) + Math.pow(mouseY - other.y, 2));
              if (distMouse < mouseInfluence && otherDistMouse < mouseInfluence) {
                ctx.strokeStyle = `rgba(255, 176, 0, ${opacity * 0.5})`;
              } else {
                ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.15})`;
              }
            } else {
              ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.15})`;
            }
            
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (showFps && !staticFrame) {
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastTime)));
          frameCount = 0;
          lastTime = now;
        }
      }

      if (!staticFrame) {
        animationId = requestAnimationFrame(() => draw());
      } else {
        animationId = 0;
      }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(true); // Draw static frame once
    } else {
      draw(); // Start loop
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6
      }}
      />
      {import.meta.env.DEV && new URLSearchParams(window.location.search).get('fps') === '1' && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', padding: '5px', color: '#0f0', fontFamily: 'monospace', zIndex: 100 }}>
          FPS: {fps}
        </div>
      )}
    </>
  );
};

export const Hero = () => {
  const skills = [
    'Python', 'LLMs', 'LangGraph', 'MCP', 'FastAPI', 'NLP', 'PostgreSQL', 'Playwright'
  ];

  return (
    <section id="hero" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      paddingTop: 'var(--spacing-12)',
      paddingBottom: 'var(--spacing-16)'
    }}>
      <NeuralCanvas />
      
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Status Panel */}
          <div className="panel" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-3)',
            padding: 'var(--spacing-2) var(--spacing-4)',
            marginBottom: 'var(--spacing-8)',
            border: '1px solid var(--status-cyan)',
            background: 'rgba(0, 229, 255, 0.05)',
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.1)'
          }}>
            <span className="led-status cyan" style={{ boxShadow: '0 0 8px var(--status-cyan)' }}></span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--status-cyan)' }}>
              {content.personal.status.text}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 4rem)', 
            lineHeight: 1.1, 
            marginBottom: 'var(--spacing-6)',
            maxWidth: '900px',
            color: 'var(--text-primary)'
          }}>
            <DecryptText text={content.personal.tagline} />
          </h1>

          {/* Subtitle with blinking cursor */}
          <div style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: 'var(--accent-amber)',
            marginBottom: 'var(--spacing-12)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span>&gt; {content.personal.name}, {content.personal.role}</span>
            <m.span 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              style={{ 
                display: 'inline-block', 
                width: '10px', 
                height: '1.2em', 
                background: 'var(--accent-amber)',
                marginLeft: '8px',
                verticalAlign: 'middle'
              }}
            />
          </div>

          {/* Skill Badges */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 'var(--spacing-3)', 
            marginBottom: 'var(--spacing-12)',
            maxWidth: '800px'
          }}>
            {skills.map((skill, i) => (
              <m.div 
                key={skill}
                className="hardware-btn"
                style={{ cursor: 'default' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                {skill}
              </m.div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
            <a href={content.personal.resumeUrl} download className="hardware-btn primary" style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontSize: '1rem' }}>
              <Download size={18} />
              DOWNLOAD RESUME
            </a>
            <a href="#projects" className="hardware-btn" style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontSize: '1rem' }} onClick={(e) => {
              e.preventDefault();
              scrollTo('#projects', { offset: -73 });
            }}>
              VIEW PROJECTS
              <ChevronDown size={18} />
            </a>
          </div>
        </m.div>
      </div>
    </section>
  );
};
