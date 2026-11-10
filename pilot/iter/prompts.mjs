// print agent prompts for round r: node iter/prompts.mjs <r>
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = process.argv[2];
const tpl = fs.readFileSync(path.join(ROOT, 'iter/PROMPT.md'), 'utf8');
const A = (p) => path.join(ROOT, p).split(path.sep).join('/');
const tasks = JSON.parse(fs.readFileSync(path.join(ROOT, `iter/tasks_r${r}.json`), 'utf8'));
console.log(JSON.stringify(tasks.map((t) => ({id: `${t.arm}/${t.model}/${path.basename(t.file, '.html')}`, model: t.model,
  prompt: tpl.replace('{SPEC}', A(`specs_lite/${t.mech}.prompt.md`)).replaceAll('{FILE}', A(t.file)).replace('{HISTORY}', t.history.map(A).join(', ')).replace('{REPLY}', A(t.reply))})), null, 1));
