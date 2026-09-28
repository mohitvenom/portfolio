# Mohit Sharma - Portfolio

Hardware Synth / Neural Node Studio design system.

## Architecture Decisions
- **Framework**: React + Vite + TypeScript. Chosen for fast startup, fast HMR, excellent static export support, and a lightweight footprint.
- **Routing**: For the Flagship case studies, the site uses overlays or hash-based routing instead of client-side paths. This ensures the site remains 100% static and SEO friendly on basic hosts (like GitHub Pages or Vercel static) without requiring a server to fallback `/*` routes to `index.html`.
## Scripts
- \
pm run dev\: Start the development server
- \
pm run build\: Build the production bundle (fails if resume PDF is a placeholder)
- \
pm run audit:placeholders -- --strict\: Check the codebase for missing content blocks (fails build if found in strict mode)
