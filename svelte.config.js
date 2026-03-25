import { execSync } from 'node:child_process';
import process from 'node:process';

import adapter_node from '@sveltejs/adapter-node';
import adapter_static from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const TARGET = process.env.PUBLIC_TARGET;
const STATIC = TARGET === 'static';
const enableServiceWorker = process.env.ENABLE_SERVICE_WORKER === 'true';

function gitVersion() {
  try {
    const gv = execSync('git describe --tags --always --dirty --long', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    return `${TARGET}-${gv}`;
  } catch (err) {
    console.log(err);
    return process.env.PUBLIC_APP_VERSION ?? undefined;
  }
}

const VERSION = gitVersion();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  kit: {
    paths: {
      base: process.env.PUBLIC_BASE_PATH,
    },
    alias: {
      $css: './src/app.css',
      $components: './src/components',
      $shadcn: './src/lib/shadcn/components',
      $remote: "./src/lib/remote/remote.ts",
    },
    experimental: {
      remoteFunctions: true,
    },
    serviceWorker: {
      register: enableServiceWorker,
    },
    csrf: {
      trustedOrigins: [
        'https://exfldadev01.desy.de',
        'https://european-xfel.github.io',
      ],
    },
    version: { name: VERSION },
    outDir: STATIC ? '.svelte-kit-static' : '.svelte-kit',
  },
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
  extensions: ['.svelte', '.svx'],
};

const config_node = {
  ...config,
  kit: {
    ...config.kit,
    adapter: adapter_node(),
    prerender: {
      entries: ['/', '/docs', '/experiment/detector', '/experiment/pump-probe'],
    },
  },
};

const config_static = {
  ...config,
  kit: {
    ...config.kit,
    adapter: adapter_static(),
  },
};

/**
 * Export the selected config. Defaults to `config_deno` when nothing is set.
 */
const selectedConfig = STATIC ? config_static : config_node;

console.log(`Target: ${TARGET}, Version: ${VERSION}`);

export default selectedConfig;
