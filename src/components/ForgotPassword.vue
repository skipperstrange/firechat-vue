<template>
  <div>
    <h3 class="display-4">Forgot password?</h3>
    <p class="text-muted mb-1">Your password reset will be sent to you inbox</p>
    <Auth0 />
    <FormulateForm v-model="formValues" @submit="reset">
      <div class="mb-2">
        <FormulateInput
          name="email"
          type="email"
          label=""
          validation="bail|required|email"
          placeholder="Email address"
        />
      </div>

      <div class="mb-1">
        <FormulateInput type="submit" label="Reste Password" />
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import firebase from "firebase";
import Auth0 from "@/components/Auth-Third.vue";

export default {
  name: "ForgotPassword",
  data: () => {
    return {
      formValues: {},
    };
  },

  components: {
    Auth0,
  },

  methods: {
    async reset() {
      await firebase
        .auth()
        .sendPasswordResetEmail(this.formValues.email)
        .then(() => {
          this.$toasted
            .success("Please check your inbox to reset your password.")
            .goAway(5000);
        })
        .catch((err) => {
          console.log(err);
          this.$toasted.error(err.message).goAway(3000);
        });
    },
  },
};
</script>
