<template>
  <div class="home">
    <h1>Landing Page</h1>
    <router-link to="/auth">Sign In</router-link> |
    <router-link :to="{ name: 'Auth', query: { loginState: 'reg' } }"
      >Sign Up</router-link
    >
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>
