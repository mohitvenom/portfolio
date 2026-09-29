import fs from 'fs';
import path from 'path';

const siteUrl = process.env.SITE_URL || 'https://mohitvenom.github.io/portfolio'; // fallback
const normalizedSiteUrl = siteUrl.replace(/\/+$/, ''); // Strip all trailing slashes safely
const publicDir = path.resolve(process.cwd(), 'public');

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${normalizedSiteUrl}/sitemap.xml`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
console.log('✅ Generated robots.txt');

// Generate sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${normalizedSiteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
console.log('✅ Generated sitemap.xml');

// Update index.html with SITE_URL if it was provided differently from the default
const indexPath = path.resolve(process.cwd(), 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');
// Only replace if normalizedSiteUrl is different from the default to avoid unnecessary writes
if (normalizedSiteUrl !== 'https://mohitvenom.github.io/portfolio') {
  indexHtml = indexHtml.replace(/https:\/\/mohitvenom\.github\.io\/portfolio/g, normalizedSiteUrl);
  fs.writeFileSync(indexPath, indexHtml);
}
console.log(`✅ SEO configured for ${normalizedSiteUrl}`);
