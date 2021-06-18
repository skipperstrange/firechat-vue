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
          validation="required|email"
          placeholder="Email address"
        />
      </div>
      <div class="mb-3">
        <FormulateInput
          name="password"
          type="password"
          label=""
          validation="required"
          placeholder="********"
        />
      </div>

      <div class="mb-3">
        <FormulateInput type="submit" label="Sign In" />
      </div>
    </FormulateForm>
  </div>
</template>

<script>
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
      console.log(this.formValues.email);
    },
  },
};
</script>
