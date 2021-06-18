<template>
  <div class="mb-3">
    <input
      :id="id"
      :type="type"
      :value="formValue"
      :placeholder="placeholder"
      :class="classes"
    />
  </div>
</template>

<script>
export default {
  name: "formInput",
  data: () => {
    return {
      formValue: "",
    };
  },
  props: {
    type: String,
    name: String,
    id: String,
    classes: String,
    title: String,
    placeholder: String,
  },

  computed: {},

  methods: {},
};
</script>
