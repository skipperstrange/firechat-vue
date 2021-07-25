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
    contacts: {
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
      return state.contacts;
    },

    buddyMessages(state) {
      return state.buddyMessages;
    },

    uid(state) {
      return state.uid;
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

    async SET_CONTACTS(state, contacts) {
      state.contacts = await contacts;
    },

    SET_BUDDY_MESSAGES(state, messages) {
      state.buddyMessages = messages;
    },
  },

  actions: {
    setBuddy({ commit }, buddy) {
      commit("SET_BUDDY", buddy);
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

    async refreshContacts({ state, commit }) {
      // console.log("refreshing contacts...");
      await firebase
        .database()
        .ref("accounts/")
        .on("value", (snapshot) => {
          let uid = state.user.data.uid;
          if (snapshot.exists) {
            let tmpContacts = [];
            let contacts = {
              unblocked: [],
              blocked: [],
            };
            let myBlockedContacts = snapshot.val()[uid].blockedcontacts;

            snapshot.forEach((childSnapshot) => {
              // var childKey = childSnapshot.key;
              var childData = childSnapshot.val();
              var ghostedContacts = childData.blockedcontacts;
              let contact = {
                uid: childData.userid,
                displayName: childData.displayName,
                photoURL: childData.photoURL,
                status: childData.status,
              };

              try {
                if (
                  myBlockedContacts[contact.uid] &&
                  myBlockedContacts[contact.uid].blocked == true
                ) {
                  contact.blocked = true;
                } else {
                  contact.blocked = false;
                }
              } catch (e) {
                contact.blocked = false;
              }

              try {
                if (
                  ghostedContacts[uid] &&
                  ghostedContacts[uid].blocked == true
                ) {
                  contact.hidden = true;
                }
              } catch (e) {
                // console.log();
              }
              tmpContacts.push(contact);
            });

            tmpContacts.forEach((profile) => {
              if (profile.uid !== uid) {
                if (profile.hidden == true) {
                  //  console.log("ghosted")
                } else {
                  if (profile.blocked == true) {
                    contacts.blocked.push(profile);
                  }
                  if (profile.blocked == false) {
                    contacts.unblocked.push(profile);
                  }
                }
              }
            });
            commit("SET_CONTACTS", contacts);
          }
        });
    },

    authCheck({ commit, dispatch }) {
      firebase.auth().onAuthStateChanged((user) => {
        commit("SET_LOGGED_IN", false);
        commit("SET_UID", null);
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
          dispatch("updateUser", {
            status: "online",
            lastSeen: firebase.firestore.Timestamp.fromDate(
              new Date()
            ).toDate(),
          });
        } else {
          dispatch("updateUser", {
            status: "offline",
            lastSeen: firebase.firestore.Timestamp.fromDate(
              new Date()
            ).toDate(),
          });
          dispatch("logout");
        }
      });
    },

    resetState({ commit }) {
      commit("SET_LOGGED_IN", false);
      commit("SET_USER", null);
      commit("SET_BUDDY", null);
      commit("SET_UID", null);
      commit("SET_CONTACTS", null);
      commit("SET_BUDDY_MESSAGES", null);
    },

    updateUser({ state }, data) {
      try {
        firebase
          .database()
          .ref("accounts/" + state.user.data.uid)
          .update(data);
      } catch (e) {
        console.log(e.message);
      }
    },

    logout({ dispatch }) {
      dispatch("updateUser", {
        status: "offline",
        lastSeen: firebase.firestore.Timestamp.fromDate(new Date()).toDate(),
      });
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Clearing user session");
          dispatch("resetState");
          console.log("Successfully signed out.");
        });
    },
  },
});
