<script>

export default {
    name: "Logout",

    mounted (){
    this.$store.dispatch("logout");
    this.$router.replace({ name: "Home" });
    }
}
</script>