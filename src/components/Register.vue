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
export default {
  name: "Register",
  data: () => {
    return {
      formValues: {},
    };
  },

  components: {},

  methods: {
    signup() {
      console.log(this.formValues.email);
    },
  },
};
</script>
