<script>
export default {
  name: "Logout",

  mounted() {
    console.log("Logging out...");
    this.$store.dispatch("logout");
    this.$router.replace({ name: "Home" });
  },
};
</script>
