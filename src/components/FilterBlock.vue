<template>
  <div>
    <span class="font-medium mr-1">Filter:</span>
    <input
      class="rounded-lg"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "FilterBlock",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
};
</script>
