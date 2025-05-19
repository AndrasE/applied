import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import JobsView from "@/views/JobsView.vue";
import JobView from "@/views/JobView.vue";
import AddView from "@/views/AddView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/jobs",
      name: "jobs",
      component: JobsView,
    },
    {
      path: "/add",
      name: "add",
      component: AddView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/jobs/:id",
      name: "job",
      component: JobView,
    },
  ],
});

export default router;
