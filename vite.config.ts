import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "wineyards.js"
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: { inlineDynamicImports: true }
    }
  }
});