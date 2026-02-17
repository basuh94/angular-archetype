#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'coverage',
  'reports',
  'test-results',
  'playwright-report',
  '.angular',
]);

function parseArgs(argv) {
  const args = { name: '', slug: '', yes: false };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if ((arg === '--name' || arg === '-n') && argv[i + 1]) {
      args.name = argv[i + 1];
      i += 1;
      continue;
    }

    if ((arg === '--slug' || arg === '-s') && argv[i + 1]) {
      args.slug = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--yes' || arg === '-y') {
      args.yes = true;
      continue;
    }
  }

  return args;
}

function toSlug(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function slugToPascal(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function isProbablyText(content) {
  return !content.includes('\u0000');
}

async function readCurrentNames() {
  const packageJsonPath = path.join(ROOT, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const currentSlug = packageJson.name;

  let currentDisplay = '';
  const indexPath = path.join(ROOT, 'src', 'index.html');
  try {
    const indexHtml = await fs.readFile(indexPath, 'utf8');
    const titleMatch = indexHtml.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      currentDisplay = titleMatch[1].trim();
    }
  } catch {
    // ignore
  }

  if (!currentDisplay) {
    currentDisplay = slugToPascal(currentSlug);
  }

  return { currentSlug, currentDisplay };
}

async function collectFiles(dir, results = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) {
        continue;
      }
      await collectFiles(fullPath, results);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    results.push(fullPath);
  }

  return results;
}

async function replaceInFile(filePath, replacements) {
  const original = await fs.readFile(filePath, 'utf8').catch(() => null);
  if (original === null || !isProbablyText(original)) {
    return { changed: false, replacements: 0 };
  }

  let updated = original;
  let total = 0;

  for (const [from, to] of replacements) {
    if (!from || from === to) {
      continue;
    }

    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(escaped, 'g');
    const count = (updated.match(rx) || []).length;
    if (count > 0) {
      updated = updated.replace(rx, to);
      total += count;
    }
  }

  if (updated === original) {
    return { changed: false, replacements: 0 };
  }

  await fs.writeFile(filePath, updated, 'utf8');
  return { changed: true, replacements: total };
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.name) {
    console.error('Usage: node scripts/rename-project.mjs --name "My Product" [--slug my-product] [--yes]');
    process.exit(1);
  }

  const { currentSlug, currentDisplay } = await readCurrentNames();
  const newDisplay = args.name.trim();
  const newSlug = args.slug ? toSlug(args.slug) : toSlug(newDisplay);

  if (!newSlug) {
    console.error('Could not derive a valid slug. Provide --slug explicitly.');
    process.exit(1);
  }

  if (currentSlug === newSlug && currentDisplay === newDisplay) {
    console.log('Project already uses the requested name and slug. Nothing to do.');
    process.exit(0);
  }

  console.log('Rename summary:');
  console.log(`- slug:    ${currentSlug} -> ${newSlug}`);
  console.log(`- display: ${currentDisplay} -> ${newDisplay}`);

  if (!args.yes) {
    console.log('Tip: re-run with --yes to apply changes.');
    process.exit(0);
  }

  const files = await collectFiles(ROOT);
  const replacements = [
    [currentDisplay, newDisplay],
    [currentSlug, newSlug],
    [slugToPascal(currentSlug), slugToPascal(newSlug)],
  ];

  let changedFiles = 0;
  let totalReplacements = 0;

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath);
    if (rel.startsWith('reports/') || rel.startsWith('coverage/') || rel.startsWith('dist/')) {
      continue;
    }

    const result = await replaceInFile(filePath, replacements);
    if (result.changed) {
      changedFiles += 1;
      totalReplacements += result.replacements;
    }
  }

  console.log('Rename applied successfully.');
  console.log(`- changed files: ${changedFiles}`);
  console.log(`- total replacements: ${totalReplacements}`);
  console.log('Next steps:');
  console.log('1) npm install');
  console.log('2) npm run check');
  console.log('3) npm run e2e');
}

main().catch((error) => {
  console.error('Rename failed.');
  console.error(error);
  process.exit(1);
});
