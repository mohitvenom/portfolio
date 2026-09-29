import { useState, useRef, useEffect } from 'react';
import { content } from '../data/content';
import { m, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const categories = ['All', 'Agents', 'Automation', 'ML'];

export const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [ledStyle, setLedStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  useEffect(() => {
    const updateLed = () => {
      const activeIndex = categories.indexOf(filter);
      const activeBtn = buttonRefs.current[activeIndex];
      const container = containerRef.current;
      if (activeBtn && container) {
        setLedStyle({
          left: activeBtn.offsetLeft,
          top: activeBtn.offsetTop,
          width: activeBtn.offsetWidth,
          height: activeBtn.offsetHeight,
          opacity: 1
        });
      }
    };

    updateLed();
    
    // Watch for window resize or font load to remeasure wrapping buttons
    const observer = new ResizeObserver(updateLed);
    if (containerRef.current) observer.observe(containerRef.current);
    document.fonts.ready.then(updateLed);

    return () => observer.disconnect();
  }, [filter]);
  
  const filteredProjects = content.projects.filter(p => 
    filter === 'All' ? true : p.category === filter
  );

  const flagshipProjects = filteredProjects.filter(p => p.featured);
  const secondaryProjects = filteredProjects.filter(p => !p.featured);

  const handleOpenOverlay = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    window.history.pushState({ openedFromCard: true }, '', `#/case/${id}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return (
    <section style={{ 
      paddingTop: 'var(--spacing-24)', 
      paddingBottom: 'var(--spacing-24)',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: 'var(--spacing-12)' }}>
        <h2 id="projects-heading" tabIndex={-1} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--spacing-6)', outline: 'none' }}>
          // ARCHITECTURE & SYSTEMS
        </h2>
        
        <div ref={containerRef} style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap', position: 'relative' }}>
          <div 
            className="led-status amber"
            style={{ 
              position: 'absolute', 
              top: `${ledStyle.top + ledStyle.height / 2}px`,
              transform: 'translateY(-50%)',
              left: `${ledStyle.left + 12}px`, 
              opacity: ledStyle.opacity,
              transition: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'left 0.3s ease, top 0.3s ease',
              width: '4px',
              height: '4px',
              pointerEvents: 'none'
            }} 
          />
          {categories.map((cat, i) => (
            <button
              key={cat}
              ref={(el) => { buttonRefs.current[i] = el; }}
              className={`hardware-btn ${filter === cat ? 'primary' : ''}`}
              onClick={() => setFilter(cat)}
              style={{ position: 'relative' }}
            >
              <span style={{ paddingLeft: filter === cat ? '20px' : '0', transition: 'padding 0.3s ease' }}>
                {cat}
              </span>
            </button>
          ))}
        </div>
      </div>

      <m.div style={{ display: 'grid', gap: 'var(--spacing-8)' }}>
        {/* Flagship Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
          <AnimatePresence>
            {flagshipProjects.map(project => (
              <m.button
                id={`project-card-${project.id}`}
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="panel flagship-card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  textAlign: 'left',
                  appearance: 'none',
                  background: 'var(--bg-slate-800)',
                  width: '100%'
                }}
                onClick={(e) => handleOpenOverlay(e, project.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
                  <div>
                    <span style={{ color: 'var(--status-cyan)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                      SYS.{project.category.toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>{project.title}</h3>
                  </div>
                  <ArrowUpRight style={{ color: 'var(--text-muted)' }} size={24} />
                </div>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-6)', flexGrow: 1 }}>
                  {project.description}
                </p>

                {project.metrics && project.metrics.length > 0 && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: 'var(--spacing-4)',
                    padding: 'var(--spacing-4)',
                    background: 'var(--bg-slate-900)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 'var(--spacing-6)'
                  }}>
                    {project.metrics.map((m, i) => (
                      <div key={i}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-1)' }}>{m.label}</span>
                        <span style={{ fontSize: '1.125rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {project.tech.map(t => (
                    <span key={t} style={{ 
                      fontSize: '0.75rem', 
                      fontFamily: 'var(--font-mono)', 
                      padding: '4px 8px', 
                      background: 'var(--bg-slate-700)', 
                      borderRadius: '4px',
                      color: 'var(--text-secondary)'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </m.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Secondary Grid */}
        {secondaryProjects.length > 0 && (
          <>
            <h3 style={{ fontSize: '1.5rem', marginTop: 'var(--spacing-8)', color: 'var(--text-muted)' }}>// UTILITIES & AUTOMATIONS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              <AnimatePresence>
                {secondaryProjects.map(project => (
                  <m.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="panel"
                    style={{ padding: 'var(--spacing-4)' }}
                  >
                    <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-2)' }}>{project.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-4)' }}>
                      {project.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                      {project.tech.map(t => (
                        <span key={t} style={{ 
                          fontSize: '0.65rem', 
                          fontFamily: 'var(--font-mono)', 
                          color: 'var(--text-muted)'
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </m.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </m.div>
    </section>
  );
};
