import { useState } from 'react';
import { content } from '../data/content';
import { m, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SkillsAndExperience = () => {
  const [prefersReduced] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getProjectUrl = (id: string) => {
    // Finds if the project exists in our list to link it
    const proj = content.projects.find(p => p.id === id);
    if (!proj) return undefined;
    return proj.type === 'Flagship' ? `#/case/${id}` : undefined;
  };

  return (
    <div style={{ paddingTop: 'var(--spacing-24)', paddingBottom: 'var(--spacing-24)' }}>
      {/* SKILLS SECTION */}
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--spacing-8)' }}>
        // SKILLS & CAPABILITIES
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-24)'
      }}>
        {content.skills.map((group, idx) => (
          <m.div 
            key={group.category}
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="panel"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-4)', color: 'var(--status-cyan)' }}>
              {group.category}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
              {group.items.map(skill => {
                const usedInIds = content.projects
                  .filter(p => p.tech.includes(skill.name))
                  .map(p => p.id);
                  
                return (
                  <div 
                    key={skill.name} 
                    style={{
                      padding: 'var(--spacing-1) var(--spacing-3)',
                      background: 'var(--bg-slate-700)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{skill.name}</span>
                    {skill.name === 'Chrome extensions' ? (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Small internal tools built at Ubuy
                      </span>
                    ) : usedInIds.length > 0 && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Used in: {usedInIds.map((id, i) => {
                          const url = getProjectUrl(id);
                          const proj = content.projects.find(p => p.id === id);
                          if (!proj) return null;
                          return (
                            <span key={id}>
                              {url ? (
                                <a href={url} style={{ color: 'inherit', textDecoration: 'underline' }}>{proj.title}</a>
                              ) : (
                                <span style={{ pointerEvents: 'none' }}>{proj.title}</span>
                              )}
                              {i < usedInIds.length - 1 ? ', ' : ''}
                            </span>
                          )
                        })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </m.div>
        ))}
      </div>

      {/* TIMELINE SECTION */}
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--spacing-8)' }}>
        // TIMELINE & ACHIEVEMENTS
      </h2>
      <div style={{ position: 'relative', paddingLeft: 'var(--spacing-8)', marginBottom: 'var(--spacing-12)' }}>
        <div style={{ position: 'absolute', left: '11px', top: '0', bottom: '0', width: '2px', background: 'var(--border-color)' }} />
        
        {content.experience.map((exp, idx) => (
          <m.div 
            key={exp.id}
            initial={prefersReduced ? false : { opacity: 0, x: -20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            style={{ position: 'relative', marginBottom: 'var(--spacing-8)' }}
          >
            <div style={{ 
              position: 'absolute', 
              left: 'calc(-1 * var(--spacing-8) - 1px)', 
              top: '8px', 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: idx === 0 ? 'var(--accent-amber)' : 'var(--bg-slate-800)',
              border: `2px solid ${idx === 0 ? 'var(--accent-amber)' : 'var(--border-color)'}`
            }} />
            
            <button 
              onClick={() => toggleNode(exp.id)}
              aria-expanded={expandedNodes[exp.id]}
              className="hardware-btn"
              style={{ width: '100%', textAlign: 'left', padding: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  {exp.role} <span style={{ color: 'var(--text-muted)' }}>@ {exp.company}</span>
                </h3>
                <span style={{ color: 'var(--status-cyan)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>{exp.period}</span>
              </div>
              {expandedNodes[exp.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            <AnimatePresence>
              {expandedNodes[exp.id] && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={prefersReduced ? { duration: 0 } : {}}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: 'var(--spacing-4) var(--spacing-4) 0', color: 'var(--text-secondary)' }}>
                    {exp.description && (
                      <p style={{ marginBottom: 'var(--spacing-2)' }}>{exp.description}</p>
                    )}
                    
                    {exp.certifications && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-2)' }}>
                        Certifications: {exp.certifications.join(' · ')}
                      </p>
                    )}
                    
                    {exp.projects?.length > 0 && (
                      <div style={{ marginTop: 'var(--spacing-4)' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--status-cyan)', marginBottom: 'var(--spacing-2)', display: 'block' }}>Related Projects</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                          {exp.projects.map(id => {
                            const url = getProjectUrl(id);
                            const proj = content.projects.find(p => p.id === id);
                            if (!proj) return null;
                            if (url) {
                              return <a key={id} href={url} className="hardware-btn" style={{ fontSize: '0.75rem', padding: 'var(--spacing-1) var(--spacing-2)' }}>{proj.title}</a>;
                            }
                            return <span key={id} className="hardware-btn" style={{ fontSize: '0.75rem', padding: 'var(--spacing-1) var(--spacing-2)', pointerEvents: 'none' }}>{proj.title}</span>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        ))}
      </div>
      
      <div className="panel" style={{ padding: 'var(--spacing-6)' }}>
        <h3 style={{ color: 'var(--status-cyan)', fontSize: '1rem', fontFamily: 'var(--font-mono)', marginBottom: 'var(--spacing-4)' }}>// ACHIEVEMENTS</h3>
        <ul style={{ color: 'var(--text-secondary)', paddingLeft: 'var(--spacing-4)' }}>
          {content.achievements.map((ach, i) => (
            <li key={i} style={{ marginBottom: 'var(--spacing-2)' }}>{ach}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
