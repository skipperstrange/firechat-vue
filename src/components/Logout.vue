<script>
export default {
  name: "Logout",

  created() {
    this.$store.dispatch("logout").then(() => {
      this.$router.replace({ name: "Home" });
    });
  },
};
</script>
