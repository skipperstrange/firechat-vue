<template>
  <div>
    <div class="caption center-block text-center">
      <div class="logos">
        <img src="../assets/img/logo.png" alt="" />
        <img src="../assets/img/firebase-logo.png" alt="" />
      </div>
      <h3>Fire Chat Vue</h3>
      <p class="mb-3">
        A demo chat application using firebase and vuejs. Docs will be published
        soon.
      </p>

      <p class="mb-2">
        <a
          class="badge badge-pill badge-dark"
          href="https://github.com/skipperstrange/firechat-vue"
          ><!--i class="fa fa-github"  aria-hidden="true"> </i-->
          Visit repo on github
        </a>
      </p>

      <router-link class="btn btn-success" to="/auth">Sign In</router-link>
      <router-link
        class="btn btn-info"
        :to="{ name: 'Auth', query: { loginState: 'reg' } }"
        >Sign Up</router-link
      >
    </div>
  </div>
</template>

<script scoped>
export default {
  name: "Home",
  components: {},
};
</script>

<style>
.caption h3 {
  color: #fff;
}
.btn {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
}

.caption a {
}
</style>
