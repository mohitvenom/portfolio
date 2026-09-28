import fs from 'fs';
import path from 'path';

const pdfPath = path.resolve(process.cwd(), 'public/Mohit_Sharma_Resume.pdf');

if (!fs.existsSync(pdfPath)) {
  console.error('\n❌ BUILD FAILED: Resume PDF is missing! Please place your real resume at public/Mohit_Sharma_Resume.pdf');
  process.exit(1);
}

const stats = fs.statSync(pdfPath);
if (stats.size < 20480) { // 20 kB
  console.error('\n❌ BUILD FAILED: Resume PDF is too small (' + (stats.size/1024).toFixed(2) + ' kB). It appears to be a placeholder. Please place your real resume at public/Mohit_Sharma_Resume.pdf before building for production.');
  process.exit(1);
}

const buffer = Buffer.alloc(5);
const fd = fs.openSync(pdfPath, 'r');
fs.readSync(fd, buffer, 0, 5, 0);
fs.closeSync(fd);

if (buffer.toString('utf-8') !== '%PDF-') {
  console.error('\n❌ BUILD FAILED: Resume PDF does not appear to be a valid PDF file. Please place a valid PDF at public/Mohit_Sharma_Resume.pdf');
  process.exit(1);
}

console.log('✅ Resume PDF check passed.');
process.exit(0);
