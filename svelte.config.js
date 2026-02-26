import adapter_deno from "@deno/svelte-adapter";
import adapter_static from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import process from "node:process";
import { execSync } from "node:child_process";

const TARGET = process.env.PUBLIC_TARGET;
const STATIC = TARGET === 'static';

function gitVersion() {
  try {
    const gv = execSync('git describe --tags --always --dirty --long', {
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString().trim();
    return `${TARGET}-${gv}`;
  } catch (err) {
    console.log(err)
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
      $css: "./src/app.css",
      $components: "./src/components",
      $shadcn: "./src/lib/shadcn/components",
    },
    experimental: {
      remoteFunctions: true,
    },
    serviceWorker: {
      register: true,
    },
    csrf: {
      trustedOrigins: ["https://exfldadev01.desy.de", "https://european-xfel.github.io"],
    },
    version: {name: VERSION},
    outDir: STATIC ? ".svelte-kit-static" : ".svelte-kit",
  },
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
  extensions: [".svelte", ".svx"],
};

const config_deno = {
  ...config,
  kit: {
    ...config.kit,
    adapter: adapter_deno(),
    alias: {
      ...config.kit?.alias,
      $remote: "./src/lib/remote/dynamic.remote.ts",
    },
    prerender: {
      entries: ["/", "/docs", "/experiment/detector", "/experiment/pump-probe"]
    }
  },
};

const config_static = {
  ...config,
  kit: {
    ...config.kit,
    adapter: adapter_static(),
    alias: {
      ...config.kit?.alias,
      $remote: "./src/lib/remote/static.remote.ts",
    }
  },
};


/**
 * Export the selected config. Defaults to `config_deno` when nothing is set.
 */
const selectedConfig = STATIC ? config_static : config_deno;

console.log(`Target: ${TARGET}, Version: ${VERSION}`);

export default selectedConfig;
