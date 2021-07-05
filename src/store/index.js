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

    users: null,
    blockedUsers: null,
    buddyMessages: null,
  },
  getters: {
    user(state) {
      return state.user;
    },
    contacts(state) {
      return state.users;
    },

    blockedContacts(state) {
      return state.blockedUsers;
    },

    buddyMessages(state) {
      return state.buddyMessages;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
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
  },
  actions: {
    myBlockedUsers({ commit, state }) {
      firebase
        .database()
        .ref("blockedcontacts/" + state.user.data.uid)
        .on("value", (snapshot) => {
          let blocked = [];
          let block = snapshot.val();
          for (var key in block) {
            // blocked[key] = { blocked: block[key].blocked }
            if (block[key].blocked == true) {
              blocked.push(key);
            }
          }
          
          commit("SET_BLOCKED", blocked)
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

    refreshUsers({ commit, state }) {
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

    setCurrentBuddy({ commit }, buddy) {
      commit("SET_BUDDY", buddy);
    },

    authCheck({ commit, dispatch }) {
      firebase.auth().onAuthStateChanged((user) => {
        commit("SET_LOGGED_IN", false);
        commit("SET_USER", null);
        commit("SET_USERS", null);
        if (user) {
          commit("SET_LOGGED_IN", true);
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
          commit("SET_LOGGED_IN", false);
          commit("SET_USERS", null);
          commit("SET_USER", null);
          commit("SET_BUDDY_MESSAGES", null);
          commit("SET_BLOCKED", null);

          dispatch("updateUserStatus", {
            status: "offline",
            lastSeen: firebase.firestore.Timestamp.fromDate(
              new Date()
            ).toDate(),
          });
          //firebase.auth().unsubscribe();
        }
      });
    },

    updateUserStatus({ state }, data) {
      firebase
        .database()
        .ref("accounts/" + state.user.data.uid)
        .update(data);
    },
  },
});
