<template>
  <div class="auth-page">
    <div class="container-fluid">
      <div class="row no-gutter">
        <div class="col-md-6 d-none d-md-flex bg-image">
          <img src="../assets/udrawMLife.svg" alt="Login" />
        </div>
        <div class="col-md-6 bg-light">
          <div class="login d-flex align-items-center py-5">
            <div class="container">
              <div class="row">
                <div class="col-lg-10 col-xl-7 mx-auto">
                  <div class="login">
                    <Login />
                  </div>

                  <div class="register"></div>
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

export default {
  name: "Auth",
  components: {
    Login,
  },

  data: () => {
    return {
      loginView: true,
    };
  },
};
</script>

<style>
.login,
.image {
  min-height: 100vh;
}
.bg-image img {
  height: 48vh;
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
