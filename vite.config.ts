import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

function getHttpsConfig(): true | { key: Buffer; cert: Buffer } {
  try {
    const certDir = join(homedir(), '.office-addin-dev-certs');
    const key = readFileSync(join(certDir, 'localhost.key'));
    const cert = readFileSync(join(certDir, 'localhost.crt'));
    return { key, cert };
  } catch {
    return true; // fallback to self-signed if specific cert not found
  }
}

export default defineConfig({
  server: {
    https: getHttpsConfig(),
    port: 3000,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: {
        taskpane: 'taskpane.html',
        commands: 'commands.html'
      }
    }
  }
});


