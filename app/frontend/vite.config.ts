import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // frontend/vite.config.ts

// This must match your backend's DEVELOPMENT port defined in config.ts
const BACKEND_DEV_PORT = 3001;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Your frontend development server port (e.g., 3000 or 5173)
    proxy: {
      "/api": {
        target: `http://localhost:${BACKEND_DEV_PORT}`,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // Often not needed if backend routes start with /api
        ws: true, // Crucial for websockets (Socket.IO)
      },
      // If Socket.IO specific path is needed
      "/socket.io": {
        target: `ws://localhost:${BACKEND_DEV_PORT}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist", // Ensure this matches what your backend is serving
  },
});
