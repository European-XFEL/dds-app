import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import lucidePreprocess from 'vite-plugin-lucide-preprocess';

import { sveltekit } from '@sveltejs/kit/vite';

const isProd = process.env.NODE_ENV === 'production';

const enableServiceWorker = process.env.ENABLE_SERVICE_WORKER === 'true';

const disabledRoutes = process.env.DISABLED_ROUTES
  ? process.env.DISABLED_ROUTES.split(',')
  : ['(app)/flow'];


function stubDisabledRoute(disabledRoute: string) {
  return {
    name: `stub-disabled-${disabledRoute}-routes`,
    enforce: 'pre' as const,
    load(id: string) {
      // Vite may append query parameters to module IDs
      const cleanId = id.split('?', 1)[0];

      const isDisabledRouteModule =
        cleanId.includes(`/routes/${disabledRoute}/`) ||
        cleanId.includes(`\\routes\\${disabledRoute}\\`);

      if (!isDisabledRouteModule) {
        return;
      }

      if (cleanId.endsWith('.svelte')) {
        console.log(`Stubbing out route ${disabledRoute} component ${cleanId}`);

        return `
          <h1>Disabled route</h1>
        `;
      }

      return;
    },
  };
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
  },
  plugins: [
    isProd ? devtoolsJson() : null,
    lucidePreprocess(),
    tailwindcss(),
    sveltekit(),
    ...disabledRoutes.map(stubDisabledRoute),
    SvelteKitPWA({
      disable: !enableServiceWorker,
      mode: isProd ? 'production' : 'development',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'XSS App',
        short_name: 'XSS',
        description: 'X-ray Solution Scattering simulation app',
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
