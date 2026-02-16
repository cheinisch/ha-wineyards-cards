import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "wineyards.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});