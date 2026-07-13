#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function parseRoot(argv) {
  const at = argv.indexOf('--root');
  if (at === -1) return path.resolve(__dirname, '..');
  if (!argv[at + 1]) throw new Error('--root requires a path');
  return path.resolve(argv[at + 1]);
}

const ROOT = parseRoot(process.argv.slice(2));
const errors = [];
const expected = [
  ['chapter-chapter01', 'information-assets-security-overview'],
  ['chapter-chapter01', 'cia-triad-implementation'],
  ['chapter-chapter01', 'infrastructure-security-implementation-mindmap'],
  ['chapter-chapter01', 'threat-to-business-impact-process'],
  ['chapter-chapter01', 'risk-based-approach-implementation'],
  ['chapter-chapter01', 'modern-cyber-attack-sequence'],
  ['chapter-chapter02', 'multilayer-defense-architecture'],
  ['chapter-chapter02', 'implementation-priority-framework'],
  ['chapter-chapter02', 'security-architecture-three-elements'],
  ['chapter-chapter02', 'infrastructure-engineer-roles-responsibilities'],
  ['chapter-chapter02', 'security-framework-implementation'],
];

function read(relativePath) {
  const file = path.join(ROOT, relativePath);
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (error) {
    errors.push(relativePath + ': ' + error.message);
    return '';
  }
}

