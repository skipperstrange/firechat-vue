<template>
  <div id="sidepanel">
    <div id="profile">
      <div class="wrap d-flex" v-if="user.loggedIn">
        <div class="profile-img" style="margin-right: 0.7rem">
          <img
            id="profile-img"
            v-bind:src="user.data.photoURL"
            class="online"
            :class="user.data.status"
            alt=""
            style="background: #fff"
          />
        </div>
        <div class="profil-info">
          <h6 style="color: #fff; padding: 0px">{{ user.data.displayName }}</h6>
          <h6>
            <small style="color: #fff">{{ user.data.email }}</small>
          </h6>
        </div>
      </div>
    </div>
    <div id="search">
      <label for=""><i class="fa fa-search" aria-hidden="true"></i></label>
      <input type="text" placeholder="Search contacts..."  v-model="searchString" />
    </div>
    <div id="contacts">
      <ul
        style="
          list-style: none;
          width: 100%;
          margin: 0;
          padding-left: 0%;
          color: #fff;
        "
      >
        <li
          v-for="contact in filteredContacts"
          :key="contact.uid"
          class="contact"
          :class="{ active: selectedId === contact.uid }"
          style="border-bottom: #32465a 1px solid"
          @click="setCurrentChatBuddy(contact)"
        >
          <div class="wrap">
            <span :class="'contact-status ' + contact.status"></span>
            <img :src="contact.photoURL" alt="" style="background: #fff" />
            <div class="meta">
              <h6 class="name" style="color: #fff">
                {{ contact.displayName }}
              </h6>
              <p class="preview">{{ contact.status }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div id="bottom-bar">
      <button id="addcontact">
        <i class="fa fa-sign-out fa-fw" aria-hidden="true"></i>
        <span> <a @click="logout" class="">Logout</a></span>
      </button>
      <!--button id="settings">
        <i class="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span>
      </button-->
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import firebase from "firebase/app";

export default {
  name: "UsersList",
  props: {
    user: {},
    contacts: [],
  },

  data: () => {
    return {
      formValue: {},
      status: true,
      selectedId: String,
      searchString: ''
    };
  },

  methods: {
    setCurrentChatBuddy(buddy) {
      this.selectedId = buddy.uid;
      eventBus.$emit("buddySelected", buddy);
    },

    async logout() {
      await firebase
        .database()
        .ref("accounts/" + this.user.data.uid)
        .update({
          status: "offline",
          lastSeen: firebase.firestore.Timestamp.fromDate(new Date()).toDate(),
        })
        .then(() => {
          firebase
            .auth()
            .signOut()
            .then(() => {
              this.$store.dispatch("authCheck").then(() => {
                this.$router.replace({ name: "Home" });
              });
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  computed: {

  filteredContacts: function () {
        var contacts_array = this.contacts,
          searchString = this.searchString;
        if (!searchString) {
          return contacts_array;
        }
        searchString = searchString.trim().toLowerCase();
        contacts_array = contacts_array.filter(function (item) {
          if (item.displayName.toLowerCase().indexOf(searchString) !== -1) {
            return item;
          }
        });
        return contacts_array;
      }
  }
};
</script>

<style></style>
