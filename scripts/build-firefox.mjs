import { execSync } from 'node:child_process';
import { cpSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const distDir = resolve(root, 'dist');
const ffDir = resolve(root, 'dist-firefox');
const ffManifestPath = resolve(root, 'manifest.firefox.json');

console.log('[build-firefox] running standard vite build...');
execSync('npm run build', { stdio: 'inherit' });

if (!existsSync(distDir)) {
  console.error('[build-firefox] dist/ missing after build — aborting');
  process.exit(1);
}

console.log('[build-firefox] copying dist/ -> dist-firefox/');
if (existsSync(ffDir)) rmSync(ffDir, { recursive: true, force: true });
cpSync(distDir, ffDir, { recursive: true });

console.log('[build-firefox] swapping manifest with Firefox variant');
const ffManifest = JSON.parse(readFileSync(ffManifestPath, 'utf8'));

const chromeManifestPath = resolve(ffDir, 'manifest.json');
const chromeManifest = JSON.parse(readFileSync(chromeManifestPath, 'utf8'));

const merged = {
  ...ffManifest,
  background: chromeManifest.background
    ? { ...chromeManifest.background, scripts: chromeManifest.background.service_worker
        ? [chromeManifest.background.service_worker]
        : chromeManifest.background.scripts ?? ['src/background/index.ts'],
        type: 'module' }
    : ffManifest.background,
  content_scripts: chromeManifest.content_scripts ?? ffManifest.content_scripts,
};

if (merged.background && 'service_worker' in merged.background) {
  delete merged.background.service_worker;
}

writeFileSync(resolve(ffDir, 'manifest.json'), JSON.stringify(merged, null, 2) + '\n');

console.log('[build-firefox] done. Output: dist-firefox/');
console.log('[build-firefox] Next: cd dist-firefox && zip -r ../decode-firefox-v0.1.0.zip .');
