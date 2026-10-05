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
      input: resolve(process.cwd(), "deploy-ui/index.html"),
    },
  },
});
