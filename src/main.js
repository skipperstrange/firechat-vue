import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueFormulate from "@braid/vue-formulate";

import "animate.css";
import "@/assets/formulate.css";

Vue.use(VueFormulate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
