// Main entry point: sets up Vue app, plugins, global styles, and mounts the app.
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import Toast from "vue-toastification";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";

// CSS
import "vue-toastification/dist/index.css";
import "./assets/styles.css";
import "./assets/toast-custom.css";
import "./assets/apex-charts-overrides.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast);
app.component("apexchart", VueApexCharts);

app.mount("#app");
