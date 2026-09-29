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
      paddingTop: 'var(--spacing-16)', 
      paddingBottom: 'var(--spacing-16)',
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
                    <span style={{ color: 'var(--status-cyan)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                      SYS.{project.category.toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>{project.title}</h3>
                  </div>
                  <ArrowUpRight style={{ color: 'var(--text-muted)' }} size={24} />
                </div>
                
                <p style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-6)', fontWeight: 500, lineHeight: 1.4 }}>
                  {project.description}
                </p>

                {project.caseStudy && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', flexGrow: 1 }}>
                    
                    <div>
                      <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-2)' }}>// PROBLEM</span>
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '1rem', 
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {project.caseStudy.problem}
                      </p>
                    </div>

                    <div>
                      <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-2)' }}>// SYSTEM</span>
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '1rem', 
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {project.caseStudy.architecture}
                      </p>
                    </div>

                    {project.caseStudy.outcome && (
                      <div>
                        <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-2)' }}>// IMPACT</span>
                        <div style={{ 
                          color: 'var(--text-secondary)', 
                          fontSize: '1rem', 
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {Array.isArray(project.caseStudy.outcome) ? (
                            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                              <li>{project.caseStudy.outcome[0]}</li>
                            </ul>
                          ) : (
                            <p>{project.caseStudy.outcome}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-3)' }}>// TECH</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                    {project.tech.slice(0, 5).map(t => (
                      <span key={t} style={{ 
                        fontSize: '0.875rem', 
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
                </div>

                <div style={{ 
                  marginTop: 'auto', 
                  paddingTop: 'var(--spacing-4)', 
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--status-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  <span>VIEW CASE STUDY</span>
                  <span style={{ opacity: 0.8 }}>→</span>
                </div>
              </m.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Secondary Grid */}
        {secondaryProjects.length > 0 && (
          <>
            <h3 style={{ fontSize: '1.25rem', marginTop: 'var(--spacing-8)', color: 'var(--text-muted)' }}>// ADDITIONAL SYSTEMS & AUTOMATION</h3>
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
                    style={{ 
                      padding: 'var(--spacing-5)', 
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'var(--bg-slate-900)',
                      border: '1px solid var(--border-color)',
                      height: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
                      <h4 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--text-primary)' }}>
                        {project.title.replace(' [In Progress]', '').replace(' [Academic Project]', '')}
                      </h4>
                      {project.title.includes('[In Progress]') && (
                        <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--status-cyan)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                          IN PROGRESS
                        </span>
                      )}
                      {project.title.includes('[Academic Project]') && (
                        <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(255, 176, 0, 0.1)', color: 'var(--accent-amber)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                          ACADEMIC
                        </span>
                      )}
                    </div>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 'var(--spacing-4)', lineHeight: 1.6, flexGrow: 1 }}>
                      {project.description}
                    </p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginTop: 'auto' }}>
                      {project.tech.map(t => (
                        <span key={t} style={{ 
                          fontSize: '0.875rem', 
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
