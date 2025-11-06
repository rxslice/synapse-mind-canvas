const fs = require('fs');
const path = require('path');

const BUILD_DIR = process.env.CM_BUILD_DIR || process.cwd();
const androidDir = path.join(BUILD_DIR, 'android');

fs.mkdirSync(androidDir, { recursive: true });

const sdkDir = process.env.ANDROID_SDK_ROOT || '';
fs.writeFileSync(path.join(androidDir, 'local.properties'), `sdk.dir=${sdkDir}\n`, 'utf8');

console.log(`Wrote local.properties to ${path.join(androidDir, 'local.properties')}`);