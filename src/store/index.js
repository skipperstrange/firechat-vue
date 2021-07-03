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

    buddyMessages: null
  },
  getters: {
    user(state) {
      return state.user;
    },
    contacts(state) {
      return state.users;
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

     SET_BUDDY_MESSAGES(state, messages){
      console.log(messages)
      state.buddyMessages = messages;
    },

    UID(state, value) {
      state.uid = value;
    },
  },
  actions: {
   async refreshBuddyMessages({ commit,state }, buddy) {
      
     await firebase
        .database()
        .ref("chats/" + state.user.data.uid + "/" + buddy.uid + "/messages")
        .on("value", snapshot => {
          let messages = [];
          let m = snapshot.val()
          for(var key in m){
             let message = m[key]
             message.key = key
            messages.push(message)
          }
          commit("SET_BUDDY_MESSAGES", messages);
        })
    },

    async refreshUsers({ commit, state }) {
     await firebase
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

    checkBlockedStatus() {},

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
              commit("UID", user.uid);
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
