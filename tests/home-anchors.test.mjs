// Ogni link a una sezione della home (/#x, /en/#x, /ca/#x, /pt/#x) deve puntare a un id che esiste in quella home.
// La home D3 (19/10/2026) non ha più #workshops, #privadas, #clases, #bono: i menu vecchi non devono tornarci.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const skip = new Set(['dev', 'node_modules', '.git', '.orchestratore', 'tests', '_site']);
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) { if (!skip.has(name)) walk(full); }
    else if (name.endsWith('.html')) pages.push(full);
  }
})(root);
const ids = {};
for (const prefix of ['', 'en/', 'ca/', 'pt/']) {
  ids[prefix] = new Set([...readFileSync(path.join(root, prefix, 'index.html'), 'utf8').matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
}

test('i link alle sezioni della home puntano a id esistenti', () => {
  const broken = [];
  for (const file of pages) {
    for (const m of readFileSync(file, 'utf8').matchAll(/href="\/((?:en|ca|pt)\/)?#([\w-]+)"/g)) {
      if (!ids[m[1] || ''].has(m[2])) broken.push(`${path.relative(root, file)} → /${m[1] || ''}#${m[2]}`);
    }
  }
  assert.deepEqual(broken, []);
});
