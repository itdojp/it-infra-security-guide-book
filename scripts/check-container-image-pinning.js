#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHAPTER_PATHS = [
  'docs/chapter-chapter07/index.md',
  'manuscript/chapter-chapter07/index.md',
];
const POLICY_MARKERS = [
  '`<VERSION>`/`<TAG>` は固定のまま使わず、組織の基準（検証済み/サポート範囲）に置き換える',
  'ベースイメージ/依存パッケージはタグを固定し、可能ならダイジェストでピン留めする（`:latest` を避ける）',
];
const UNSAFE_REFERENCE_PATTERNS = [
  /^\s*(?:-\s*)?image:\s*['"]?[^#\s'"]+:latest(?:['"])?(?:\s|$)/,
  /^\s*FROM\s+\S+:latest(?:\s|$)/i,
  /--image(?:=|\s+)['"]?[^\s'"]+:latest\b/,
  /\bdocker\s+(?:container\s+)?run\b[^\n]*\b[\w./${}@-]+:latest\b/,
];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function findMutableImageReferences(content) {
  return content.split('\n').flatMap((line, index) => (
    UNSAFE_REFERENCE_PATTERNS.some((pattern) => pattern.test(line))
      ? [{ line: index + 1, text: line.trim() }]
      : []
  ));
}

function extractPinningContract(content) {
  return content.split('\n')
    .map((line) => line.trim())
    .filter((line) => (
      /^FROM\s/.test(line)
      || /^TRIVY_VERSION:/.test(line)
      || /^(?:-\s*)?image:/.test(line)
      || /\bdocker\s+(?:container\s+)?run\b/.test(line)
      || /--image=/.test(line)
    ));
}

function validateChapter(content, relativePath) {
  const errors = findMutableImageReferences(content)
    .map((match) => `${relativePath}:${match.line}: mutable container image reference: ${match.text}`);

  for (const marker of POLICY_MARKERS) {
    if (!content.includes(marker)) {
      errors.push(`${relativePath}: required reproducibility policy is missing: ${marker}`);
    }
  }

  return errors;
}

function main() {
  const chapterContents = CHAPTER_PATHS.map((relativePath) => read(relativePath));
  const errors = CHAPTER_PATHS.flatMap((relativePath, index) => (
    validateChapter(chapterContents[index], relativePath)
  ));
  const contracts = chapterContents.map(extractPinningContract);

  if (JSON.stringify(contracts[0]) !== JSON.stringify(contracts[1])) {
    errors.push('public docs and canonical manuscript container image pinning contracts are out of sync');
  }

  const unsafeFixture = [
    'image: example.invalid/app:latest',
    'FROM example.invalid/base:latest',
    'kubectl run test --image=example.invalid/test:latest',
    'docker run --rm example.invalid/tool:latest scan',
  ].join('\n');
  if (findMutableImageReferences(unsafeFixture).length !== 4) {
    errors.push('checker self-test failed to detect all supported mutable image reference forms');
  }

  const runnerFixture = 'runs-on: ubuntu-latest';
  if (findMutableImageReferences(runnerFixture).length !== 0) {
    errors.push('checker self-test incorrectly treated a GitHub Actions runner label as a container image');
  }

  const driftFixture = chapterContents[1].replace('node:<VERSION>-alpine', 'node:<OTHER_VERSION>-alpine');
  if (JSON.stringify(contracts[0]) === JSON.stringify(extractPinningContract(driftFixture))) {
    errors.push('checker self-test failed to detect a docs/manuscript pinning contract drift');
  }

  if (errors.length > 0) {
    console.error('Container image pinning contract failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log('Container image pinning contract passed: chapter 7 avoids mutable image tags and retains the digest policy.');
}

main();
