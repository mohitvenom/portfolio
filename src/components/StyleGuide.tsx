import { ContactTerminal } from './ContactTerminal';

export const StyleGuide = () => {
  return (
    <div style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
      <header style={{ marginBottom: 'var(--space-12)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>Architectural Design System</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Production design tokens & typography hierarchy for Mohit Sharma Portfolio.</p>
      </header>

      <section id="tokens" style={{ marginBottom: 'var(--space-16)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)', color: 'var(--accent-primary)' }}>Color System (60-30-10)</h2>
        <div className="architectural-card" style={{ padding: 'var(--space-8)', display: 'grid', gap: 'var(--space-6)' }}>
          <div>
            <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>PALETTE</h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <div style={{ width: 90, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ width: 90, height: 70, background: 'var(--bg-canvas)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Canvas 60%</span>
              </div>
              <div style={{ width: 90, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ width: 90, height: 70, background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Surface 30%</span>
              </div>
              <div style={{ width: 90, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ width: 90, height: 70, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Elevated</span>
              </div>
              <div style={{ width: 90, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ width: 90, height: 70, background: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)' }}></div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Accent 10%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>Interactive Components</h2>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
          <button className="btn-primary">Primary Action</button>
          <button className="btn-secondary">Secondary Action</button>
        </div>
        <ContactTerminal />
      </section>
    </div>
  );
};
