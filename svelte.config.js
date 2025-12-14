import adapter from '@sveltejs/adapter-static';
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

export default config;
