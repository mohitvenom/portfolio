import { ChevronDown } from 'lucide-react';
import { ContactTerminal } from './ContactTerminal';

export const StyleGuide = () => {
  return (
    <div style={{ paddingTop: 'var(--spacing-12)' }}>
      <header style={{ marginBottom: 'var(--spacing-12)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-2)' }}>Style Guide (Phase 2)</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Hardware Synth / Neural Node Studio UI Components.</p>
      </header>

      <section id="tokens" style={{ marginBottom: 'var(--spacing-16)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-6)', color: 'var(--accent-amber)' }}>// TOKENS</h2>
        <div className="panel" style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
          
          <div>
            <h3 style={{ marginBottom: 'var(--spacing-4)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>COLORS</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              <div style={{ width: 80, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div style={{ width: 80, height: 80, background: 'var(--bg-slate-900)', border: 'var(--panel-border)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Slate 900</span>
              </div>
              <div style={{ width: 80, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div style={{ width: 80, height: 80, background: 'var(--bg-slate-800)', border: 'var(--panel-border)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Slate 800</span>
              </div>
              <div style={{ width: 80, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div style={{ width: 80, height: 80, background: 'var(--bg-slate-700)', border: 'var(--panel-border)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Slate 700</span>
              </div>
              <div style={{ width: 80, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div style={{ width: 80, height: 80, background: 'var(--accent-amber)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Amber</span>
              </div>
              <div style={{ width: 80, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div style={{ width: 80, height: 80, background: 'var(--status-cyan)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Cyan</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-4)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>TYPE SCALE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <h1 style={{ fontSize: '3rem' }}>Heading 1</h1>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mono / 3rem / 700</span>
              </div>
              <div>
                <h2 style={{ fontSize: '2.25rem' }}>Heading 2</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mono / 2.25rem / 700</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem' }}>Heading 3</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mono / 1.5rem / 700</span>
              </div>
              <div>
                <p style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Body text goes here. The quick brown fox jumps over the lazy dog. Used for descriptive text, ensuring high legibility for technical deep dives.</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sans / 1rem / 400</span>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Small body text. The quick brown fox jumps over the lazy dog.</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sans / 0.875rem / 400</span>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <section id="components" style={{ marginBottom: 'var(--spacing-16)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-6)', color: 'var(--accent-amber)' }}>// COMPONENTS</h2>
        
        <div className="panel" style={{ marginBottom: 'var(--spacing-6)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-4)', fontSize: '1rem' }}>Hardware Panel Component</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            This is the default panel. It features a slate-800 background, 
            a subtle transparent white border, and layered drop shadows to mimic an inset hardware enclosure.
          </p>
        </div>
        
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--spacing-6)', fontSize: '1rem' }}>Hardware Buttons</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            
            <div>
              <p style={{ marginBottom: 'var(--spacing-4)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Default Button States</p>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                <button className="hardware-btn">
                  <span className="led-status cyan"></span>
                  Default
                </button>
                <button className="hardware-btn" style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
                  <span className="led-status cyan"></span>
                  Hovered
                </button>
                <button className="hardware-btn" style={{ boxShadow: 'var(--panel-shadow-pressed)', transform: 'translateY(2px)' }}>
                  <span className="led-status cyan"></span>
                  Pressed
                </button>
                <button className="hardware-btn" disabled>
                  <span className="led-status cyan"></span>
                  Disabled
                </button>
              </div>
            </div>

            <div>
              <p style={{ marginBottom: 'var(--spacing-4)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Primary Button States</p>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                <button className="hardware-btn primary">
                  <span className="led-status amber"></span>
                  Primary
                </button>
                <button className="hardware-btn primary" style={{ background: 'rgba(255, 176, 0, 0.15)', boxShadow: '0 0 10px var(--accent-amber-glow)' }}>
                  <span className="led-status amber"></span>
                  Hovered
                </button>
                <button className="hardware-btn primary" style={{ boxShadow: 'var(--panel-shadow-pressed)', transform: 'translateY(2px)' }}>
                  <span className="led-status amber"></span>
                  Pressed
                </button>
                <button className="hardware-btn primary" disabled>
                  <span className="led-status amber"></span>
                  Disabled
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW COMPONENTS */}
      <section style={{ marginBottom: 'var(--spacing-12)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-6)' }}>// 04_COMPONENTS</h2>
        <div className="panel" style={{ padding: 'var(--spacing-8)' }}>
          <div style={{ display: 'grid', gap: 'var(--spacing-8)' }}>
            
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-4)', color: 'var(--text-muted)' }}>Skill Chip</h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                <div style={{
                    padding: 'var(--spacing-1) var(--spacing-3)',
                    background: 'var(--bg-slate-700)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    width: 'max-content'
                  }}>
                  <span style={{ fontWeight: '500' }}>Python</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    Used in: <span style={{ textDecoration: 'underline' }}>Project A</span>, Project B
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-4)', color: 'var(--text-muted)' }}>Timeline Node (Disclosure)</h3>
              <div style={{ maxWidth: '400px' }}>
                <button className="hardware-btn" style={{ width: '100%', textAlign: 'left', padding: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>
                      Role <span style={{ color: 'var(--text-muted)' }}>@ Company</span>
                    </h3>
                    <span style={{ color: 'var(--status-cyan)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>Jan 2026 to present</span>
                  </div>
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section style={{ marginBottom: 'var(--spacing-12)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-6)' }}>// 05_CONTACT_TERMINAL</h2>
        <ContactTerminal />
      </section>
    </div>
  );
};
