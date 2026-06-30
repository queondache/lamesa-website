#!/usr/bin/env node
// Rigenera i <lastmod> di sitemap.xml con la data reale di ultima modifica
// di ogni file (data ultimo commit git; fallback su mtime per file non tracciati).
// Uso: node scripts/update-sitemap-lastmod.mjs [--check]
//   (senza argomenti) riscrive sitemap.xml in place
//   --check         non scrive: esce con codice 1 se qualcosa cambierebbe (utile in CI)

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const SITE_ORIGIN = 'https://lamesabcn.com/';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITEMAP = join(ROOT, 'sitemap.xml');
const checkOnly = process.argv.includes('--check');

// Mappa un <loc> al file locale corrispondente.
// "/" e ".../" → index.html della cartella.
function locToFile(loc) {
  let path = loc.startsWith(SITE_ORIGIN) ? loc.slice(SITE_ORIGIN.length) : loc.replace(/^https?:\/\/[^/]+\//, '');
  if (path === '' || path.endsWith('/')) path += 'index.html';
  return join(ROOT, path);
}

// Data ultimo commit git (YYYY-MM-DD). Vuoto se il file non è tracciato.
function gitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

// Fallback: mtime del file su disco.
function mtimeDate(file) {
  return statSync(file).mtime.toISOString().slice(0, 10);
}

function realDate(file, loc) {
  const g = gitDate(file);
  if (g) return { date: g, source: 'git' };
  try {
    return { date: mtimeDate(file), source: 'mtime' };
  } catch {
    console.warn(`⚠️  file mancante per ${loc} → ${file}; lastmod invariato`);
    return null;
  }
}

const original = readFileSync(SITEMAP, 'utf8');
const rows = [];

// Processa blocco per blocco <url>…</url>: estrai <loc>, sostituisci il <lastmod> interno.
const updated = original.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
  const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
  if (!locMatch) return block;
  const loc = locMatch[1].trim();
  const file = locToFile(loc);
  const r = realDate(file, loc);
  if (!r) return block;
  rows.push({ loc: loc.replace(SITE_ORIGIN, '/'), date: r.date, source: r.source });
  return block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${r.date}</lastmod>`);
});

// Report
const w = Math.max(...rows.map((r) => r.loc.length), 4);
for (const r of rows) console.log(`${r.loc.padEnd(w)}  ${r.date}  (${r.source})`);
console.log(`\n${rows.length} URL processati.`);

if (checkOnly) {
  if (updated !== original) {
    console.error('\n✗ sitemap.xml non è aggiornato (esegui senza --check per riscriverlo).');
    process.exit(1);
  }
  console.log('✓ sitemap.xml già aggiornato.');
} else if (updated !== original) {
  writeFileSync(SITEMAP, updated);
  console.log('✓ sitemap.xml riscritto.');
} else {
  console.log('✓ nessuna modifica necessaria.');
}
