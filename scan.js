const fs = require('fs');

const html = fs.readFileSync('buoi1.html', 'utf8');
const start = html.indexOf('const SLIDES = [');
const end = html.indexOf('];', start) + 2;
const slidesCode = html.substring(start, end);
let json = slidesCode.replace('const SLIDES = ', '').replace(/;$/, '');

console.log('=== SCANNING ALL ô nhap / o tich occurrences ===\n');

const nhapMatches = [...json.matchAll(/\u00f4 nh\u1eadp/g)];
const tichMatches = [...json.matchAll(/\u00f4 t\u00edch/g)];
console.log(`"ô nhap" count: ${nhapMatches.length}`);
nhapMatches.forEach(m => {
  const ctx = json.substring(Math.max(0, m.index - 30), Math.min(json.length, m.index + 60));
  console.log(`  [${m.index}] ...${ctx.replace(/\n/g,'↵')}...`);
});
console.log(`\n"ô tich" count: ${tichMatches.length}`);
tichMatches.forEach(m => {
  const ctx = json.substring(Math.max(0, m.index - 30), Math.min(json.length, m.index + 60));
  console.log(`  [${m.index}] ...${ctx.replace(/\n/g,'↵')}...`);
});
