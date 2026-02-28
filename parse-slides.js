const fs = require('fs');

// Read the slides line
const content = fs.readFileSync('slides-debug.txt', 'utf8').trim();

// Extract JSON from "const SLIDES = [...];"
const match = content.match(/const SLIDES = (\[.*\]);/);
if (!match) {
  console.log('ERROR: Cannot find SLIDES array pattern');
  process.exit(1);
}

const jsonStr = match[1];

try {
  const slides = JSON.parse(jsonStr);
  console.log(`SUCCESS: Parsed ${slides.length} slides`);
  console.log('No corruption found!');
} catch (err) {
  console.log('ERROR: JSON parse failed');
  console.log(err.message);
  
  // Try to find the error position
  const errMatch = err.message.match(/position (\d+)/);
  if (errMatch) {
    const pos = parseInt(errMatch[1]);
    const start = Math.max(0, pos - 50);
    const end = Math.min(jsonStr.length, pos + 50);
    console.log('\nContext around error:');
    console.log(jsonStr.substring(start, end));
    console.log(' '.repeat(Math.min(50, pos - start)) + '^');
  }
}
