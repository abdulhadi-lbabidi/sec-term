const fs = require('fs');
const path = require('path');
const files = [
  'src/app/pages/Admin/Products/ProductPages/AddProductVariant.tsx',
  'src/app/pages/Admin/Products/ProductPages/AddProduct.tsx',
  'src/app/pages/Admin/Products/ProductPages/Products.tsx',
  'src/app/pages/Admin/Packages/Packages.tsx',
  'src/app/pages/Admin/Packages/AddPackage.tsx'
];

files.forEach(file => {
  const filePath = path.join('c:/Users/VICTUS/Desktop/sec-term', file);
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  content = content.replace(/isRtl\s*\?\s*(['"])([^'"]+)\1\s*:\s*(['"])([^'"]+)\3/g, (match, q1, ar, q2, en) => {
    if (en === '' || ar === '' || en.includes('rotate-180') || ar.includes('rotate-180') || en === 'ر.س' || ar === 'ر.س' || en === 'SAR' || ar === 'SAR') {
      return match;
    }
    let key = en.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    count++;
    return `t("title.${key}")`;
  });
  if (count > 0) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', count, 'strings in', file);
  }
});
