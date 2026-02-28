const fs = require('fs');
let c = fs.readFileSync('buoi1.html', 'utf8');

// Fix the remaining corrupt SVG in the JSON string (escaped in JSON)
// Inside JSON: points=\"20 6 9 17 4 ô tích được ≥ 3 dòng CSS<\/li>
// Should be:   points=\"20 6 9 17 4 12\"\/><\/svg>ô tích được ≥ 3 dòng CSS<\/li>

const bad = 'points=\\"20 6 9 17 4 \\u00f4 t\\u00edch \\u0111\\u01b0\\u1ee3c \\u2265 3';
const count = (c.match(/points=\\"20 6 9 17 4 [^"\\]* ≥ 3/g) || []).length;
console.log('Found corrupt SVG occurrences:', count);

// Show all matches
const regex = /points=\\"20 6 9 17 4 [^1][^"]{0,60}/g;
let m;
while ((m = regex.exec(c)) !== null) {
  console.log('Match at', m.index, ':', m[0]);
}

// Fix: replace the corrupted SVG
c = c.replace(
  /points=\\"20 6 9 17 4 ô tích được ≥ 3 dòng CSS<\/li>/g,
  'points=\\"20 6 9 17 4 12\\"/><\\/svg>ô tích được ≥ 3 dòng CSS<\\/li>'
);

fs.writeFileSync('buoi1.html', c, 'utf8');

// Verify
const remaining = (fs.readFileSync('buoi1.html', 'utf8').match(/20 6 9 17 4 ô tích/g) || []).length;
console.log('Remaining corrupt instances:', remaining);
console.log('Done!');
