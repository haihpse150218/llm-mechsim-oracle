// Other-vendor replication: runs generation and repair through an OpenAI-compatible chat API (DeepSeek) instead of
// Claude Code sub-agents. A sub-agent read the spec / file / reports itself and wrote the file in place; an API model
// cannot touch files, so this runner inlines exactly those files in the prompt and writes the answer back to the same
// paths. Everything else (specs, oracle, feedback texts, stop rules) is unchanged.
//
//   DEEPSEEK_API_KEY=... node oracle/api_agent.mjs gen <model> <mech> <k1..kn>     -> gen_lite/<model>/<mech>_s<k>.html
//   DEEPSEEK_API_KEY=... ITER_DIR=iter8/rep1 node oracle/api_agent.mjs repair <r>   -> runs tasks_r<r>.json (API models only)
// <model> is a folder name: dspro = deepseek-v4-pro, dsflash = deepseek-flash. Raw request/response metadata (usage,
// finish reason, timing; never the key) is saved next to each output as *.api.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS = {dspro: 'deepseek-v4-pro', dsflash: 'deepseek-flash'};
const KEY = process.env.DEEPSEEK_API_KEY;
const URL = process.env.API_URL || 'https://api.deepseek.com/chat/completions';
const CONC = +(process.env.CONC || 5);
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

export const GEN_PROMPT = (spec) => `Read the specification below and build exactly the simulator it describes.

Reply with the complete HTML page and nothing else, inside a single \`\`\`html code block.

----- SPECIFICATION -----
${spec}`;

export const REPAIR_PROMPT = (spec, file, reports) => `You are repairing a 3D mechanism simulator (one self-contained HTML file) that was generated for the specification below. You cannot open or run the page.

Steps:
1. Read the specification.
2. Read the simulator.
3. Read the review report(s), oldest first. The LAST report is about the current version of the file. Earlier reports (if any) were about earlier versions that have already been revised.
4. Fix the simulator. Keep following the specification's output contract exactly.
5. Answer in this format:
   - First line, exactly one of: "CHANGED: <one-sentence summary of what you changed>" or "NO_CHANGE: <why you believe nothing is wrong>".
   - If CHANGED, then the complete revised HTML file inside a single \`\`\`html code block (the whole file, not a diff).

----- SPECIFICATION -----
${spec}

----- SIMULATOR (current version) -----
\`\`\`html
${file}
\`\`\`

${reports.map((r, i) => `----- REVIEW REPORT ${i + 1} of ${reports.length}${i === reports.length - 1 ? ' (about the current version)' : ' (about an earlier version)'} -----\n${r}`).join('\n\n')}`;

async function chat(model, prompt) {
  const body = {model: MODELS[model], messages: [{role: 'user', content: prompt}], max_tokens: +(process.env.MAX_TOKENS || 32000), stream: false};
  for (let attempt = 1; ; attempt++) {
    const t0 = Date.now();
    try {
      const res = await fetch(URL, {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${KEY}`}, body: JSON.stringify(body)});
      const j = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(j).slice(0, 300)}`);
      const c = j.choices[0];
      return {text: c.message.content || '', finish: c.finish_reason, usage: j.usage, model: j.model, ms: Date.now() - t0, attempt};
    } catch (e) {
      if (attempt >= 3) throw e;
      console.error(`retry ${attempt}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }
}

const htmlOf = (text) => {
  const m = [...text.matchAll(/```html\s*\n([\s\S]*?)```/g)];
  if (m.length) return m.sort((a, b) => b[1].length - a[1].length)[0][1].trim() + '\n';
  const i = text.search(/<!DOCTYPE html|<html/i);
  return i >= 0 ? text.slice(i).trim() + '\n' : null;
};

async function pool(items, fn) {
  let next = 0;
  await Promise.all(Array.from({length: Math.min(CONC, items.length)}, async () => {
    while (next < items.length) { const it = items[next++]; await fn(it); }
  }));
}
const meta = (out, r, prompt) => fs.writeFileSync(out.replace(/\.(html|txt)$/, '.api.json'),
  JSON.stringify({model: r.model, finish: r.finish, usage: r.usage, ms: r.ms, attempt: r.attempt, promptChars: prompt.length, date: new Date().toISOString()}, null, 1));

const [cmd, ...args] = process.argv.slice(2);
if (!KEY) throw new Error('DEEPSEEK_API_KEY not set');
if (cmd === 'gen') {
  const [model, mech, ...ks] = args;
  const spec = rd(`specs_lite/${mech}.prompt.md`);
  const prompt = GEN_PROMPT(spec);
  fs.mkdirSync(path.join(ROOT, 'gen_lite', model), {recursive: true});
  await pool(ks, async (k) => {
    const out = path.join(ROOT, 'gen_lite', model, `${mech}_s${k}.html`);
    const r = await chat(model, prompt);
    const html = htmlOf(r.text);
    fs.writeFileSync(out, html ?? `<!-- no HTML in reply; raw reply follows -->\n${r.text}`);
    meta(out, r, prompt);
    console.log(`${model}/${mech}_s${k}: ${html ? html.length + ' chars' : 'NO HTML'} finish=${r.finish} tokens=${r.usage?.total_tokens}`);
  });
} else if (cmd === 'repair') {
  const r0 = args[0];
  const IT = process.env.ITER_DIR;
  const tasks = JSON.parse(rd(`${IT}/tasks_r${r0}.json`)).filter((t) => MODELS[t.model]);
  await pool(tasks, async (t) => {
    const prompt = REPAIR_PROMPT(rd(`specs_lite/${t.mech}.prompt.md`), rd(t.file), t.history.map(rd));
    const r = await chat(t.model, prompt);
    const first = (r.text.trim().split('\n').find((l) => /^\s*(\*\*)?(CHANGED|NO_CHANGE)/.test(l)) || '').replace(/\*\*/g, '').trim();
    const html = htmlOf(r.text);
    let reply;
    if (first.startsWith('NO_CHANGE')) reply = first;
    else if (html) { fs.writeFileSync(path.join(ROOT, t.file), html); reply = first || 'CHANGED: (no summary line)'; }
    else reply = `NO_REPLY: response had no status line and no HTML (finish=${r.finish})`;
    fs.writeFileSync(path.join(ROOT, t.reply), reply + '\n');
    fs.writeFileSync(path.join(ROOT, t.reply.replace(/\.txt$/, '.raw.md')), r.text);
    meta(path.join(ROOT, t.reply), r, prompt);
    console.log(`${t.arm}/${t.model}/${path.basename(t.file)} r${r0}: ${reply.slice(0, 90)} tokens=${r.usage?.total_tokens}`);
  });
} else console.log('usage: gen <model> <mech> <k...> | repair <round>');
