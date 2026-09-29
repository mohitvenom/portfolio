import fs from 'fs';
import path from 'path';

const isStrict = process.argv.includes('--strict');
let hasPlaceholders = false;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('[ADD')) {
          console.warn(`\n⚠️  Placeholder found in ${fullPath}:${index + 1}`);
          console.warn(`   -> ${line.trim()}`);
          hasPlaceholders = true;
        }
      });
    }
  });
}

console.log('Auditing codebase for placeholders...');
scanDir(path.resolve(process.cwd(), 'src'));

if (hasPlaceholders) {
  if (isStrict) {
    console.error('\n❌ Audit failed: Placeholders found in strict mode. Please resolve them before deploying.');
    process.exit(1);
  } else {
    console.warn('\n⚠️  Audit warning: Placeholders found. Run with --strict to enforce.');
  }
} else {
  console.log('\n✅ Audit passed: No placeholders found.');
}
