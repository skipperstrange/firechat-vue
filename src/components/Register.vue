<template>
  <div>
    <h3 class="display-4">Come on in!</h3>
    <p class="text-muted mb-4">Please login to chat with members</p>

    <FormulateForm v-model="formValues" @submit="signup">
      <div class="mb-3">
        <FormulateInput
          name="email"
          type="email"
          label=""
          validation="bail|required|email"
          placeholder="Email address"
        />
      </div>
      <div class="mb-3">
        <FormulateInput
          name="username"
          type="text"
          label=""
          validation="required"
          placeholder="Username"
        />
      </div>
      <div class="mb-3">
        <FormulateInput
          name="password"
          type="password"
          label=""
          validation="bail|required|min:6"
          placeholder="Password"
        />
      </div>

      <div class="mb-3">
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
            email: this.formValues.email,
            username: this.formValues.username,
            created: new Date(),
            photoUrl:
              "https://cdn0.iconfinder.com/data/icons/multimedia-solid-30px/30/user_account_profile-512.png",
          };

          firebase
            .database()
            .ref("accounts/" + user.uid)
            .push(newAccount)
            .then(() => {
              firebase
                .auth()
                .signInWithEmailAndPassword(
                  this.formValues.email,
                  this.formValues.password
                )
                .then(() => {
                  this.$router.replace({ name: "Chat" });
                })
                .catch((err) => {
                  console.log = err.message;
                });
            });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
};
</script>
