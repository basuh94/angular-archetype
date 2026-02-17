import { promises as fs } from 'node:fs';
import { join } from 'node:path';

const DIST_BROWSER_DIR = join(process.cwd(), 'dist', 'angular-archetype', 'browser');
const REPORTS_DIR = join(process.cwd(), 'reports');
const JSON_REPORT_PATH = join(REPORTS_DIR, 'bundle-summary.json');
const MD_REPORT_PATH = join(REPORTS_DIR, 'bundle-summary.md');

function toKb(bytes) {
  return Number((bytes / 1024).toFixed(2));
}

async function readBundleFiles() {
  const html = await fs.readFile(join(DIST_BROWSER_DIR, 'index.html'), 'utf8');
  const initialMatches = [
    ...html.matchAll(/(?:src|href)=\"([^"]+\.(?:js|css))\"/g),
    ...html.matchAll(/(?:src|href)='([^']+\.(?:js|css))'/g),
  ];
  const initialFiles = new Set(
    initialMatches.map((match) => match[1].split('/').pop()).filter((value) => !!value),
  );

  const entries = await fs.readdir(DIST_BROWSER_DIR, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (!entry.name.endsWith('.js') && !entry.name.endsWith('.css')) {
      continue;
    }

    const fullPath = join(DIST_BROWSER_DIR, entry.name);
    const stat = await fs.stat(fullPath);
    const type = entry.name.endsWith('.js') ? 'js' : 'css';
    const bucket = initialFiles.has(entry.name) ? 'initial' : 'lazy';

    files.push({
      file: entry.name,
      type,
      bucket,
      bytes: stat.size,
      kb: toKb(stat.size),
    });
  }

  return files.sort((a, b) => b.bytes - a.bytes);
}

function buildSummary(files) {
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
  const totalJsBytes = files.filter((f) => f.type === 'js').reduce((sum, file) => sum + file.bytes, 0);
  const totalCssBytes = files.filter((f) => f.type === 'css').reduce((sum, file) => sum + file.bytes, 0);

  const initialBytes = files.filter((f) => f.bucket === 'initial').reduce((sum, file) => sum + file.bytes, 0);
  const lazyBytes = files.filter((f) => f.bucket === 'lazy').reduce((sum, file) => sum + file.bytes, 0);

  return {
    generatedAt: new Date().toISOString(),
    outputDir: DIST_BROWSER_DIR,
    totals: {
      files: files.length,
      bytes: totalBytes,
      kb: toKb(totalBytes),
      jsBytes: totalJsBytes,
      jsKb: toKb(totalJsBytes),
      cssBytes: totalCssBytes,
      cssKb: toKb(totalCssBytes),
      initialBytes,
      initialKb: toKb(initialBytes),
      lazyBytes,
      lazyKb: toKb(lazyBytes),
    },
    largestFiles: files.slice(0, 10),
    files,
  };
}

function buildMarkdown(summary) {
  const largestRows = summary.largestFiles
    .map((file) => `| ${file.file} | ${file.type} | ${file.bucket} | ${file.kb} |`)
    .join('\n');

  return [
    '# Bundle Summary',
    '',
    `Generated at: ${summary.generatedAt}`,
    '',
    '## Totals',
    '',
    `- Files: ${summary.totals.files}`,
    `- Total size: ${summary.totals.kb} kB`,
    `- JS size: ${summary.totals.jsKb} kB`,
    `- CSS size: ${summary.totals.cssKb} kB`,
    `- Initial bucket size: ${summary.totals.initialKb} kB`,
    `- Lazy bucket size: ${summary.totals.lazyKb} kB`,
    '',
    '## Largest Files (Top 10)',
    '',
    '| File | Type | Bucket | Size (kB) |',
    '| --- | --- | --- | ---: |',
    largestRows || '| n/a | n/a | n/a | 0 |',
    '',
  ].join('\n');
}

async function main() {
  try {
    await fs.access(DIST_BROWSER_DIR);
  } catch {
    console.error(`Bundle output folder not found: ${DIST_BROWSER_DIR}`);
    console.error('Run `npm run build` before generating the report.');
    process.exit(1);
  }

  const files = await readBundleFiles();
  const summary = buildSummary(files);

  await fs.mkdir(REPORTS_DIR, { recursive: true });
  await fs.writeFile(JSON_REPORT_PATH, JSON.stringify(summary, null, 2), 'utf8');
  await fs.writeFile(MD_REPORT_PATH, buildMarkdown(summary), 'utf8');

  console.log(`Bundle report generated:`);
  console.log(`- ${JSON_REPORT_PATH}`);
  console.log(`- ${MD_REPORT_PATH}`);
  console.log(`Initial bucket: ${summary.totals.initialKb} kB | Lazy bucket: ${summary.totals.lazyKb} kB`);
}

main().catch((error) => {
  console.error('Failed to generate bundle report.');
  console.error(error);
  process.exit(1);
});
