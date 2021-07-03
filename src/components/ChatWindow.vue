<template>
  <div class="content" v-if="active === true">
    <div class="contact-profile container">
      <img :src="buddy.photoURL" alt="" />
      <p>{{ buddy.displayName }}</p>
     <span class="ban" title="Block this contact."><a  @click="unblockContact(buddy)"><i class="fa fa-ban"></i></a></span>
    </div>
    <div class="messages" v-if="messages" v-chat-scroll="{ enable: true }" >
      <ul >
        <li
          v-for="message in messages"
          :key="message.key"
          :class="message.direction"
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
            <small class="time-ago"><time-ago :refresh="60" :datetime="message.when" locale="en" tooltip></time-ago></small>
          </p>
        </li>
      </ul>
    </div>
    <div class="message-input">
      <div class="wrap">
        <form @submit="sendMessage" style="height: 100%;">
        <input
          type="text"
          placeholder="Write your message..."
          required
          v-model="newMessage.body"
        />
        <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
        <button type="submit" class="submit" >
          <i class="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import { TimeAgo } from 'vue2-timeago'
import firebase from "firebase";
import { mapGetters , mapActions} from "vuex";

export default {
  name: "ChatWindow",
  components: {
    TimeAgo,
  },
  data: () => {
    return {
      newMessage: {},
      buddy: {},
      active: false,
    };
  },


  props: {
    user: {},
  },

  async created() {
    eventBus.$on("buddySelected", (buddy) => {
      try {
        if (buddy && buddy.uid != this.buddy.uid) {
          this.buddy = buddy;
          this.active = true;
          //this.$state.diaspatch("buddyMessages",this.buddy.uid);
        this.refreshBuddyMessages(this.buddy);
        }
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


    async blockContact(buddy) {
      await firebase
        .database()
        .ref("blockedcontacts/" + this.user.data.uid+ "/" + buddy.uid)
        .set({blocked: true})
        .then(()=>{
            this.$toasted
              .success("You have just blocked "+buddy.displayName+". You will not be visible to this contact.<br> Go to blocked contacts to unblock.")
              .goAway(5000);
        })
    },

    async unblockContact(buddy) {
      await firebase
        .database()
        .ref("blockedcontacts/" + this.user.data.uid+ "/" + buddy.uid)
        .set({blocked: false})
        .then(()=>{
            this.$toasted
              .info("You have unblocked "+buddy.displayName+". <br> Contact can noe see and interact with you.")
              .goAway(5000);
        })
    },

    ...mapActions(["refreshBuddyMessages"])
  },

  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      messages: "buddyMessages",
    }),
  },
};
</script>

<style></style>
