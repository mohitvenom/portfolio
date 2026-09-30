import { useState } from 'react';
import { content } from '../data/content';
import { m } from 'motion/react';

export const SkillsAndExperience = () => {
  const [prefersReduced] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false);

  const getProjectUrl = (id: string) => {
    // Finds if the project exists in our list to link it
    const proj = content.projects.find(p => p.id === id);
    if (!proj) return undefined;
    return proj.type === 'Flagship' ? `#/case/${id}` : undefined;
  };

  return (
    <section style={{ paddingTop: 'var(--spacing-16)', paddingBottom: 'var(--spacing-16)' }}>
      {/* SKILLS SECTION */}
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--spacing-8)' }}>
        // SKILLS & CAPABILITIES
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-16)'
      }}>
        {content.skills.map((group, idx) => (
          <m.div 
            key={group.category}
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="panel"
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              padding: 'var(--spacing-6)',
              background: 'var(--bg-slate-900)'
            }}
          >
            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: 'var(--spacing-6)', 
              color: 'var(--status-cyan)',
              fontFamily: 'var(--font-mono)' 
            }}>
              // {group.category.toUpperCase()}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
              {group.items.map(skill => (
                <div 
                  key={skill.name} 
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    background: 'var(--bg-slate-800)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 'var(--spacing-2)'
                  }}
                >
                  <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {skill.name}
                  </span>
                  {(skill as any).usedIn && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      used in: {(skill as any).usedIn}
                    </span>
                  )}
                </div>
              ))}
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
        
        {content.experience.map((group, idx) => (
          <m.div 
            key={group.id}
            initial={prefersReduced ? false : { opacity: 0, x: -20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            style={{ position: 'relative', marginBottom: 'var(--spacing-12)' }}
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
            
            <h3 style={{ 
              fontSize: '1.5rem', 
              color: 'var(--text-primary)', 
              marginBottom: 'var(--spacing-6)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {group.company}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
              {group.roles.map((role) => (
                <div key={role.id}>
                  <div style={{ marginBottom: 'var(--spacing-2)' }}>
                    <h4 style={{ fontSize: '1.25rem', color: 'var(--status-cyan)', marginBottom: 'var(--spacing-1)' }}>
                      {role.title}
                    </h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                      {role.period}
                    </span>
                  </div>
                  
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {role.description && (
                      <p style={{ marginBottom: 'var(--spacing-2)', whiteSpace: 'pre-line' }}>{role.description}</p>
                    )}
                    
                    {(role as any).certifications && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-2)' }}>
                        Certifications: {(role as any).certifications.join(' · ')}
                      </p>
                    )}
                    
                    {(role as any).projects && (role as any).projects.length > 0 && (
                      <div style={{ marginTop: 'var(--spacing-4)', background: 'var(--bg-slate-900)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-3)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                          Selected systems built at Ubuy
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                          {(role as any).projects.map((id: string) => {
                            const url = getProjectUrl(id);
                            const proj = content.projects.find(p => p.id === id);
                            if (!proj) return null;
                            if (url) {
                              return <a key={id} href={url} className="hardware-btn primary" style={{ fontSize: '0.875rem', padding: 'var(--spacing-1) var(--spacing-3)', background: 'var(--bg-slate-800)' }}>{proj.title}</a>;
                            }
                            return <span key={id} className="hardware-btn" style={{ fontSize: '0.875rem', padding: 'var(--spacing-1) var(--spacing-3)', background: 'var(--bg-slate-800)', pointerEvents: 'none' }}>{proj.title}</span>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
    </section>
  );
};
