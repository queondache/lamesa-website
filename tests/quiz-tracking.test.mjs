import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Stesse esclusioni di no-plain-email: solo pagine pubblicate.
const skipDirs = new Set(['.git', '.github', 'node_modules', 'shopify-theme', 'seo-audit', 'scripts', 'dev', 'demo', 'docs', 'tests', '.orchestratore']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    if (entry.isDirectory()) { if (!skipDirs.has(entry.name)) walk(join(dir, entry.name), out); }
    else if (entry.name.endsWith('.html')) out.push(join(dir, entry.name));
  }
  return out;
}

// Le risposte del quiz non sono contatti: in GA4 click_cta e' un evento chiave,
// quindi il quiz deve mandare un evento suo (quiz_answer) e mai passare da track().
test('Quiz answers are tracked as quiz_answer, never as click_cta', () => {
  const quizPages = walk(root).filter((f) => readFileSync(f, 'utf8').includes('dataset.answer'));
  assert.ok(quizPages.length >= 8, `expected the quiz on 8 pages, found ${quizPages.length}`);
  for (const file of quizPages) {
    const html = readFileSync(file, 'utf8');
    assert.ok(!html.includes("'respuesta_'"), `${file} still sends quiz answers as click_cta`);
    assert.match(html, /gtag\('event', 'quiz_answer', \{ event_label: c\.dataset\.answer \}\)/, `${file} does not send quiz_answer`);
  }
});
