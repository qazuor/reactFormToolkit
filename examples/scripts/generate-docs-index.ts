import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type DocEntry = {
  title: string;
  path: string;
};

const docsDir = path.join(__dirname, '../public/docs');
const outputPath = path.join(docsDir, 'docs-index.json');

const docsIndex: DocEntry[] = [];

function scanDirectory(currentPath: string, basePath = docsDir): void {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath, basePath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relativePath = path.relative(basePath, fullPath);
      const title = path.basename(relativePath.replace(/\.md$/, ''))
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      docsIndex.push({
        title,
        path: relativePath,
      });
    }
  });
}

scanDirectory(docsDir);

fs.writeFileSync(outputPath, JSON.stringify(docsIndex, null, 2), 'utf-8');

console.log(`✅ docs-index.json generado con ${docsIndex.length} entradas.`);
