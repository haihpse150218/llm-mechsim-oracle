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

const AUDIT = `window.__audit = (ts, parts) => {
  const V = SIM.scene.position.constructor, M4 = SIM.scene.matrixWorld.constructor;
  const res = {};
  // geometry of the part, excluding anything at or under a marker object (markers may themselves be small meshes)
  const underMarker = (c, root) => { for (let o = c; o && o !== root; o = o.parent) if (o.name && o.name.includes('@')) return true; return false; };
  const meshesOf = (o) => { const a = []; o.traverse((c) => { if (c.isMesh && c.geometry?.attributes?.position && !underMarker(c, o)) a.push(c); }); return a; };
  const first = {};
  for (const t of ts) {
    SIM.render(t);
    SIM.scene.updateMatrixWorld(true);
    for (const [p, pts] of Object.entries(parts)) {
      const part = SIM.scene.getObjectByName(p);
      if (!part) continue;
      const ms = meshesOf(part);
      for (const x of pts) {
        const name = p + '@' + x, mk = SIM.scene.getObjectByName(name);
        if (!mk) continue;
        const r = (res[name] ||= {meshes: ms.length, drift: ms.map(() => 0), gap: 0});
        const w = new V(); mk.getWorldPosition(w);
        ms.forEach((m, i) => {
          const inv = new M4().copy(m.matrixWorld).invert();
          const l = w.clone().applyMatrix4(inv);
          const k = name + '#' + i;
          if (!first[k]) first[k] = l; else r.drift[i] = Math.max(r.drift[i], l.distanceTo(first[k]));
        });
        let best = Infinity; const v = new V();
        for (const m of ms) {
          const pa = m.geometry.attributes.position, step = Math.max(1, Math.floor(pa.count / 3000));
          for (let i = 0; i < pa.count; i += step) {
            v.fromBufferAttribute(pa, i).applyMatrix4(m.matrixWorld);
            const d = Math.hypot(v.x - w.x, v.y - w.y);
            if (d < best) best = d;
          }
        }
        r.gap = Math.max(r.gap, best);
      }
    }
  }
  for (const r of Object.values(res)) r.drift = r.drift.length ? Math.min(...r.drift) : null;
  return res;
};`;

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
