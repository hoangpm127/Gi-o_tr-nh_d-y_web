const fs = require('fs');

// ─── Phase 1: find ALL corruption positions ───────────────
const html = fs.readFileSync('buoi1.html', 'utf8');

// Extract SLIDES JSON
const start = html.indexOf('const SLIDES = [');
const end = html.indexOf('];', start) + 2;
const slidesCode = html.substring(start, end);
const jsonStr = slidesCode.replace('const SLIDES = ', '').replace(/;$/, '');

console.log('=== SLIDES JSON LENGTH:', jsonStr.length, '===\n');

// Iteratively parse to find ALL corruption points
let fixedJson = jsonStr;
let attempts = 0;
let allErrors = [];

while (attempts < 30) {
  attempts++;
  try {
    const slides = JSON.parse(fixedJson);
    console.log(`✅ JSON VALID! ${slides.length} slides total`);
    console.log('\nSlide types:', slides.map((s,i) => `[${i+1}] ${s.type}`).join('\n'));
    break;
  } catch (err) {
    const msg = err.message;
    const posMatch = msg.match(/position (\d+)/);
    if (!posMatch) {
      console.log('❌ Unknown error:', msg);
      break;
    }
    const pos = parseInt(posMatch[1]);
    const ctx = fixedJson.substring(Math.max(0, pos-60), Math.min(fixedJson.length, pos+60));
    allErrors.push({ pos, msg, ctx });
    console.log(`❌ Error #${attempts} at pos ${pos}:`);
    console.log('   Context: ...', ctx.replace(/\n/g,'↵'), '...');
    console.log('   Error:', msg);
    console.log('');
    break; // stop after each error, show all context
  }
}

if (allErrors.length > 0) {
  console.log('\n=== FULL CORRUPTION ANALYSIS ===');
  allErrors.forEach((e, i) => {
    console.log(`\n[Error ${i+1}] Position ${e.pos}`);
    console.log('Context (raw bytes):');
    const buf = Buffer.from(fixedJson.substring(Math.max(0,e.pos-20), Math.min(fixedJson.length, e.pos+20)));
    console.log(buf.toString('hex'));
    console.log(buf.toString('utf8'));
  });
}
