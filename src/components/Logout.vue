<template>
  <div></div>
</template>
<script>
export default {
  name: "Logout",

  mounted() {
    console.log("Logging out...");
    this.$store.dispatch("logout").then((success) => {
      console.log(success);
    });
    this.$router.replace({ name: "Home" });
  },
};
</script>