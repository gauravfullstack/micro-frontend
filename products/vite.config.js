import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    federation({
      name: "products",
      dts: false,
      filename: "remoteEntry.js",
      exposes: {
        // This is the product feature the host loads; its props form the integration contract.
        "./ProductList": "./src/ProductList.jsx",
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
    port: 5001,
    strictPort: true,
    origin: "http://localhost:5001",
  },
  preview: {
    port: 5001,
    strictPort: true,
  },
  build: {
    target: "chrome89",
  },
});
