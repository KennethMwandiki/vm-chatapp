const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error('MANIFEST-ERROR:', msg);
  process.exit(2);
}

// Prefer the standard public/manifest.json path used by web servers
let manifestPath = path.resolve(__dirname, '..', 'public', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  // Fall back to the older path used in this repo
  manifestPath = path.resolve(__dirname, '..', 'publicmanifest.json', 'manifest.json');
}
if (!fs.existsSync(manifestPath)) {
  fail(`manifest.json not found at public/manifest.json or publicmanifest.json/manifest.json`);
}

let raw;
try {
  raw = fs.readFileSync(manifestPath, 'utf8');
} catch (e) {
  fail('unable to read manifest.json: ' + e.message);
}

let m;
try {
  m = JSON.parse(raw);
} catch (e) {
  fail('manifest.json is not valid JSON: ' + e.message);
}

const required = ['name', 'short_name', 'start_url', 'icons', 'display'];
for (const k of required) {
  if (!m[k]) fail(`missing required field: ${k}`);
}

if (!Array.isArray(m.icons) || m.icons.length === 0) {
  fail('manifest.icons must be a non-empty array');
}

console.log('Manifest looks OK.');
process.exit(0);
