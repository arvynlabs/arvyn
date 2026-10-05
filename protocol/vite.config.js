import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  css: {
    postcss: {
      plugins: [],
    },
  },
  build: {
    rollupOptions: {
      input: {
        deploy: resolve(process.cwd(), "deploy-ui/index.html"),
        execute: resolve(process.cwd(), "execute-ui/index.html"),
      },
    },
  },
});
