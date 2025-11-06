const { execSync } = require('child_process');

try {
  // Check if expo is present in node_modules
  execSync('npm ls expo', { stdio: 'ignore' });
  console.log('expo already present');
} catch (err) {
  console.log('expo not found in node_modules — installing expo into node_modules (no-save)...');
  execSync('npm install expo --no-save --no-audit --no-fund', { stdio: 'inherit' });
}