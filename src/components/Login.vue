<template>
  <div>
    <h3 class="display-4">Come in!</h3>
    <p class="text-muted mb-1">Please login to chat with members</p>
    <Auth0 />
    <FormulateForm v-model="formValues" @submit="login">
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
          name="password"
          type="password"
          label=""
          validation="required"
          placeholder="Password"
        />
      </div>

      <div class="mb-1">
        <FormulateInput type="submit" label="Sign In" />
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import firebase from "firebase";
import Auth0 from "@/components/Auth-Third.vue";

export default {
  name: "Login",
  data: () => {
    return {
      formValues: {},
    };
  },

  components: {
    Auth0,
  },

  methods: {
    async login() {
      await firebase
        .auth()
        .signInWithEmailAndPassword(
          this.formValues.email,
          this.formValues.password
        )
        .then(() => {
          this.$toasted.success("Please wait to enter chat room.").goAway(3000);
          setTimeout(() => {
            this.$router.push({ name: "Home" });
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          this.$toasted.error(err.message).goAway(5000);
        });
    },
  },
};
</script>
