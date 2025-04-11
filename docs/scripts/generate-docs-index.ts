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
            let title = path.basename(relativePath.replace(/\.md$/, ''))
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());

            if (title === 'README') {
                title = 'Introduction';
            }

            docsIndex.push({
                title,
                path: relativePath,
            });
        }
    });
}

scanDirectory(docsDir);

const desiredOrder = [
    'Introduction',
    'Getting Started',
    'Components',
    'Form Provider',
    'Form Field',
    'Form Description',
    'Form Buttons',
    'Checkboxgroup Field',
    'Radiogroup Field',
    'Multiselect Field',
    'Dependant Field',
    'Conditional Field',
    'Conditional Field Group',
    'Field Array',
    'Integrating with UI libraries',
    'Hooks',
    'I18n',
    'Styling',
    'Utilities',
    'Api Reference',
    'Comparisions',
    'Contribuiting',
    'Deployment'
];

docsIndex.sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.title);
    const indexB = desiredOrder.indexOf(b.title);

    if (indexA === -1 && indexB === -1) {
        return a.title.localeCompare(b.title);
    }
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
});

fs.writeFileSync(outputPath, JSON.stringify(docsIndex, null, 2), 'utf-8');
console.log(`✅ docs-index.json generated width ${docsIndex.length} entries.`);
