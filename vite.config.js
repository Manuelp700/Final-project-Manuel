import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    hmr: { overlay: false }, // evita el overlay bloqueante
    proxy: {
      // Proxy de API y Admin al backend en 3001
      "/api": { target: "http://localhost:3001", changeOrigin: true },
      "/admin": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
  build: {
    outDir: "dist",
  },
});
