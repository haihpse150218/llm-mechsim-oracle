// Contact sheet of a simulator: 8 frames over one input period (t = k*period/8), 4x2 grid, labelled t=.
//   node oracle/sheet.mjs <file.html ...> [--outdir sheets] [--frames 8]
// Mirrors teardown's review loop (static frame sheets), used as the VLM baseline input.
import fs from 'node:fs';
import path from 'node:path';
import {startServer, launch, ROOT} from './serve.mjs';
import {MECHS} from './mechs.mjs';
import {mechOf} from './run_oracle.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  if (i < 0) return d;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};
const outdir = path.resolve(opt('outdir', path.join(ROOT, 'sheets')));
const nFrames = Number(opt('frames', '12'));
const hideIdx = argv.indexOf('--hide-panel');
const hidePanel = hideIdx >= 0;
if (hidePanel) argv.splice(hideIdx, 1);
const periodOverride = opt('period', null);
fs.mkdirSync(outdir, {recursive: true});

const srv = await startServer();
const browser = await launch();
const ctx = await browser.newContext({viewport: {width: 640, height: 400}});
for (const f of argv) {
  const abs = path.resolve(f);
  const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
  let T = MECHS[mechOf(abs)]?.period || 4;
  const page = await ctx.newPage();
  const shots = [];
  try {
    await page.goto(`${srv.url}/${rel}?capture`, {waitUntil: 'load', timeout: 20000});
    await page.waitForFunction(() => window.SIM_READY === true, null, {timeout: 15000});
    if (hidePanel) {
      // hide the top-level overlay block(s) that contain panel numbers
      await page.evaluate(() => document.querySelectorAll('[data-q]').forEach((e) => {
        let n = e;
        while (n.parentElement && n.parentElement !== document.body) n = n.parentElement;
        if (n.tagName !== 'CANVAS') n.style.display = 'none';
      }));
    }
    const simPeriod = Number(periodOverride) || (await page.evaluate(() => Number(window.SIM.period))) || T;
    T = simPeriod;
    for (let k = 0; k < nFrames; k++) {
      const t = (k * T) / nFrames;
      await page.evaluate((t) => window.SIM.render(t), t);
      shots.push({t, b64: (await page.screenshot({type: 'png'})).toString('base64')});
    }
  } catch (e) {
    console.log(`FAIL ${rel}: ${String(e.message).split('\n')[0]}`);
    await page.close();
    continue;
  }
  const cols = 4;
  const html = `<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},640px);gap:4px">${shots
    .map((s) => `<div style="position:relative"><img src="data:image/png;base64,${s.b64}" style="display:block"><span style="position:absolute;right:8px;bottom:6px;color:#ff0;font:bold 20px monospace;background:#000a;padding:2px 6px">t=${s.t.toFixed(2)}s</span></div>`)
    .join('')}</body>`;
  const rows = Math.ceil(shots.length / cols);
  await page.setViewportSize({width: cols * 640 + (cols - 1) * 4, height: rows * 400 + (rows - 1) * 4});
  await page.setContent(html);
  const out = path.join(outdir, rel.replace(/\//g, '__').replace(/\.html$/, '.png'));
  await page.screenshot({path: out, type: 'png'});
  await page.close();
  console.log(`sheet ${out}`);
}
await browser.close();
srv.close();
