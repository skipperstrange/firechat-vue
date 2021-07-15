<template>
  <div id="sidepanel" :class="{ active: sideMenu }">
    <div id="profile">
      <div class="wrap d-flex" v-if="user.loggedIn">
        <div
          class="profile-img"
          @click="toggleSideMenu()"
          style="margin-right: 0.7rem"
        >
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
    <div id="search" :class="{ visible: sideMenu }">
      <label for=""><i class="fa fa-search" aria-hidden="true"></i></label>
      <input type="text" :placeholder="placeholder" v-model="searchString" />
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
          :title="contact.displayName"
        >
          <div class="wrap">
            <span :class="'contact-status ' + contact.status"></span>
            <img :src="contact.photoURL" alt="" style="background: #fff" />
            <div class="meta" :class="{ visible: sideMenu }">
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
      <button
        id="settings"
        title="Blocked Contacts"
        v-if="!blockedView"
        @click="toggleBlockedView()"
      >
        <i class="fa fa-ban fa-fw" aria-hidden="true"></i> <span>Blocked</span>
      </button>
      <button
        id="settings"
        title="'Contacts'"
        v-if="blockedView"
        @click="toggleBlockedView()"
      >
        <i class="fa fa-users fa-fw" aria-hidden="true"></i>
        <span>Contacts</span>
      </button>
      <button id="settings">
        <i class="fa fa-arrow-left fa-fw" aria-hidden="true"></i>
        <span>
          <router-link to="/logout" style="color: white"
            >Logout</router-link
          ></span
        >
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../main";

export default {
  name: "UsersList",
  props: {},

  data: () => {
    return {
      formValue: {},
      status: true,
      selectedId: String,
      placeholder: "Search contacts...",
      searchString: "",
      buddy: {},
      sideMenu: false,
      contactsSegregated: {
        blocked: [],
        unblocked: [],
      },
      blockedView: false,
      isBlockedContact: null,
    };
  },

  methods: {
    setCurrentChatBuddy(buddy) {
      if (this.selectedId !== this.buddy.uid) {
        this.selectedId = buddy.uid;
        this.$store.commit("SET_BUDDY", buddy);
        eventBus.$emit("buddySelected", buddy);
        this.sideMenu = false;
      }

      this.selectedId = buddy.uid;
      eventBus.$emit("buddySelected", buddy);
    },

    toggleBlockedView() {
      this.blockedView = !this.blockedView;
    },

    toggleSideMenu() {
      console.log(!this.sideMenu);
      this.sideMenu = !this.sideMenu;
      this.visibleMeta = !this.visibleMeta;
    },
  },

  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
      contacts: "contacts",
    }),

    filteredContacts: function () {
      var contacts_array;
      if (this.blockedView) {
        contacts_array = this.contacts.blocked;
      } else {
        contacts_array = this.contacts.unblocked;
      }
      let searchString = this.searchString;
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
    },
  },

  created() {
    this.$store.dispatch("segregateContacts");
  },

  mounted() {
    //this.setCurrentChatBuddy(this.buddy);
    eventBus.$on("refreshAllContacts", (buddy) => {
      this.setCurrentChatBuddy(buddy);
      this.$store.dispatch("segregateContacts");
    });
  },
};

console.log("Users list loaded");
</script>

<style></style>
