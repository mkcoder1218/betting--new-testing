import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react/jsx-runtime": "react/jsx-runtime",
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore specific warning codes
        if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
        if (warning.code === "THIS_IS_UNDEFINED") return;
        // Use default for everything else
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    exclude: ["chunk-H2Z55PQF.js"],
  },
});
