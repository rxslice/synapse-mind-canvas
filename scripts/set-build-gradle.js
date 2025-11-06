const fs = require('fs');
const path = require('path');

const src = path.join(process.cwd(), 'support-files', 'build.gradle');
const destDir = path.join(process.cwd(), 'android', 'app');
const dest = path.join(destDir, 'build.gradle');

try {
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
} catch (err) {
  console.warn(`Could not copy build.gradle: ${err.message}`);
}