// src/main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import Toast from "vue-toastification";
import router from "./router";
// CSS
import "vue-toastification/dist/index.css";
import "./assets/styles.css";
import "./assets/toast-custom.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast);

app.mount("#app");
