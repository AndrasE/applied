// Vue Router configuration: defines all application routes
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Application routes
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/jobs",
      name: "jobs",
      component: () => import("@/views/JobsView.vue"),
    },
    {
      path: "/jobs/:id",
      name: "jobDetail",
      component: () => import("@/views/JobView.vue"),
    },
    {
      path: "/jobs/:id/update",
      name: "update",
      component: () => import("@/views/UpdateView.vue"),
    },
    {
      path: "/add",
      name: "add",
      component: () => import("@/views/AddView.vue"),
    },
    {
      path: "/stats",
      name: "stats",
      component: () => import("../views/StatsView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
