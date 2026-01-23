import adapter from '@deno/svelte-adapter';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter(),
    alias: {
      $css: './src/app.css',
      $components: './src/components',
      $shadcn: './src/lib/shadcn/components',
      $data: './src/data',
    },
    experimental: {
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    runes: true,
    experimental: {
      async: false,
    },
  },
  extensions: ['.svelte', '.svx'],
};

export default config;
