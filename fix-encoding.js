const fs = require('fs');

// Read file with UTF-8
let content = fs.readFileSync('d:\\Giáo_trình_dạy_web\\buoi1.html', 'utf8');

// Fix corrupted characters
const fixes = [
  [/\?ng d\?ng Qu\?n L� C�ng Vi\?c/g, 'Ứng dụng Quản Lý Công Việc'],
  [/C�ng Vi\?c C\?a T�i/g, 'Công Việc Của Tôi'],
  [/� nh\?p/g, 'ô nhập'],
  [/� t�ch/g, 'ô tích'],
  [/Danh s�ch c�ng vi\?c/g, 'Danh sách công việc'],
  [/Th�m vi\?c m\?i/g, 'Thêm việc mới'],
  [/O tích/g, 'Ô tích'],
];

fixes.forEach(([pattern, replacement]) => {
  content = content.replace(pattern, replacement);
});

// Write with UTF-8 BOM to ensure proper encoding
fs.writeFileSync('d:\\Giáo_trình_dạy_web\\buoi1.html', content, 'utf8');
console.log('✅ Fixed encoding issues');
