// Blind VLM inputs: copy sheets to vlm/inputs/<id>.png with opaque ids; key kept in vlm/key.json (not shown to the VLM).
//   node oracle/vlm_prep.mjs <sheet.png ...>     (appends to the key; existing entries keep their id)
// Also writes specs/<mech>.mech.md = mechanism description without the code contract.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {ROOT} from './serve.mjs';
import {MECHS} from './mechs.mjs';
import {buildPrompt} from './make_prompt.mjs';

for (const id of Object.keys(MECHS)) {
  const full = buildPrompt(id);
  fs.writeFileSync(path.join(ROOT, 'specs', `${id}.mech.md`), full.split('## Output contract')[0].trim() + '\n');
}
const keyPath = path.join(ROOT, 'vlm', 'key.json');
const key = fs.existsSync(keyPath) ? JSON.parse(fs.readFileSync(keyPath, 'utf8')) : {};
const bySheet = Object.fromEntries(Object.entries(key).map(([k, v]) => [v.sheet, k]));
fs.mkdirSync(path.join(ROOT, 'vlm', 'inputs'), {recursive: true});
for (const s of process.argv.slice(2)) {
  const sheet = path.relative(ROOT, path.resolve(s)).replace(/\\/g, '/');
  if (bySheet[sheet]) continue;
  const base = path.basename(sheet, '.png');
  const mech = Object.keys(MECHS).find((m) => base.includes(m));
  const id = `${mech}-${crypto.createHash('sha1').update(sheet).digest('hex').slice(0, 8)}`;
  fs.copyFileSync(path.join(ROOT, sheet), path.join(ROOT, 'vlm', 'inputs', `${id}.png`));
  key[id] = {sheet, mech, source: base.replace(/__/g, '/')};
}
fs.writeFileSync(keyPath, JSON.stringify(key, null, 2));
console.log(`${Object.keys(key).length} blind inputs`);
