import { createApp } from "vue";
import App from "./App.vue";
import router from "../router/index"; // Import the router instance
import "./style.css";

const app = createApp(App);

app.use(router);
app.mount("#app");
