#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const svgs = [
  { src: 'icon-512-maskable.svg', sizes: [512] },
  { src: 'icon-192.svg', sizes: [192] },
  { src: 'icon-152.svg', sizes: [152] }
];

function fail(msg) {
  console.error(msg);
  process.exit(2);
}

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  fail("'sharp' module not found. Install it with: npm install sharp --save-dev\nOr run the script in an environment where sharp is available.");
}

if (!fs.existsSync(iconsDir)) fail(`icons directory not found: ${iconsDir}`);

(async () => {
  for (const item of svgs) {
    const srcPath = path.join(iconsDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn('Skipping missing SVG:', srcPath);
      continue;
    }

    for (const s of item.sizes) {
      const outName = `icon-${s}.png`;
      const outPath = path.join(iconsDir, outName);
      console.log(`Rendering ${srcPath} -> ${outPath} (${s}x${s})`);
      await sharp(srcPath).resize(s, s, { fit: 'cover' }).png().toFile(outPath);
    }
  }
  console.log('PNG generation complete.');
})();
