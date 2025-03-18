import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",

    sourcemap: true,
    emptyOutDir: true,

    target: false,

    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "index"
    }
  },
  esbuild: {
    keepNames: false,

    mangleProps: /^_/,
    mangleQuoted: true,
  },
})
