import { createRouter, createWebHistory } from "vue-router";

const baseUrl = import.meta.env.VITE_BUILD_ADDRESS;

const defaultLayout = import("@/layouts/Default.vue");
const pageLayout = import("@/layouts/Page.vue");

export const routes = [
  {
    path: `${baseUrl}/`,
    component: () => defaultLayout,
    children: [
      { path: "", name: "Home", component: () => import("@/views/Home.vue") }
    ],
  },
  {
    path: `${baseUrl}/about`,
    component: () => pageLayout,
    children: [
      { path: "", name: "About", component: () => import("@/views/About.vue") }
    ],
  },
  {
    path: `${baseUrl}/contacts`,
    component: () => pageLayout,
    children: [
      { path: "", name: "Contacts", component: () => import("@/views/Contacts.vue") },
    ],
  },
  {
    path: `${baseUrl}/test`,
    component: () => pageLayout,
    children: [
      { path: "", name: "Test", component: () => import("@/views/Test.vue") },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
