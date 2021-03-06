<template>
  <div class="content" v-if="active">
    <div class="contact-profile container">
      <img :src="buddy.photoURL" alt="" />
      <p>{{ buddy.displayName }}</p>

      <span
        v-if="buddy.blocked == true"
        class="ban"
        style="color: red"
        title="Unblock this contact."
        ><a @click="unblockContact(buddy)"><i class="fa fa-ban"></i></a
      ></span>
      <span v-else class="ban" title="Block this contact."
        ><a @click="blockContact(buddy)"><i class="fa fa-ban"></i></a
      ></span>
    </div>
    <div class="messages" v-if="messages" v-chat-scroll="{ enable: true }">
      <ul>
        <li
          v-for="message in messages"
          :key="message.key"
          :class="
            'animate__animated animate__faster ' +
            message.direction +
            ' ' +
            directionAnimation[message.direction]
          "
        >
          <span v-if="message.direction == 'sent'">
            <img :src="user.data.photoURL" alt="" />
          </span>

          <span v-if="message.direction == 'replied'">
            <img :src="buddy.photoURL" alt="" />
          </span>
          <p>
            {{ message.message }}
            <br />
            <small class="time-ago"
              ><time-ago
                :refresh="60"
                :datetime="message.when"
                locale="en"
                tooltip
              ></time-ago
            ></small>
          </p>
        </li>
      </ul>
    </div>

    <div class="message-input">
      <div class="wrap">
        <form @submit="sendMessage" style="height: 100%">
          <input
            type="text"
            placeholder="Write your message..."
            required
            v-model="newMessage.body"
          />
          <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
          <button type="submit" class="submit">
            <i class="fa fa-paper-plane" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
  <div class="no-buddy" v-else>
    <div class="container">
      <img src="../assets/img/undrawQuickChat.svg" />
      <h2>Select a buddy to chat</h2>
      <!--h2>
        Or
        <a @click="refresh()"
          ><i class="fa fa-refresh"></i> Click here to see availible users.</a
        >
      </h2-->
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import { TimeAgo } from "vue2-timeago";
import firebase from "firebase";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ChatWindow",
  components: {
    TimeAgo,
  },
  data: () => {
    return {
      newMessage: {},
      active: false,
      directionAnimation: {
        replied: "animate__backInRight",
        sent: "animate__backInLeft",
        buddy: {},
      },
    };
  },

  mounted() {
    eventBus.$on("buddySelected", (buddy) => {
      try {
        this.buddy = buddy;
        this.active = true;
        this.refreshBuddyMessages(this.buddy);
      } catch (e) {
        console.log(e);
      }
    });
  },

  methods: {
    async dispatchMessage(sender, reciever, direction) {
      var message = {
        message: this.newMessage.body,
        direction: direction,
        when: Date.now(),
      };

      await firebase
        .database()
        .ref("chats/" + sender + "/" + reciever + "/messages/")
        .push(message)
        .then(() => {})
        .catch((e) => {
          this.$toasted.error(e.message).goAway(3000);
        });
    },

    sendMessage() {
      if (this.newMessage.body.trim() !== "") {
        this.dispatchMessage(
          this.user.data.uid,
          this.buddy.uid,
          "replied"
        ).then(() => {
          this.dispatchMessage(this.buddy.uid, this.user.data.uid, "sent").then(
            () => {
              this.newMessage.body = "";
            }
          );
        });
      } else {
        this.$toasted.error("Cant't send an empty message").goAway(3000);
      }
    },

    blockContact(buddy) {
      firebase
        .database()
        .ref(
          "accounts/" +
            this.user.data.uid +
            "/" +
            "blockedcontacts/" +
            buddy.uid
        )
        .set({ blocked: true })
        .then(() => {
          eventBus.$emit("refreshAllContacts", buddy);
          this.$toasted
            .success(
              "You have just blocked " +
                buddy.displayName +
                ". You will not be visible to this contact.<br> Go to blocked contacts to unblock."
            )
            .goAway(5000);
        });
    },

    unblockContact(buddy) {
      firebase
        .database()
        .ref(
          "accounts/" +
            this.user.data.uid +
            "/" +
            "blockedcontacts/" +
            buddy.uid
        )
        .set({ blocked: false })

        .then(() => {
          eventBus.$emit("refreshAllContacts", buddy);
          this.$toasted
            .info(
              "You have unblocked " +
                buddy.displayName +
                ". <br> Contact can now see and interact with you."
            )
            .goAway(5000);
        });
    },
    ...mapActions(["refreshBuddyMessages"]),
  },

  computed: {
    ...mapGetters({
      user: "user",
      messages: "buddyMessages",
    }),
  },
};

console.log("Chat window ready");
</script>

<style></style>
