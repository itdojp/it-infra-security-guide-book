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
const DOCKER_RUN_OPTIONS_WITH_VALUE = new Set([
  '-e', '--env', '--entrypoint', '--mount', '--name', '--network', '-p', '--platform',
  '--publish', '--pull', '-u', '--user', '-v', '--volume', '-w', '--workdir',
]);

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function unquote(value) {
  return value.replace(/^(['"])(.*)\1$/, '$2');
}

function extractDockerRunImage(line) {
  const command = line.match(/\bdocker\s+(?:container\s+)?run\b(.*)$/);
  if (!command) return null;

  const tokens = command[1].match(/"(?:\\.|[^"])*"\S*|'(?:\\.|[^'])*'\S*|\S+/g) || [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === '--') return tokens[index + 1] || null;
    if (!token.startsWith('-')) return token;

    const option = token.split('=', 1)[0];
    if (DOCKER_RUN_OPTIONS_WITH_VALUE.has(option) && !token.includes('=')) index += 1;
  }
  return null;
}

function extractImageReferences(line) {
  const references = [];
  const yamlImage = line.match(/^\s*(?:-\s*)?image:\s*['"]?([^#\s'"]+)/);
  const dockerfileImage = line.match(/^\s*FROM\s+([^\s]+)/i);
  const commandImage = line.match(/--image(?:=|\s+)['"]?([^\s'"]+)/);
  const dockerRunImage = extractDockerRunImage(line);
  if (yamlImage) references.push(yamlImage[1]);
  if (dockerfileImage) references.push(dockerfileImage[1]);
  if (commandImage) references.push(commandImage[1]);
  if (dockerRunImage) references.push(dockerRunImage);
  return references.map(unquote);
}

function isMutableImageReference(reference) {
  if (reference.includes('@sha256:')) return false;
  const lastSlash = reference.lastIndexOf('/');
  const lastColon = reference.lastIndexOf(':');
  if (lastColon <= lastSlash) return true;
  return reference.slice(lastColon + 1).toLowerCase() === 'latest';
}

function extractVariables(content) {
  const variables = new Map();
  for (const line of content.split('\n')) {
    const assignment = line.match(/^\s*([A-Z][A-Z0-9_]*):\s*['"]?([^#\s'"]+)/);
    if (assignment) variables.set(assignment[1], assignment[2]);
  }
  return variables;
}

function resolveImageReference(reference, variables) {
  return reference.replace(/\$(?:\{([A-Z][A-Z0-9_]*)\}|([A-Z][A-Z0-9_]*))/g, (match, braced, bare) => (
    variables.get(braced || bare) || match
  ));
}

function findMutableImageReferences(content) {
  const variables = extractVariables(content);
  return content.split('\n').flatMap((line, index) => (
    extractImageReferences(line)
      .map((reference) => resolveImageReference(reference, variables))
      .some(isMutableImageReference)
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
      || /--image(?:=|\s+)/.test(line)
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
    'image: example.invalid/app',
    'FROM example.invalid/base:latest',
    'FROM example.invalid/base',
    'kubectl run test --image=example.invalid/test:latest',
    'kubectl run test --image example.invalid/test',
    'docker run --rm example.invalid/tool:latest scan',
    'docker run --rm example.invalid/tool scan',
    'TRIVY_VERSION: "latest"',
    'image: example.invalid/trivy:$TRIVY_VERSION',
  ].join('\n');
  if (findMutableImageReferences(unsafeFixture).length !== 9) {
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
