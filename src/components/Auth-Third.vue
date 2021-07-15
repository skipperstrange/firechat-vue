<template>
  <div class="auth0 mb-1">
    <a href="#" @click="loginWithGoogle()"
      ><i class="fa fa-google"> </i> Login with google</a
    >
  </div>
</template>

<script>
//import {mapActions} from "vuex"
import firebase from "firebase";

export default {
  name: "Auth0",

  methods: {
    //    ...mapActions(["loginWithGoogle"]),
    loginWithGoogle() {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          //let token = result.credential.accessToken;
          let user = result.user;
          const newAccount = {
            userid: user.uid,
            email: user.email,
            displayName: user.displayName,
            createdAt: Date.now(),
            lastSeen: Date.now(),
            photoURL:
              "https://cdn0.iconfinder.com/data/icons/multimedia-solid-30px/30/user_account_profile-512.png",
            status: "online",
          };

          firebase
            .database()
            .ref("accounts/" + user.uid)
            .set(newAccount)
            .then(() => {
              this.$toasted
                .success(
                  "Thanks for signing up! Please wait to enter chat room."
                )
                .goAway(5000);
              this.$router.replace({ name: "Chat" });
            })
            .catch((err) => {
              this.$toasted.show(err.message).goAway(5000);
            });
        })

        .catch((err) => {
          console.log(err); // This will give you all the information needed to further debug any errors
          this.$toasted.error(err.message).goAway(5000);
        });
    },
  },

  created() {},
};
</script>
