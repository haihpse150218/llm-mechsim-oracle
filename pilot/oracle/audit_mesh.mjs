// Mesh-vs-marker audit (post-hoc, does not change oracle verdicts).
// Question: do the "<part>@<point>" markers the oracle reads actually sit on, and move with, the drawn geometry?
// For each marker, over 60 samples of one input revolution:
//   drift = min over the part's meshes of max_t |marker position in that mesh's local frame - its value at t0|
//           (0 when the marker is rigidly attached to at least one mesh of its part)
//   gap   = max_t of the XY distance from the marker to the nearest vertex of the part's meshes
// Usage: node oracle/audit_mesh.mjs [--out file.jsonl] file.html ...
import fs from 'node:fs';
import path from 'node:path';
import {startServer, launch, ROOT} from './serve.mjs';
import {LITE_SPECS} from './lite_specs.mjs';
import {mechOfLite} from './run_oracle_lite.mjs';
import {AUDIT} from './drift.mjs';


async function main() {
  const argv = process.argv.slice(2);
  const oi = argv.indexOf('--out');
  const outFile = oi >= 0 ? argv.splice(oi, 2)[1] : null;
  const srv = await startServer();
  const browser = await launch();
  const ctx = await browser.newContext({viewport: {width: 640, height: 400}});
  for (const f of argv) {
    const abs = path.resolve(f), rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    const id = mechOfLite(abs);
    const page = await ctx.newPage();
    let rec = {file: rel, mech: id};
    try {
      await page.goto(`${srv.url}/${rel}?capture`, {waitUntil: 'load', timeout: 20000});
      await page.waitForFunction(() => window.SIM_READY === true, null, {timeout: 15000});
      const params = await page.evaluate(() => JSON.parse(JSON.stringify(window.SIM.params)));
      const parts = LITE_SPECS[id].parts(params);
      const T = (2 * Math.PI) / Math.abs(params.omega);
      const ts = Array.from({length: 60}, (_, k) => (k * T) / 60 + 0.0123 * T);
      await page.evaluate(AUDIT);
      rec.markers = await page.evaluate(([ts, parts]) => window.__audit(ts, parts), [ts, parts]);
      const ms = Object.entries(rec.markers);
      rec.maxDrift = Math.max(0, ...ms.map(([, r]) => r.drift ?? 0));
      rec.maxGap = Math.max(0, ...ms.filter(([n]) => !n.startsWith('frame@')).map(([, r]) => r.gap));
      rec.noMesh = ms.filter(([, r]) => r.meshes === 0).map(([n]) => n);
      const worst = ms.filter(([n]) => !n.startsWith('frame@')).sort((a, b) => b[1].gap - a[1].gap)[0];
      rec.worstGap = worst && worst[0];
    } catch (e) {
      rec.error = String(e.message).split('\n')[0];
    }
    await page.close();
    if (outFile) fs.appendFileSync(outFile, JSON.stringify(rec) + '\n');
    console.log(rec.error ? `ERR  ${rel} ${rec.error}` :
      `${rel.padEnd(60)} drift ${rec.maxDrift.toFixed(2)}  gap ${rec.maxGap.toFixed(1)} (${rec.worstGap})${rec.noMesh.length ? '  noMesh:' + rec.noMesh.join(',') : ''}`);
  }
  await browser.close();
  srv.close();
}
main();
