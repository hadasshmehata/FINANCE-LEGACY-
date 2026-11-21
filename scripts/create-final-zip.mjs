// Package Finance_Legacy_Final_Fixed.zip
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const stagingDir = path.join(rootDir, 'staging-zip-build');
const outputZipName = 'Finance_Legacy_Final_Fixed.zip';
const outputZipPath = path.join(rootDir, outputZipName);
const artifactZipPath = 'C:\\Users\\hadas\\.gemini\\antigravity\\brain\\c63dac40-d7d3-4145-9b8c-94029520a4c4\\Finance_Legacy_Final_Fixed.zip';

console.log('--- PACKAGING FINANCE LEGACY FINAL FIXED ZIP ---');

// Clean previous staging & existing zip
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
if (fs.existsSync(outputZipPath)) {
  fs.rmSync(outputZipPath, { force: true });
}

fs.mkdirSync(stagingDir, { recursive: true });

// Copy directory recursively ignoring unwanted items
const ignorePatterns = [
  'node_modules',
  'dist',
  '.git',
  'staging-zip-build',
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  'Finance_Legacy_Final_Fixed.zip',
  '.system_generated',
  '.vscode',
];

function copyFolderRecursive(source, target) {
  const items = fs.readdirSync(source);
  for (const item of items) {
    if (ignorePatterns.some((p) => item === p || item.startsWith('.env') || item.endsWith('.zip'))) {
      continue;
    }

    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying verified project files to clean staging directory...');
copyFolderRecursive(rootDir, stagingDir);

// Compress using PowerShell Compress-Archive with Progress disabled
console.log('Compressing files into ' + outputZipName + '...');
const psCommand = `powershell -NoProfile -Command "$ProgressPreference = 'SilentlyContinue'; Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${outputZipPath}' -Force"`;
execSync(psCommand, { stdio: 'inherit' });

// Copy to artifact directory
try {
  fs.copyFileSync(outputZipPath, artifactZipPath);
  console.log(`Copied zip to artifact directory: ${artifactZipPath}`);
} catch (err) {
  console.warn('Note: artifact copy skipped or failed:', err.message);
}

// Clean staging directory
fs.rmSync(stagingDir, { recursive: true, force: true });

const stats = fs.statSync(outputZipPath);
console.log(`\n✓ SUCCESS: ${outputZipName} created successfully!`);
console.log(`  File size: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`  Root location: ${outputZipPath}`);
