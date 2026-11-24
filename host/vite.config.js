import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Remote URLs can be replaced at build time for independently deployed environments.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      federation({
        name: "host",
        // Type artifact generation is TypeScript-oriented; this learning project is JavaScript-only.
        dts: false,
        remotes: {
          products: {
            type: "module",
            name: "products",
            entry:
              env.VITE_PRODUCTS_REMOTE_ENTRY ??
              "http://localhost:5001/remoteEntry.js",
            entryGlobalName: "products",
            shareScope: "default",
          },
          cart: {
            type: "module",
            name: "cart",
            entry:
              env.VITE_CART_REMOTE_ENTRY ??
              "http://localhost:5002/remoteEntry.js",
            entryGlobalName: "cart",
            shareScope: "default",
          },
        },
        // Singleton React instances prevent hooks/context from crossing incompatible copies.
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
      port: 5000,
      strictPort: true,
    },
    preview: {
      port: 5000,
      strictPort: true,
    },
    build: {
      // Federation's ESM runtime uses features supported by modern browsers.
      target: "chrome89",
    },
  };
});
