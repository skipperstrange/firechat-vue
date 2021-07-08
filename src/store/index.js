import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import firebase from "firebase";

Vue.use(Vuex);
export default new Vuex.Store({
  namespaced: true,
  plugins: [createPersistedState()],
  state: {
    user: {
      loggedIn: false,
      data: null,
    },
    buddy: null,

    uid: String,
    users: null,
    blockedUsers: null,
    buddyMessages: null,
    haters: null,
    contactsSegregated: {
      blocked: [],
      unblocked: [],
    },
  },
  getters: {
    user(state) {
      return state.user;
    },

    buddy(state) {
      return state.buddy;
    },
    contacts(state) {
      let tempUsers = [];
      try{
        state.users.forEach((user) => {
          if (state.haters.includes(user.uid)) {
            console.log(user.displayName + " has blocked me");
          } else {
            tempUsers.push(user);
          }
        });
      }
      catch(e){
        console.log(e)
      }

      let blocked = [];
      let unblocked = [];
      tempUsers.forEach(function (profile) {
        if (state.blockedUsers.includes(profile.uid)) {
          profile.blocked = true;
          blocked.push(profile);
        } else {
          profile.blocked = false;
          unblocked.push(profile);
        }
      });

      state.contactsSegregated.blocked = blocked;
      state.contactsSegregated.unblocked = unblocked;
      return state.contactsSegregated;
    },

    blockedContacts(state) {
      return state.blockedUsers;
    },

    buddyMessages(state) {
      return state.buddyMessages;
    },

    uid(state) {
      return state.uid;
    },

    haters(state) {
      return state.haters;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },

    SET_USER(state, data) {
      state.user.data = data;
    },

    SET_BUDDY(state, buddy) {
      state.buddy = buddy;
    },

    SET_UID(state, value) {
      state.uid = value;
    },

    SET_USERS(state, users) {
      state.users = users;
    },

    SET_BUDDY_MESSAGES(state, messages) {
      state.buddyMessages = messages;
    },

    SET_BLOCKED(state, value) {
      state.blockedUsers = value;
    },

    SET_HATERS(state, value) {
      state.haters = value;
    },
  },
  actions: {
    setBuddy({ commit }, buddy) {
      commit("SET_BUDDY", buddy);
    },

    myBlockedUsers({ commit, state }) {
      firebase
        .database()
        .ref("blockedcontacts/" + state.user.data.uid)
        .on("value", (snapshot) => {
          let blocked = [];
          let block = snapshot.val();
          for (var key in block) {
            if (block[key].blocked == true) {
              blocked.push(key);
            }
          }
          commit("SET_BLOCKED", blocked);
        });
    },

    myHaters({ state, commit }) {
      firebase
        .database()
        .ref("blockedcontacts/")
        .on("value", (snapshot) => {
          let haters = [];
          let hates = snapshot.val();
          let me = state.uid;
          for (var key in hates) {
            if (key !== me) {
              if (hates[key][me].blocked) {
                //console.log(key +" has blocked "+me)
                haters.push(key);
              }
            }
          }
          commit("SET_HATERS", haters);
        });
    },

    refreshBuddyMessages({ commit, state }, buddy) {
      firebase
        .database()
        .ref("chats/" + state.user.data.uid + "/" + buddy.uid + "/messages")
        .on("value", (snapshot) => {
          let messages = [];
          let m = snapshot.val();
          for (var key in m) {
            let message = m[key];
            message.key = key;
            messages.push(message);
          }
          commit("SET_BUDDY_MESSAGES", messages);
        });
    },

    async refreshUsers({ commit, state }) {
      firebase
        .database()
        .ref("accounts/")
        .orderByChild("displayName")
        .on("value", (snapshot) => {
          let allContacts = [];
          snapshot.forEach(function (doc) {
            let c = doc.val();
            let contact = {
              uid: c.userid,
              displayName: c.displayName,
              photoURL: c.photoURL,
              status: c.status,
            };

            if (
              contact.uid !== state.user.data.uid
              // && contact.status === "online"
            ) {
              allContacts.push(contact);
            }
          });
          commit("SET_USERS", allContacts);
        });
    },

    authCheck({ commit, dispatch }) {
      firebase.auth().onAuthStateChanged((user) => {
        commit("SET_LOGGED_IN", false);
        commit("SET_UID", null);
        commit("SET_USERS", null);
        commit("SET_BUDDY_MESSAGES", null);
        if (user) {
          commit("SET_LOGGED_IN", true);
          commit("SET_UID", user.uid);
          firebase
            .database()
            .ref("accounts/" + user.uid)
            .on("value", (snapshot) => {
              let u = snapshot.val();

              let userDetails = {
                uid: user.uid,
                displayName: u.displayName,
                email: u.email,
                photoURL: u.photoURL,
                status: u.status,
              };
              commit("SET_USER", userDetails);
            });
          dispatch("updateUserStatus", {
            status: "online",
            lastSeen: firebase.firestore.Timestamp.fromDate(
              new Date()
            ).toDate(),
          });
        } else {
          dispatch("updateUserStatus", {
            status: "offline",
            lastSeen: firebase.firestore.Timestamp.fromDate(
              new Date()
            ).toDate(),
          });
          commit("SET_LOGGED_IN", false);
          commit("SET_USER", null);
          commit("SET_BUDDY", null);
          commit("SET_UID", null);
          commit("SET_USERS", null);
          commit("SET_BUDDY_MESSAGES", null);
        }
      });
    },

    updateUserStatus({ state }, data) {
      firebase
        .database()
        .ref("accounts/" + state.user.data.uid)
        .update(data);
    },

    logout({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("SET_LOGGED_IN", false);
          commit("SET_USER", null);
          commit("SET_BUDDY", null);
          commit("SET_UID", null);
          commit("SET_USERS", null);
          commit("SET_BUDDY_MESSAGES", null);
          console.log("Successfully signed out.");
        });
    },
  },
});
