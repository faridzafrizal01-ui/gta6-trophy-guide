// Leonida Platinum Path — hand-in program for the gta6-trophy-guide-01 entry.
// The guide itself is the static app in app/ (index.html, style.css,
// tracker.js, roadmap.js, app.js and data/trophies.json with all 55
// official trophies and a written guide for each). This program copies
// app/ and screenshots/ into the output directory and writes the
// dossier the judge reads, using the vendored make.fun library, which
// must stay byte-identical to the kit's copy.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Preview:      node serve.ts   (serves app/ on a local port)

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from: string, to: string): void {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyTree(join(repoRoot, 'app'), join(outputDir, 'app'));

const shotsFrom = join(repoRoot, 'screenshots');
if (existsSync(shotsFrom)) {
  copyTree(shotsFrom, join(outputDir, 'screenshots'));
  const shots = readdirSync(shotsFrom).filter((name) => !name.startsWith('.'));
  console.log(`handing in ${shots.length} screenshots: ${shots.join(', ')}`);
}

// Caps mirror the gate: at most 4 screenshots of 256 KiB each, at most
// 993 entries and 48 MiB under app/, dossier text capped at 160 KiB.
// Determinism matters: the grader runs this program twice and compares
// the outputs byte for byte, so nothing here may depend on the clock,
// randomness or the order the filesystem happens to list files in.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`dossier.json written to ${outputDir} (${dossier.length} bytes)`);
