import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import vueDevTools from "vite-plugin-vue-devtools"; // Import the plugin

export default defineConfig({
  plugins: [vue(), tailwindcss(), vueDevTools()], // Add the plugin here
  server: {
    port: 3000,
    open: true,
  },
});
