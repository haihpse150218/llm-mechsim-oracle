// Shared mesh-vs-marker drift probe (used by audit_mesh.mjs and as a META check in run_oracle_lite.mjs).
// window.__audit(ts, parts) -> {'<part>@<pt>': {meshes, drift (min over the part's meshes of max displacement in mesh-local frame), gap}}
export const AUDIT = `window.__audit = (ts, parts) => {
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
