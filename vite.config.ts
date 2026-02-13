import deno from '@deno/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import lucidePreprocess from 'vite-plugin-lucide-preprocess';

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
    deno(),
    visualizer({
      emitFile: true,
      filename: 'stats.html',
    }),
  ],
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.svelte-kit/**',
        '**/build/**',
        '**/backend/**',
      ],
    },
  },
});
