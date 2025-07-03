// vite.config.ts: Vite configuration for the Vue 3 application
// - Sets up plugins for Vue, devtools, Tailwind CSS, and PWA support
// - Configures path alias for '@' to 'src/'
// - Sets dev server options (port, open browser)
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), // Vue 3 SFC support
    vueDevTools(), // Vue Devtools integration
    tailwindcss(), // Tailwind CSS support
    VitePWA({ registerType: "autoUpdate" }), // PWA plugin with auto-update
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // '@' alias for src
    },
  },
  server: {
    port: 3000, // Dev server port
    open: true, // Open browser on server start
  },
});
