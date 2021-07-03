<template>
  <div id="frame">
    <users-list
      :user="this.user"
      :contacts="this.contacts"
      @buddySelected="setBuddy($event)"
    />
    <chat-window :user="this.user" />
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
import ChatWindow from "../components/ChatWindow.vue";
import UsersList from "../components/UsersList.vue";

export default {
  name: "Chat",
  components: {
    ChatWindow,
    UsersList,
  },

  data: () => {
    return {
      user: {},
      contacts: this.$store.getters.contacts(),
      buddy: {},
    };
  },

  mounted() {},

  methods: {
    setBuddy(buddy) {
      this.buddy = buddy;
    },
  },

  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
      contacts: "contacts",
    }),
  },

  created() {},
};
</script>

<style></style>
