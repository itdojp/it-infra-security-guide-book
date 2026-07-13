#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TMP_PARENT = path.join(ROOT, '.codex-local', 'tmp');
fs.mkdirSync(TMP_PARENT, { recursive: true });
const suiteRoot = fs.mkdtempSync(path.join(TMP_PARENT, 'reader-ux-regression-'));
const checker = path.join(ROOT, 'scripts', 'check-reader-ux.js');

function copyBaseline(target) {
  fs.mkdirSync(target, { recursive: true });
  for (const relativePath of ['book-config.json', 'package.json', 'manuscript', 'docs']) {
    fs.cpSync(path.join(ROOT, relativePath), path.join(target, relativePath), {
      recursive: true,
      filter: (source) => !source.includes(path.sep + '_site' + path.sep) && !source.includes(path.sep + '.jekyll-cache' + path.sep),
    });
  }
}

function mutateText(root, relativePath, needle, replacement) {
  const file = path.join(root, relativePath);
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(needle)) throw new Error(relativePath + ': fixture needle missing: ' + needle);
  fs.writeFileSync(file, text.replace(needle, replacement || ''));
}

const cases = [
  ['reader UX gate disconnected from npm test', (root) => {
    const file = path.join(root, 'package.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.scripts.test = data.scripts.test.replace('npm run check:reader-ux && ', '');
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }],
  ['missing flag', (root) => {
    const file = path.join(root, 'book-config.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.ux.modules.figureIndex = false;
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }],
  ['missing source page', (root) => fs.rmSync(path.join(root, 'manuscript/appendices/troubleshooting.md'))],
  ['missing public page', (root) => fs.rmSync(path.join(root, 'docs/appendices/figure-index'), { recursive: true })],
  ['missing appendix metadata', (root) => mutateText(root, 'docs/appendices/figure-index/index.md', 'appendix: figure-index\n', '')],
  ['duplicate manuscript order', (root) => mutateText(root, 'manuscript/appendices/appendix-b.md', 'order: 15', 'order: 14')],
  ['broken source-relative link', (root) => mutateText(root, 'manuscript/appendices/troubleshooting.md', '](../chapter-chapter02/)', '](../../chapter-chapter02/)')],
  ['missing flow marker', (root) => mutateText(root, 'docs/appendices/troubleshooting/index.md', '即時停止・引き継ぎ条件', '停止・引き継ぎ')],
  ['missing figure anchor', (root) => mutateText(root, 'docs/chapter-chapter01/index.md', '<a id="figure-cia-triad-implementation"></a>\n', '')],
  ['missing index entry', (root) => mutateText(root, 'docs/appendices/figure-index/index.md', 'data-figure-id="figure-cia-triad-implementation"', 'data-regression-id="figure-cia-triad-implementation"')],
  ['unreferenced asset mixed into inventory', (root) => {
    fs.appendFileSync(path.join(root, 'docs/chapter-chapter03/index.md'), '\n![regression](../assets/images/diagrams/defense-in-depth.svg)\n');
  }],
];

try {
  let passed = 0;
  for (const item of cases) {
    const name = item[0];
    const mutate = item[1];
    const fixture = path.join(suiteRoot, 'case-' + passed);
    copyBaseline(fixture);
    mutate(fixture);
    const result = spawnSync(process.execPath, [checker, '--root', fixture], { encoding: 'utf8' });
    if (result.status === 0) throw new Error(name + ': checker unexpectedly passed');
    passed += 1;
  }
  console.log('Reader UX negative regression passed: ' + passed + '/' + cases.length + '.');
} finally {
  fs.rmSync(suiteRoot, { recursive: true, force: true });
  try {
    if (fs.readdirSync(TMP_PARENT).length === 0) fs.rmdirSync(TMP_PARENT);
    const local = path.dirname(TMP_PARENT);
    if (fs.existsSync(local) && fs.readdirSync(local).length === 0) fs.rmdirSync(local);
  } catch (_) {}
}
