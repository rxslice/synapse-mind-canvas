const { spawnSync } = require('child_process');
const path = require('path');

const UPDATED_BUILD_NUMBER = process.env.BUILD_NUMBER || '1';
const cwd = path.join(process.cwd(), 'android');
const cmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const args = [
  'assembleRelease',
  `-PversionCode=${UPDATED_BUILD_NUMBER}`,
  `-PversionName=1.0.${UPDATED_BUILD_NUMBER}`
];

console.log(`Running: ${cmd} ${args.join(' ')} (cwd: ${cwd})`);
const res = spawnSync(cmd, args, { cwd, stdio: 'inherit' });

if (res.error) {
  console.error(res.error);
  process.exit(1);
}
process.exit(res.status);
