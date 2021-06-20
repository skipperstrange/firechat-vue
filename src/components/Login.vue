<template>
  <div>
    <h3 class="display-4">Come on in!</h3>
    <p class="text-muted mb-4">Please login to chat with members</p>

    <FormulateForm v-model="formValues" @submit="login">
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
          name="password"
          type="password"
          label=""
          validation="required"
          placeholder="Password"
        />
      </div>

      <div class="mb-3">
        <FormulateInput type="submit" label="Sign In" />
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Login",
  data: () => {
    return {
      formValues: {},
    };
  },

  components: {},

  methods: {
    login() {
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
          console.log(err.message);
          this.error = err.message;
        });
    },
  },
};
</script>
