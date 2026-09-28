const fs = require('fs');

const contentStr = fs.readFileSync('src/data/content.ts', 'utf-8');
const t = contentStr.replace('export const content =', 'module.exports =');
fs.writeFileSync('temp-content.js', t);

const content = require('./temp-content.js');
console.log('| Skill | Group | Used In |');
console.log('|---|---|---|');
content.skills.forEach(g => {
  g.items.forEach(s => {
    const usedIn = content.projects.filter(p => p.tech.includes(s.name)).map(p => p.title);
    console.log(`| ${s.name} | ${g.category} | ${usedIn.join(', ')} |`);
  });
});
