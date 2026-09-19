// Why: cms:dev is ONE command to start Astro and open the Sveltia panel.
// Sveltia edits the selected local Git repository directly, so no proxy is required.
import { spawn } from 'node:child_process';
import http from 'node:http';

const ROOT = process.cwd();

// Checks whether OUR dev server (the one with the CMS panel) is running on the port.
// It is not enough that the port responds: other projects (tom-ros, Marek-Jodlowski)
// they also keep dev servers on 4321/4322. We verify using /admin/index.html,
// which only exists in the project with Sveltia CMS.
function checkCmsReady(port) {
  return new Promise((resolve) => {
    const req = http.get(
      { host: '127.0.0.1', port, path: '/admin/index.html', timeout: 800 },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve(res.statusCode === 200 && body.includes('@sveltia/cms'));
        });
        res.destroy();
      },
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Waits until our dev server is up (max 30 s), checking /admin/index.html.
async function waitForDevServer(ports) {
  for (let i = 0; i < 30; i++) {
    for (const p of ports) {
      if (await checkCmsReady(p)) return p;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return null;
}

async function main() {
  // Reuse a running server only when its /admin/index.html belongs to this project.
  // Otherwise, start a new Astro dev server.
  const COMMON_PORTS = [4321, 4322, 4323, 4324];
  let port = null;
  for (const p of COMMON_PORTS) {
    if (await checkCmsReady(p)) {
      port = p;
      break;
    }
  }

  let dev = null;
  if (port) {
    console.log(`✅ Dev server już działa na porcie ${port}`);
  } else {
    console.log('🚀 Uruchamianie dev servera Astro...');
    dev = spawn('npx', ['astro', 'dev', '--host', '127.0.0.1'], {
      stdio: 'inherit',
      cwd: ROOT,
      shell: process.platform === 'win32',
    });
    port = await waitForDevServer(COMMON_PORTS);
  }

  const url = `http://localhost:${port || 4321}/admin/`;
  console.log(`\n📋 Panel CMS: ${url}`);
  console.log('   W panelu wybierz „Work with Local Repository”, aby wskazać folder repozytorium.');

  // Open the panel in your default browser.
  const opener = spawn(
    process.platform === 'win32' ? 'cmd' : 'xdg-open',
    process.platform === 'win32' ? ['/c', 'start', '', url] : [url],
    { stdio: 'ignore', detached: true },
  );
  opener.unref();

  // Using Ctrl+C we clean up both processes so that they do not hang in the background.
  const shutdown = () => {
    try {
      if (dev) dev.kill();
    } catch {}
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
