<template>
  <div id="frame">
    <users-list />
    <chat-window />
  </div>
</template>

<script>
// @ is an alias to /src
import ChatWindow from "../components/ChatWindow.vue";
import UsersList from "../components/UsersList.vue";

export default {
  name: "Chat",
  components: {
    ChatWindow,
    UsersList,
  },

  mounted() {
    this.$store.dispatch("authCheck").then(() => {
      this.$store.dispatch("segregateContacts");
    });
  },
};

console.log("Chat screen loaded...");
</script>

<style></style>
