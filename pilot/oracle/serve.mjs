// Static server rooted at the pilot dir (so /vendor/three.module.js resolves) + Playwright launcher (system Chrome).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Playwright: $TEARDOWN_DEPS, else pilot/node_modules (after `npm install` in pilot/), else the teardown skill's copy.
const LOCAL_DEPS = path.join(ROOT, 'node_modules');
const DEPS = process.env.TEARDOWN_DEPS || (fs.existsSync(path.join(LOCAL_DEPS, 'playwright')) ? LOCAL_DEPS : path.join(process.env.USERPROFILE || process.env.HOME, '.claude/skills/teardown/node_modules'));
const req = createRequire(path.join(DEPS, 'x.js'));
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.css': 'text/css'};

export function startServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((rq, rs) => {
      const p = path.join(ROOT, decodeURIComponent(new URL(rq.url, 'http://x').pathname));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
        rs.writeHead(404);
        return rs.end('not found');
      }
      rs.writeHead(200, {'content-type': TYPES[path.extname(p)] || 'application/octet-stream'});
      fs.createReadStream(p).pipe(rs);
    });
    srv.listen(0, '127.0.0.1', () => resolve({url: `http://127.0.0.1:${srv.address().port}`, close: () => srv.close()}));
  });
}

export async function launch() {
  const {chromium} = req('playwright');
  return chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist', '--force_high_performance_gpu'],
  });
}
