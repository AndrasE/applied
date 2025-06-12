import { createApp } from "vue";
import App from "./App.vue";
import { app as firebaseApp } from "./config/firebase";
import router from "./router";
import "./assets/styles.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
