<template>
  <div id="frame" class="auth-page">
    <div class="container">
      <div class="row no-gutter">
        <div class="col-lg-6 d-mlg-flex bg-image md-hidden">
          <img src="../assets/img/udrawMLife.svg" alt="Login" />
        </div>
        <div class="col-md-6 pane">
          <div class="login d-flex align-items-center py-5">
            <div class="container">
              <div class="row">
                <div class="col-lg-10 col-xl-7 mx-auto">
                  <div v-if="loginView" class="login">
                    <Login />
                    Dont have an account?
                    <a href="#" @click="loginView = !loginView">Register</a>
                  </div>

                  <div v-if="!loginView" class="register">
                    <Register />
                    Already a member?
                    <a href="#" @click="loginView = !loginView">Sign In</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import { eventBus } from "../main";

export default {
  name: "Auth",
  components: {
    Login,
    Register,
  },

  data: () => {
    return {
      loginView: true,
    };
  },

  mounted() {
    if (this.$route.query.loginState === "reg") {
      this.loginView = false;
    }
  },

  created() {
    eventBus.$on("loggedout", () => {
      this.$store.dispatch("logout");
      this.$router.replace({ name: "Home" });
    });
  },
};
</script>

<style>
.pane {
  background: #fff;
  height: 100vh;
}

.image {
  min-height: 100%;
}
.bg-image img {
  height: 30vh;
  margin: 30vh auto;
}

.formulate-input .formulate-input-element {
  max-width: 100%;
}

.formulate-input[data-classification="button"] button {
  width: 100%;
  display: block;
}
</style>
