// vue core
import { createApp } from "vue";
import App from "./App.vue";
// store, router, toaster
import { createPinia } from "pinia";
import router from "./router";
import Toast from "vue-toastification";
// css
import "./assets/styles.css";
import "vue-toastification/dist/index.css";
import "./assets/toast-custom.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast);

app.mount("#app");
