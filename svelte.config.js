import adapter_deno from '@deno/svelte-adapter';
import adapter_static from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import process from "node:process";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  kit: {
    alias: {
      $css: './src/app.css',
      $components: './src/components',
      $shadcn: './src/lib/shadcn/components',
    },
    experimental: {
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    experimental: {
      async: false,
    },
  },
  extensions: ['.svelte', '.svx'],
};

const config_deno = {
  ...config,
  kit: {
    ...config.kit,
    adapter: adapter_deno(),
    alias: {
      ...config.kit?.alias,
      $remote: './src/lib/remote/dynamic.remote.ts',
    }
  },
};

const config_static = {
  ...config,
  kit: {
    ...config.kit,
    adapter: adapter_static({ fallback: '404.html' }),
    paths: {
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
    },
    alias: {
      ...config.kit?.alias,
      $remote: './src/lib/remote/static.remote.ts',
    }
  },
};

// Pick configuration: env var TARGET or CLI arg --target=*
const cliArg = process.argv.find((a) => a.startsWith('--target='));
const target = process.env.TARGET || (cliArg && cliArg.split('=')[1]) || 'deno';

/**
 * Export the selected config. Defaults to `config_deno` when nothing is set.
 */
const selectedConfig = target === 'static' ? config_static : config_deno;

console.log(`Using SvelteKit config for target: ${target}`);

export default selectedConfig;
