<template>
  <button
    class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    v-on="$listeners"
  >
    {{ title }}
  </button>
</template>

<script>
export default {
  name: "NavigateButton",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
