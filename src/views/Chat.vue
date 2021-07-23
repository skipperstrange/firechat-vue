<template>
  <div>
    <BackgroundEffects />
    <div id="frame">
      <users-list :user="user" />
      <chat-window />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ChatWindow from "../components/ChatWindow.vue";
import UsersList from "../components/UsersList.vue";
import BackgroundEffects from "./BackgroundEffects.vue";
import { mapGetters } from "vuex";

export default {
  name: "Chat",
  components: {
    ChatWindow,
    UsersList,
    BackgroundEffects,
  },

  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
};

console.log("Chat screen loaded...");
</script>

<style></style>
