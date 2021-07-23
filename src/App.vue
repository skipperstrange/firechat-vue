<template>
  <main id="app" class="">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
      crossorigin="anonymous"
    />

    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <router-view></router-view>
    </transition>
  </main>
</template>

<script>
//importing bootstrap 5 Modules
import "./assets/css/bootstrap4.css";
import "./assets/css/App.css";
import "./assets/css/app-chat.css";

export default {
  name: "App",

  methods: {},

  mounted() {
    this.$store.dispatch("authCheck");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#frame {
  background-image: url("./assets/img/chat-bg.svg") repeat;
}
</style>
