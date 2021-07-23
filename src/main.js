import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";
import Toasted from "vue-toasted";
import VueFormulate from "@braid/vue-formulate";
import VueChatScroll from "vue-chat-scroll";
import firebaseConfig from "./firebaseConfig.js";
import toasterOptions from "./toasterOptions.js";
import firebase from "firebase";
import "animate.css";
import "@/assets/css/formulate.css";

//exports
export const eventBus = new Vue();

firebase.initializeApp(firebaseConfig);

Vue.use(VueChatScroll);
Vue.use(Toasted, toasterOptions);
Vue.use(VueFormulate);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
