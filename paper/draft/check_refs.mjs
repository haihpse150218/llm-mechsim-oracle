// Checks that every \cite key exists in the .bib files and every \ref has a \label.  node check_refs.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const H = path.dirname(fileURLToPath(import.meta.url));
const read = (d) => fs.readdirSync(path.join(H, d)).filter((f) => f.endsWith(".tex")).map((f) => fs.readFileSync(path.join(H, d, f), 'utf8')).join('\n');
const S = read('sections') + read('tables') + read('figures');
const bib = fs.readFileSync(path.join(H, '../references.bib'), 'utf8') + fs.readFileSync(path.join(H, 'llm3d.bib'), 'utf8');
const keys = new Set([...bib.matchAll(/^@\w+\{([^,]+),/gm)].map((m) => m[1].trim()));
const cites = new Set([...S.matchAll(/\\cite[pt]?\{([^}]*)\}/g)].flatMap((m) => m[1].split(',').map((x) => x.trim())));
const labels = new Set([...S.matchAll(/\\label\{([^}]*)\}/g)].map((m) => m[1]));
const refs = new Set([...S.matchAll(/\\ref\{([^}]*)\}/g)].map((m) => m[1]));
const mc = [...cites].filter((k) => !keys.has(k)), mr = [...refs].filter((r) => !labels.has(r));
console.log(`cites ${cites.size}, missing: ${mc.join(', ') || 'none'}`);
console.log(`refs ${refs.size}, missing labels: ${mr.join(', ') || 'none'}`);
process.exit(mc.length || mr.length ? 1 : 0);
