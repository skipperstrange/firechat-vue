<template>
  <div>
    <BackgroundEffects />
    <div id="frame">
      <users-list />
      <chat-window />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ChatWindow from "../components/ChatWindow.vue";
import UsersList from "../components/UsersList.vue";
import BackgroundEffects from "./BackgroundEffects.vue";

export default {
  name: "Chat",
  components: {
    ChatWindow,
    UsersList,
    BackgroundEffects,
  },
};
</script>

<style></style>