function count(text, needle) {
  if (!needle) return 0;
  return text.split(needle).length - 1;
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

function stripFrontMatter(text) {
  if (!text.startsWith('---\n')) return text;
  const end = text.indexOf('\n---\n', 4);
  return end === -1 ? text : text.slice(end + 5);
}

function normalizedBody(text) {
  return stripFrontMatter(text)
    .replace(/\.\.\/(?:\.\.\/)?chapter-/g, '__CHAPTER_ROOT__/')
    .replace(/\(appendix-a\.md\)/g, '(__APPENDIX_A__)')
    .replace(/\(\.\.\/appendix-a\/\)/g, '(__APPENDIX_A__)');
}

function frontMatterOrder(text) {
  const match = text.match(/^order:\s*(\d+)\s*$/m);
  return match ? Number(match[1]) : null;
}

function markdownFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

let book = {};
try {
  book = JSON.parse(read('book-config.json'));
} catch (error) {
  errors.push('book-config.json: ' + error.message);
}

const modules = (((book || {}).ux || {}).modules || {});
expect(modules.troubleshootingFlow === true, 'book-config: troubleshootingFlow must be true');
expect(modules.figureIndex === true, 'book-config: figureIndex must be true');
const appendixIds = ((((book || {}).structure || {}).appendices) || []).map((item) => item.id);
for (const id of ['troubleshooting', 'figure-index']) {
  expect(appendixIds.filter((value) => value === id).length === 1, 'book-config: appendix ' + id + ' must occur once');
}

const files = {
  sourceTrouble: read('manuscript/appendices/troubleshooting.md'),
  sourceIndex: read('manuscript/appendices/figure-index.md'),
  docsTrouble: read('docs/appendices/troubleshooting/index.md'),
  docsIndex: read('docs/appendices/figure-index/index.md'),
  top: read('docs/index.md'),
  nav: read('docs/_data/navigation.yml'),
  pkg: read('package.json'),
  sourceAppendixA: read('manuscript/appendices/appendix-a.md'),
  sourceAppendixB: read('manuscript/appendices/appendix-b.md'),
  sourceAfterword: read('manuscript/appendices/afterword.md'),
};

let pkg = {};
try {
  pkg = JSON.parse(files.pkg);
} catch (error) {
  errors.push('package.json: ' + error.message);
}

expect(
  normalizedBody(files.sourceTrouble) === normalizedBody(files.docsTrouble),
  'troubleshooting: source/public body mismatch',
);
expect(
  normalizedBody(files.sourceIndex) === normalizedBody(files.docsIndex),
  'figure index: source/public body mismatch',
);
expect(files.docsTrouble.includes('appendix: troubleshooting'), 'public troubleshooting: appendix metadata missing');
expect(files.docsIndex.includes('appendix: figure-index'), 'public figure index: appendix metadata missing');

const sourceOrders = [
  frontMatterOrder(files.sourceAppendixA),
  frontMatterOrder(files.sourceTrouble),
  frontMatterOrder(files.sourceIndex),
  frontMatterOrder(files.sourceAppendixB),
  frontMatterOrder(files.sourceAfterword),
];
expect(
  JSON.stringify(sourceOrders) === JSON.stringify([12, 13, 14, 15, 16]),
  'manuscript appendix orders must be unique and follow A → troubleshooting → figure index → B → afterword',
);
expect(!files.sourceTrouble.includes('../../chapter-'), 'source troubleshooting: chapter links must stay inside manuscript tree');
expect(files.sourceTrouble.includes('](appendix-a.md)'), 'source troubleshooting: appendix A link must target sibling source file');
expect(!files.sourceIndex.includes('href="../../chapter-'), 'source figure index: chapter links must stay inside manuscript tree');

expect(files.top.includes('(appendices/troubleshooting/)'), 'docs/index.md: troubleshooting route missing');
expect(files.top.includes('(appendices/figure-index/)'), 'docs/index.md: figure index route missing');
const paths = [
  '/appendices/appendix-a/',
  '/appendices/troubleshooting/',
  '/appendices/figure-index/',
  '/appendices/appendix-b/',
  '/appendices/afterword/',
];
for (const item of paths) {
  expect(count(files.nav, 'path: ' + item) === 1, 'navigation: ' + item + ' must occur once');
}
const positions = paths.map((item) => files.nav.indexOf('path: ' + item));
expect(
  positions.every((value, index) => value >= 0 && (index === 0 || value > positions[index - 1])),
  'navigation: appendix order is invalid',
);

for (const marker of ['証跡保全', 'read-only', '最小安全テスト', 'rollback', '即時停止・引き継ぎ条件', 'credential']) {
  expect(files.sourceTrouble.includes(marker), 'source troubleshooting: marker ' + marker + ' missing');
  expect(files.docsTrouble.includes(marker), 'public troubleshooting: marker ' + marker + ' missing');
}
const scripts = (pkg && pkg.scripts) || {};
const testSegments = String(scripts.test || '').split(/\s*&&\s*/);
expect(
  testSegments.includes('npm run check:reader-ux'),
  'package.json: scripts.test must execute npm run check:reader-ux',
);
const readerUxGate = String(scripts['check:reader-ux'] || '');
expect(
  readerUxGate.includes('node scripts/check-reader-ux.js')
    && readerUxGate.includes('node scripts/check-reader-ux-regression.js'),
  'package.json: check:reader-ux must execute checker and negative regression',
);

const observed = [];
for (const file of markdownFiles(path.join(ROOT, 'docs'))) {
  const relative = path.relative(path.join(ROOT, 'docs'), file).replace(/\\/g, '/');
  const body = fs.readFileSync(file, 'utf8');
  const imagePattern = /assets\/images\/diagrams\/(?:[^)"'\s]+\/)*([a-z0-9-]+)\.svg/g;
  for (const match of body.matchAll(imagePattern)) observed.push([relative, match[1]]);
}
const key = (item) => item[0] + '/' + item[1];
const expectedKeys = expected.map((item) => [item[0] + '/index.md', item[1]]).map(key).sort();
const observedKeys = observed.map(key).sort();
expect(
  JSON.stringify(observedKeys) === JSON.stringify(expectedKeys),
  'figure inventory mismatch: expected ' + expectedKeys.join(', ') + ', got ' + observedKeys.join(', '),
);

for (const item of expected) {
  const chapter = item[0];
  const stem = item[1];
  const chapterBody = read('docs/' + chapter + '/index.md');
  const anchor = '<a id="figure-' + stem + '"></a>';
  expect(count(chapterBody, anchor) === 1, 'figure anchor ' + stem + ': expected once in ' + chapter);
  const anchorAt = chapterBody.indexOf(anchor);
  const imageAt = chapterBody.indexOf(stem + '.svg');
  expect(anchorAt >= 0 && imageAt > anchorAt && imageAt - anchorAt < 200, 'figure anchor ' + stem + ': must immediately precede image');
  expect(count(files.docsIndex, 'data-figure-id="figure-' + stem + '"') === 1, 'figure index entry ' + stem + ': expected once');
  expect(count(files.docsIndex, 'href="../../' + chapter + '/#figure-' + stem + '"') === 1, 'figure index link ' + stem + ': expected once');
  expect(count(files.sourceIndex, 'data-figure-id="figure-' + stem + '"') === 1, 'source figure index entry ' + stem + ': expected once');
  expect(count(files.sourceIndex, 'href="../' + chapter + '/#figure-' + stem + '"') === 1, 'source figure index link ' + stem + ': expected once');
}

const entryPattern = /data-figure-id="figure-([a-z0-9-]+)"/g;
const publicEntries = [...files.docsIndex.matchAll(entryPattern)].map((match) => match[1]).sort();
const expectedStems = expected.map((item) => item[1]).sort();
expect(JSON.stringify(publicEntries) === JSON.stringify(expectedStems), 'figure index: entries must be exact 11-item inventory');

if (errors.length > 0) {
  console.error('Reader UX check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('Reader UX check passed: troubleshooting flow and exact 11-figure index.');
