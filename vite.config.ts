import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { OutputAsset, OutputBundle } from "rollup";

const inlineCssPlugin = () => ({
  name: "inline-css",
  apply: "build" as const,
  enforce: "post" as const,
  generateBundle(_options: unknown, bundle: OutputBundle) {
    const htmlAsset = bundle["index.html"] as OutputAsset | undefined;

    if (!htmlAsset || htmlAsset.type !== "asset" || typeof htmlAsset.source !== "string") {
      return;
    }

    let html = htmlAsset.source;

    Object.entries(bundle).forEach(([fileName, asset]) => {
      if (!fileName.endsWith(".css") || asset.type !== "asset" || typeof asset.source !== "string") {
        return;
      }

      const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const stylesheetPattern = new RegExp(
        `<link rel="stylesheet" crossorigin href="/${escapedFileName}">`,
        "g",
      );

      html = html.replace(stylesheetPattern, `<style>${asset.source}</style>`);
      delete bundle[fileName];
    });

    htmlAsset.source = html;
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), inlineCssPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "helmet-vendor": ["react-helmet-async"],
          "supabase-vendor": ["@supabase/supabase-js"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
