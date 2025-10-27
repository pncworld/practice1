// eslint-disable-next-line no-unused-vars
import DashBoard from "@/views/DashBoard.vue";
import { createRouter, createWebHistory } from "vue-router";

import HomePage2 from "@/views/homePage2.vue";
import LoginView from "../views/LoginView.vue";
import accountRouter from "./accountRouter";
import exceptRouter from "./exceptRouter";
import masterRouter from "./masterRouter";
import miattendRouter from "./miattendRouter";
import micrmRouter from "./micrmRouter";
import mihrRouter from "./mihrRouter";
import minoticeRouter from "./minoticeRouter";
import miposRouter from "./miposRouter";
import mipurRouter from "./mipurRouter";
import mistockRouter from "./mistockRouter";
import mobileRouter from "./mobileRouter";
import salesRouter from "./salesRouter";
import systemRouter from "./systemRouter";

const isMobile = () => {
  const userAgent = window.navigator.userAgent;
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
};

const routes = [
  {
    path: "/",
    component: LoginView,
  },
  {
    path: "/VUEPOS",
    children: exceptRouter(),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashBoard,
  },
  {
    path: "/MISALES",
    //component : BasicLayout ,
    children: salesRouter(),
  },
  {
    path: "/MIMASTER",
    //component : BasicLayout ,
    children: masterRouter(),
  },
  {
    path: "/MIATTEND",
    //component : BasicLayout ,
    children: miattendRouter(),
  },
  {
    path: "/MICRM",
    //component : BasicLayout ,
    children: micrmRouter(),
  },
  {
    path: "/m",
    //component : BasicLayout ,
    children: mobileRouter(),
  },

  {
    path: "/homePage",
    name: "homePage",
    component: HomePage2,
  },
  {
    path: "/MIACCOUNT",
    //component : BasicLayout ,
    children: accountRouter(),
  },
  {
    path: "/MISYSTEM",
    children: systemRouter(),
  },
  {
    path: "/MINOTICE",
    children: minoticeRouter(),
  },
  {
    path: "/MIHR",
    children: mihrRouter(),
  },
  {
    path: "/MIPOS",
    //component : BasicLayout ,
    children: miposRouter(),
  },
  {
    path: "/MISTOCK",
    //component : BasicLayout ,
    children: mistockRouter(),
  },
  {
    path: "/MIPUR",
    //component : BasicLayout ,
    children: mipurRouter(),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // 사용자가 '/' 경로로 접근할 때
  if (to.path === "/" && isMobile()) {
    next("/m"); // 모바일이라면 '/m' 경로로 리디렉션
  } else {
    next(); // 그 외에는 그대로 진행
  }
});

export default router;
