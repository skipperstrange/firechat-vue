<template>
  <div>
    <h3 class="display-4">Sign Up!!</h3>
    <p class="text-muted mb-2">You can also register to get started.</p>

    <FormulateForm v-model="formValues" @submit="signup">
      <div class="mb-2">
        <FormulateInput
          name="email"
          type="email"
          label=""
          validation="bail|required|email"
          placeholder="Email address"
        />
      </div>
      <div class="mb-2">
        <FormulateInput
          name="username"
          type="text"
          label=""
          validation="required"
          placeholder="Username"
        />
      </div>
      <div class="mb-2">
        <FormulateInput
          name="password"
          type="password"
          label=""
          validation="bail|required|min:6"
          placeholder="Password"
        />
      </div>

      <div class="mb-1">
        <FormulateInput type="submit" label="Sign Up" />
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Register",
  data: () => {
    return {
      formValues: {},
      loading: false,
    };
  },

  methods: {
    async signup() {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.formValues.email,
          this.formValues.password
        )
        .then(() => {
          let user = firebase.auth().currentUser;
          const newAccount = {
            userid: user.uid,
            email: this.formValues.email,
            displayName: this.formValues.username,
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
              firebase
                .auth()
                .signInWithEmailAndPassword(
                  this.formValues.email,
                  this.formValues.password
                )
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
            });
        })
        .catch((err) => {
          this.$toasted.info(err.message).goAway(5000);
        });
    },
  },
};
</script>
