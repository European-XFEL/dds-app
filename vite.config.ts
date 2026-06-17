import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import lucidePreprocess from 'vite-plugin-lucide-preprocess';

import { sveltekit } from '@sveltejs/kit/vite';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
  },
  plugins: [
    isProd ? devtoolsJson() : null,
    lucidePreprocess(),
    tailwindcss(),
    sveltekit(),
    visualizer({
      emitFile: true,
      filename: 'stats.html',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  ],
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.svelte-kit/**',
        '**/.svelte-kit-static/**',
        '**/build/**',
        '**/build-static/**',
        '**/backend/**',
      ],
    },
  },
});
