import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Chat from "../views/Chat.vue";
import Auth from "@/components/Auth.vue";
import Logout from "@/components/Logout.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      if (store.getters.user.loggedIn === false) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/about",
    name: "About",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/",
    name: "Chat",
    component: Chat,
    beforeEnter: (to, from, next) => {
      if (store.getters.user.loggedIn === false) {
        next("/home");
      } else {
        next();
      }
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    beforeEnter: (to, from, next) => {
      if (store.getters.user.loggedIn === false) {
        next("/home");
      } else {
        next();
      }
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    beforeEnter: (to, from, next) => {
      if (store.getters.user.loggedIn === false) {
        next();
      } else {
        next("/");
      }
    },
  },

  {
    path: "*",
    component: () => import("../views/missing.vue"),
  },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("../views/missing.vue"),
  });
}

const router = new VueRouter({
  routes,
});

export default router;
