import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: "/add",
      name: "add",
      component: () => import("@/views/AddView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/jobs/:id",
      name: "job",
      component: () => import("@/views/JobView.vue"),
    },
    {
      path: "/jobs/:id/edit",
      name: "job",
      component: () => import("@/views/UpdateView.vue"),
    },
  ],
});

export default router;
