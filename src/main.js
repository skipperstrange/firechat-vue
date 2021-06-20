import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueFormulate from "@braid/vue-formulate";
import firebaseConfig from "./firebaseConfig.js";
import firebase from "firebase";
import "animate.css";
import "@/assets/css/formulate.css";

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch("fetchUser", user);
});

Vue.use(VueFormulate);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
