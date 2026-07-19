#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_PATH = 'docs/chapter-chapter08/index.md';
const MANUSCRIPT_PATH = 'manuscript/chapter-chapter08/index.md';

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function extractMemorySnippet(content, label) {
  const match = content.match(/# メモリダンプ（システムへの影響を考慮）\n[\s\S]*?(?=\n# ログファイル収集)/);
  if (!match) throw new Error(`${label}: memory acquisition snippet was not found`);
  return match[0].trimEnd();
}

function validateSnippet(snippet, label) {
  const errors = [];
  const requiredOrder = [
    'if [ "$1" == "--memory-dump" ]; then',
    'if [ -r /dev/mem ]; then',
    'dd if=/dev/mem',
  ];
  const positions = requiredOrder.map((marker) => snippet.indexOf(marker));
  if (positions[0] < 0) {
    errors.push(`${label}: memory acquisition must remain explicitly gated by --memory-dump`);
  }
  if (positions[1] < 0) {
    errors.push(`${label}: the actual input /dev/mem must be checked for readability`);
  }
  if (positions[2] < 0) {
    errors.push(`${label}: /dev/mem must remain the declared acquisition input`);
  }
  if (positions.every((position) => position >= 0)
      && !(positions[0] < positions[1] && positions[1] < positions[2])) {
    errors.push(`${label}: opt-in, readability check, and acquisition must remain in safe order`);
  }
  if (snippet.includes('/proc/kcore')) {
    errors.push(`${label}: /proc/kcore must not be used as the /dev/mem precondition`);
  }
  return errors;
}

function main() {
  const docsSnippet = extractMemorySnippet(read(DOCS_PATH), DOCS_PATH);
  const manuscriptSnippet = extractMemorySnippet(read(MANUSCRIPT_PATH), MANUSCRIPT_PATH);
  const errors = [
    ...validateSnippet(docsSnippet, DOCS_PATH),
    ...validateSnippet(manuscriptSnippet, MANUSCRIPT_PATH),
  ];

  if (docsSnippet !== manuscriptSnippet) {
    errors.push('public docs and canonical manuscript memory snippets are out of sync');
  }

  const unsafeFixture = docsSnippet.replace('if [ -r /dev/mem ]; then', 'if [ -f /proc/kcore ]; then');
  if (validateSnippet(unsafeFixture, 'unsafe regression fixture').length === 0) {
    errors.push('checker self-test failed to detect the /proc/kcore regression fixture');
  }
  const unguardedFixture = docsSnippet.replace(
    'if [ "$1" == "--memory-dump" ]; then',
    '# --memory-dump opt-in guard removed',
  );
  if (validateSnippet(unguardedFixture, 'unguarded regression fixture').length === 0) {
    errors.push('checker self-test failed to detect removal of the --memory-dump opt-in guard');
  }

  if (errors.length > 0) {
    console.error('Forensics memory acquisition contract failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log('Forensics memory acquisition contract passed: docs/manuscript synced and /dev/mem readability checked.');
}

main();
