#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const errors = [];

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/') || '.';
}

function fail(message) {
  errors.push(message);
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(readText(file));
  } catch (error) {
    fail(`${rel(file)}: JSON parse failed: ${error.message}`);
    return {};
  }
}

function stripBom(value) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

function unquote(value) {
  const trimmed = String(value ?? '').trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function normalizeScalar(raw) {
  let value = String(raw ?? '').trim();
  if (!value) return '';

  const quote = value[0];
  if (quote === '"' || quote === "'") {
    let out = '';
    for (let i = 1; i < value.length; i += 1) {
      const ch = value[i];
      if (quote === '"' && ch === '\\' && i + 1 < value.length) {
        const next = value[i + 1];
        const escapes = { n: '\n', r: '\r', t: '\t', '"': '"', '\\': '\\' };
        out += Object.prototype.hasOwnProperty.call(escapes, next) ? escapes[next] : next;
        i += 1;
        continue;
      }
      if (ch === quote) {
        return out;
      }
      out += ch;
    }
    return out;
  }

  const comment = value.indexOf(' #');
  if (comment !== -1) {
    value = value.slice(0, comment).trimEnd();
  }
  return unquote(value);
}

function parseKeyValueYaml(file) {
  const result = {};
  let parent = null;
  for (const line of stripBom(readText(file)).replace(/\r\n?/g, '\n').split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const nested = line.match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/);
    if (nested && parent) {
      result[`${parent}.${nested[1]}`] = normalizeScalar(nested[2]);
      continue;
    }
    if (/^\s/.test(line)) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) {
      const key = match[1];
      const value = normalizeScalar(match[2]);
      result[key] = value;
      parent = value ? null : key;
      continue;
    }
  }
  return result;
}

function parseFrontMatter(file) {
  const text = stripBom(readText(file)).replace(/\r\n?/g, '\n');
  if (!text.startsWith('---\n')) {
    fail(`${rel(file)}: front matter is missing`);
    return { data: {}, body: text };
  }
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) {
    fail(`${rel(file)}: front matter closing marker is missing`);
    return { data: {}, body: text };
  }
  const data = {};
  const yaml = text.slice(4, end);
  for (const line of yaml.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#') || /^\s/.test(line)) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) {
      data[match[1]] = normalizeScalar(match[2]);
    }
  }
  return { data, body: text.slice(end + 5) };
}

function requireString(source, value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) {
    fail(`${source}: expected a non-empty string`);
  }
  return normalized;
}

function normalizeRepoUrl(value, source) {
  return requireString(source, value).replace(/\.git$/, '').replace(/\/$/, '');
}

