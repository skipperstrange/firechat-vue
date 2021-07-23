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

    async SET_BLOCKED(state, value) {
      state.blockedUsers = await value;
    },
  },

  actions: {
    setBuddy({ commit }, buddy) {
      commit("SET_BUDDY", buddy);
    },

    async blockedUsers({ commit, state }) {
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

    refreshContacts({ state, dispatch, commit }) {
      firebase
        .database()
        .ref("accounts/")
        .orderByChild("displayName")
        .on("value", (snapshot) => {
          if (snapshot.exists()) {
            let uid = state.user.data.uid;
            let tmpContacts = [];
            let contacts = { blocked: [], unblocked: [] };

            snapshot.forEach(function (doc) {
              let c = doc.val();
              let contact = {
                uid: c.userid,
                displayName: c.displayName,
                photoURL: c.photoURL,
                status: c.status,
                blocked: false,
                hidden: false,
              };

              if (
                contact.uid !== uid
                // && contact.status === "online"
              ) {
                tmpContacts[contact.uid] = contact;
              }
            });

            firebase
              .database()
              .ref("blockedcontacts/")
              .on("value", (snapshot) => {
                if (snapshot.exists) {
                  let hiddenContacts = snapshot.val();

                  //console.log(hiddenContacts)
                  for (var key in hiddenContacts) {
                    if (key !== uid) {
                      if (
                        hiddenContacts[key][uid] &&
                        hiddenContacts[key][uid].blocked == true
                      ) {
                        tmpContacts[key].hidden = true;
                      } else {
                        tmpContacts[key].hidden = false;
                      }
                    }
                  }
                  dispatch("blockedUsers").then(() => {
                    state.blockedUsers.forEach((blocked) => {
                      tmpContacts[blocked].blocked = true;
                    });
                  });
                }
              });

            for (var contact in tmpContacts) {
              let processed = tmpContacts[contact];
              //proceed if user hasnt blocked you
              if (processed.hidden == false) {
                //if you have blocked the user move to blocked array

                if (processed.blocked && processed.blocked == true) {
                  contacts.blocked.push(processed);
                  console.log(processed);
                }
                //if user isn't blocked move to unblocked arrayd
                if (processed.blocked == false) {
                  contacts.unblocked.push(processed);
                }
              }
            }
            commit("SET_CONTACTS", contacts);
          }
        });
    },

    authCheck({ commit, dispatch }) {
      firebase.auth().onAuthStateChanged((user) => {
        commit("SET_LOGGED_IN", false);
        commit("SET_UID", null);
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
          dispatch("resetState");
        }
      });
    },

    resetState({ commit }) {
      commit("SET_LOGGED_IN", false);
      commit("SET_USER", null);
      commit("SET_BUDDY", null);
      commit("SET_UID", null);
      commit("SET_BLOCKED", null);
      commit("SET_CONTACTS", null);
      commit("SET_BUDDY_MESSAGES", null);
    },

    updateUserStatus({ state }, data) {
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
      dispatch("updateUserStatus", {
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
