// Copies the draft into the flat build folder ../overleaf (sections, tables, figures, bib files, main.tex with the
// bibliography path flattened). Class/bst files in ../overleaf are left alone.   node sync_overleaf.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const H = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(H, '../overleaf');
const copyDir = (d, keep) => {
  fs.mkdirSync(path.join(OUT, d), {recursive: true});
  for (const f of fs.readdirSync(path.join(H, d)).filter(keep)) fs.copyFileSync(path.join(H, d, f), path.join(OUT, d, f));
};
copyDir('sections', (f) => f.endsWith('.tex'));
copyDir('tables', (f) => f.endsWith('.tex'));
copyDir('figures', (f) => f.endsWith('.tex') || f.endsWith('.pdf'));
fs.copyFileSync(path.resolve(H, '../references.bib'), path.join(OUT, 'references.bib'));
fs.copyFileSync(path.join(H, 'llm3d.bib'), path.join(OUT, 'llm3d.bib'));
const main = fs.readFileSync(path.join(H, 'main.tex'), 'utf8').replace('\\bibliography{../references,llm3d}', '\\bibliography{references,llm3d}');
if (!main.includes('\\bibliography{references,llm3d}')) throw new Error('bibliography line not found in main.tex');
fs.writeFileSync(path.join(OUT, 'main.tex'), main);
console.log('synced to', OUT);