function assertEqual(source, actual, expected) {
  if (actual !== expected) {
    fail(`${source}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertContains(source, haystack, needle) {
  if (!haystack.includes(needle)) {
    fail(`${source}: expected to contain ${JSON.stringify(needle)}`);
  }
}

function pathForItem(item, section) {
  if (item.id === 'introduction') return '/chapter-introduction/';
  if (section === 'chapters') return `/${item.id}/`;
  if (section === 'appendices') return `/appendices/${item.id}/`;
  return `/${item.id}/`;
}

function resolveDocsIndexPath(navPath) {
  if (typeof navPath !== 'string' || !navPath.trim()) {
    fail(`navigation path: expected a non-empty string, got ${JSON.stringify(navPath)}`);
    return null;
  }
  let normalized = navPath.trim().replace(/\\/g, '/');
  if (/^[a-z][a-z0-9+.-]*:/i.test(normalized)) {
    fail(`navigation path ${JSON.stringify(navPath)}: URL schemes are not allowed`);
    return null;
  }
  if (normalized.split('/').includes('..')) {
    fail(`navigation path ${JSON.stringify(navPath)}: path traversal is not allowed`);
    return null;
  }
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  const withoutSlash = normalized.replace(/^\//, '');
  const candidates = [];
  if (withoutSlash === '') {
    candidates.push(path.join(DOCS, 'index.md'));
  } else if (/\.(md|html?)$/i.test(withoutSlash)) {
    candidates.push(path.join(DOCS, withoutSlash));
  } else {
    const dir = withoutSlash.endsWith('/') ? withoutSlash : `${withoutSlash}/`;
    candidates.push(path.join(DOCS, dir, 'index.md'));
    candidates.push(path.join(DOCS, `${dir.slice(0, -1)}.md`));
  }
  const docsRoot = `${DOCS}${path.sep}`;
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (resolved !== DOCS && !resolved.startsWith(docsRoot)) {
      fail(`navigation path ${JSON.stringify(navPath)}: resolved outside docs`);
      return null;
    }
    if (fs.existsSync(resolved)) return resolved;
  }
  fail(`navigation path ${JSON.stringify(navPath)}: target page not found under docs`);
  return candidates[0];
}

function readNavigation(file) {
  const nav = {};
  let current = null;
  let currentItem = null;
  for (const line of stripBom(readText(file)).replace(/\r\n?/g, '\n').split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const section = line.match(/^([A-Za-z0-9_-]+):\s*$/);
    if (section) {
      current = section[1];
      nav[current] = [];
      currentItem = null;
      continue;
    }
    const itemTitle = line.match(/^-\s+title:\s*(.*)$/);
    if (itemTitle && current) {
      currentItem = { title: normalizeScalar(itemTitle[1]) };
      nav[current].push(currentItem);
      continue;
    }
    const itemPath = line.match(/^\s+path:\s*(.*)$/);
    if (itemPath && currentItem) {
      currentItem.path = normalizeScalar(itemPath[1]);
    }
  }
  return nav;
}

const book = readJson(path.join(ROOT, 'book-config.json'));
const pkg = readJson(path.join(ROOT, 'package.json'));
const rootConfig = parseKeyValueYaml(path.join(ROOT, '_config.yml'));
const docsConfig = parseKeyValueYaml(path.join(DOCS, '_config.yml'));
const index = parseFrontMatter(path.join(DOCS, 'index.md'));
const nav = readNavigation(path.join(DOCS, '_data', 'navigation.yml'));
const repoUrl = normalizeRepoUrl(book.repository, 'book-config.json repository');
const repoName = repoUrl.split('/').pop();
const pagesUrl = `https://itdojp.github.io/${repoName}/`;

assertEqual('package.json name', pkg.name, repoName);
assertEqual('package.json version', pkg.version, book.version);
assertEqual('package.json description', pkg.description, book.description);
assertEqual('package.json author', pkg.author, book.author);
assertEqual('package.json license', pkg.license, book.license);
assertEqual('package.json repository.url', normalizeRepoUrl(pkg.repository && pkg.repository.url, 'package.json repository.url'), repoUrl);
assertEqual('package.json homepage', pkg.homepage, pagesUrl);
assertEqual('package.json bugs.url', pkg.bugs && pkg.bugs.url, `${repoUrl}/issues`);
assertContains('package.json scripts.test', pkg.scripts && pkg.scripts.test || '', 'check:metadata');

for (const [label, config] of [['_config.yml', rootConfig], ['docs/_config.yml', docsConfig]]) {
  assertEqual(`${label} title`, config.title, book.title);
  assertEqual(`${label} description`, config.description, book.description);
  assertEqual(`${label} author`, config.author, book.author);
  assertEqual(`${label} version`, config.version, book.version);
  assertEqual(`${label} url`, config.url, 'https://itdojp.github.io');
  assertEqual(`${label} baseurl`, config.baseurl, `/${repoName}`);
  if (label === '_config.yml') {
    assertEqual(`${label} repository.github`, normalizeRepoUrl(rootConfig['repository.github'], `${label} repository.github`), repoUrl);
  } else {
    assertEqual(`${label} repository`, normalizeRepoUrl(config.repository, `${label} repository`), repoUrl);
  }
}

for (const key of ['title', 'description', 'author', 'version']) {
  assertEqual(`docs/index.md front matter ${key}`, index.data[key], book[key]);
}
assertEqual('docs/index.md front matter permalink', index.data.permalink, '/');
if (!index.body.includes(book.description) && !index.body.includes('{{ page.description }}')) {
  fail('docs/index.md body: expected the canonical description or the {{ page.description }} placeholder');
}
assertContains('README.md', readText(path.join(ROOT, 'README.md')), pagesUrl);
assertContains('README.md', readText(path.join(ROOT, 'README.md')), 'npm run check:metadata');

const expectedNavigation = [];
for (const section of ['chapters', 'appendices']) {
  for (const item of ((book.structure && book.structure[section]) || [])) {
    const expectedPath = pathForItem(item, section);
    expectedNavigation.push({ section, title: item.title, path: expectedPath });
  }
}

const flattenedNav = [];
for (const section of Object.keys(nav)) {
  for (const item of nav[section] || []) {
    flattenedNav.push({ section, ...item });
  }
}

for (const expected of expectedNavigation) {
  const match = flattenedNav.find((item) => item.path === expected.path);
  if (!match) {
    fail(`docs/_data/navigation.yml: missing path ${expected.path} for ${expected.title}`);
    continue;
  }
  if (match.title !== expected.title) {
    fail(`docs/_data/navigation.yml ${expected.path}: expected title ${JSON.stringify(expected.title)}, got ${JSON.stringify(match.title)}`);
  }
  resolveDocsIndexPath(match.path);
  assertContains('docs/index.md ToC', index.body, `(${expected.path.slice(1)})`);
}

if (errors.length > 0) {
  console.error('Metadata consistency check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Metadata consistency check passed.');
