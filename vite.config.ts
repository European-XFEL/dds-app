import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
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
    SvelteKitPWA({
      mode: isProd ? 'production' : 'development',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'XSS App',
        short_name: 'XSS',
        description: 'X-ay solution scattering simulation app',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: isProd,
        type: 'module',
      },
    }),
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
        '**/build/**',
        '**/backend/**',
      ],
    },
  },
});
