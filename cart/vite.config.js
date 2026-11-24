import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    federation({
      name: "cart",
      dts: false,
      filename: "remoteEntry.js",
      exposes: {
        // The cart stays a presentational feature; its items arrive from the host.
        "./Cart": "./src/Cart.jsx",
      },
      shared: {
        react: { singleton: true },
        "react/": { singleton: true },
        "react-dom": { singleton: true },
        "react-dom/": { singleton: true },
      },
    }),
    react(),
  ],
  server: {
    port: 5002,
    strictPort: true,
    origin: "http://localhost:5002",
  },
  preview: {
    port: 5002,
    strictPort: true,
  },
  build: {
    target: "chrome89",
  },
});
