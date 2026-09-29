import { useEffect, useState, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import { frame, cancelFrame } from 'motion';
import { LazyMotion, domAnimation } from 'motion/react';
import { setLenis } from './utils/lenis';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { SkillsAndExperience } from './components/SkillsAndExperience';
import { ContactTerminal } from './components/ContactTerminal';
import { StyleGuide } from './components/StyleGuide';

const CaseStudyOverlay = lazy(() => import('./components/CaseStudyOverlay'));
import './index.css';

function App() {
  useEffect(() => {
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const lenis = new Lenis({
      duration: isReducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    
    // Store globally via module
    setLenis(lenis);

    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }
    
    // Sync Lenis with Motion's render loop
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/')) {
        setCurrentHash(hash);
      } else {
        // If it's a section anchor, don't trigger overlay routes
        setCurrentHash('');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleCloseOverlay = () => {
    if (window.history.state?.openedFromCard) {
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#main-content" className="skip-link sr-only focusable">Skip to content</a>
      <Nav />
      <main id="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-6)' }}>
        {currentHash === '#/styleguide' ? <StyleGuide /> : (
          <>
            <Hero />
            <Projects />
            <SkillsAndExperience />
            <ContactTerminal />
          </>
        )}
      </main>

      {currentHash.startsWith('#/case/') && (
        <Suspense fallback={
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 17, 21, 0.9)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span className="led-status cyan"></span>
          </div>
        }>
          <CaseStudyOverlay 
            id={currentHash.replace('#/case/', '')} 
            onClose={handleCloseOverlay} 
          />
        </Suspense>
      )}
    </LazyMotion>
  );
}

export default App;
