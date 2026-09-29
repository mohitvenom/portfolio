# Mohit Sharma - Portfolio

Hardware Synth / Neural Node Studio design system.

## Architecture Decisions
- **Framework**: React + Vite + TypeScript. Chosen for fast startup, fast HMR, excellent static export support, and a lightweight footprint.
- **Routing**: For the Flagship case studies, the site uses overlays or hash-based routing instead of client-side paths. This ensures the site remains 100% static and SEO friendly on basic hosts (like GitHub Pages or Vercel static) without requiring a server to fallback `/*` routes to `index.html`.

## Scripts
- `npm run dev`: Start the development server
- `npm run build`: Build the production bundle (fails if resume PDF is a placeholder)
- `npm run audit:placeholders -- --strict`: Check the codebase for missing content blocks (fails build if found in strict mode)

## Deploy-Readiness
Before deploying, always run `npm run preflight`. This script runs type checking, linting, a strict placeholder audit, verifies the resume PDF, and builds the bundle. If it passes, the app is ready for production.

### Deployment Providers
Because this SPA uses strict hash-based routing (`#/case/id`), **it does not require any URL rewrite rules** (e.g. `rewrites` or `_redirects`) for deep linking. It works purely as static files.

**Vercel / Netlify**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Note: No configuration required.

**GitHub Pages**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Note: You must update `vite.config.ts` to set the `base` property to `'/portfolio/'` (or your repo name) if you are not deploying to a custom domain root.

### Environment Variables
- `SITE_URL`: Set this in your deployment environment (e.g., `https://mohitsharma.ai`) to correctly generate the `sitemap.xml`, `robots.txt`, and canonical tags during the build step.
