import deno from "@deno/vite-plugin";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
  plugins: [
    lucidePreprocess(),
    tailwindcss(),
    sveltekit(),
    deno(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
  ],
});
