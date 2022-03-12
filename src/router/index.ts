import { createRouter, createWebHistory } from "vue-router";
import multiguard from "vue-router-multiguard";

import NotFound from "../views/NotFound.vue";
import DashboardView from "../views/dashboards/Index.vue";
import ManageUserView from "../views/managements/users/Index.vue";
import ManageCategoryView from "../views/managements/categories/Index.vue";
import ManageUnitView from "../views/managements/units/Index.vue";
import LoginView from "@/components/LoginView.vue";
import RegisterView from "@/components/RegisterView.vue";

const web = (to: any, from: object, next: () => void) => {
  if (typeof localStorage.token_access !== "undefined") {
    return router.push({
      name: "dashboard",
    });
  }
  next();
};

const auth = (to: any, from: object, next: () => void) => {
  if (typeof localStorage.token_access === "undefined") {
    return router.push({
      name: "login",
    });
  }
  next();
};

const routes = [
  {
    path: "/",
    name: "web",
    redirect: { name: "login" },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    beforeEnter: multiguard([web]),
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    beforeEnter: multiguard([web]),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    beforeEnter: multiguard([auth]),
  },
  {
    path: "/manage/users",
    name: "manageUsers",
    component: ManageUserView,
    beforeEnter: multiguard([auth]),
  },
  {
    path: "/manage/categories",
    name: "manageCategories",
    component: ManageCategoryView,
    beforeEnter: multiguard([auth]),
  },
  {
    path: "/manage/units",
    name: "manageUnits",
    component: ManageUnitView,
    beforeEnter: multiguard([auth]),
  },
  {
    path: "/:catchAll(.*)",
    name: "404NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
