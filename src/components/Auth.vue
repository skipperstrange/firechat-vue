<template>
  <div>
    <div id="frame" class="auth-page">
      <div class="container">
        <div class="row no-gutter">
          <div class="col-lg-5 col-lg-4 bg-image d-lg-block d-sm-none d-none">
            <img src="../assets/img/undrawPride.svg" alt="Login" />
          </div>
          <div
            class="col-lg-7 pane"
            style="overflow-y: auto; -webkit-scrollbar: none"
          >
            <div class="login d-flex align-items-center py-5">
              <div class="container">
                <div class="col-lg-10 col-xl-7 mx-auto">
                  <div v-if="loginView" class="login">
                    <div v-if="passwordReset == false">
                      <Login />
                      <div>
                        <a @click="passwordResetToggle()">Forgot Password?</a>
                      </div>
                    </div>
                    <div v-if="passwordReset == true">
                      <ForgotPassword />
                      <div><a @click="passwordResetToggle()">Login</a></div>
                    </div>
                    Dont have an account?
                    <a
                      href="#"
                      class="text-primary"
                      @click="loginView = !loginView"
                      >Register</a
                    >
                  </div>

                  <div v-if="!loginView" class="register mb-2">
                    <Register />
                    Already a member?
                    <a
                      href="#"
                      class="text-primary"
                      @click="loginView = !loginView"
                      >Sign In</a
                    >
                  </div>
                  <div style="margin: 2em auto">
                    <router-link class="text-primary" to="/home"
                      ><i class="fa fa-arrow-left"></i> Home</router-link
                    >
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
// @ is an alias to /
import Login from "@/components/Login.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import Register from "@/components/Register.vue";
import { eventBus } from "../main";

export default {
  name: "Auth",
  components: {
    Login,
    Register,
    ForgotPassword,
  },

  data: () => {
    return {
      loginView: true,
      passwordReset: false,
    };
  },

  methods: {
    passwordResetToggle() {
      this.passwordReset = !this.passwordReset;
    },
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
  width: 100%;
}

.image {
  min-height: 100%;
}
.bg-image img {
  height: 30vh;
  margin: 30vh auto;
  margin-left: 3rem;
}

.formulate-input .formulate-input-element {
  max-width: 100%;
}

.formulate-input[data-classification="button"] button {
  width: 100%;
  display: block;
}
</style>
