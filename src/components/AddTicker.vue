<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700">
          Ticker
        </label>
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="addTicker"
            @input="onInputChanged"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div
          v-show="searchSuggestions.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            @click="addFromSuggestion(suggestion)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ suggestion }}
          </span>
        </div>
        <div v-show="error" class="text-sm text-red-600">{{ error }}</div>
      </div>
    </div>
    <AddButton @click.stop="addTicker" class="my-4" />
  </section>
</template>
<script>
import AddButton from "@/components/AddButton.vue";

export default {
  name: "AddTicker",
  components: { AddButton },
  props: {
    error: {
      type: String,
      required: false,
      default: "",
    },
    searchSuggestions: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      ticker: "",
    };
  },
  methods: {
    addTicker() {
      if (this.ticker.toUpperCase() === "") return;

      const currentTicker = {
        name: this.ticker.toUpperCase(),
        price: "-",
      };
      this.$emit("addTicker", currentTicker);
      this.ticker = "";
    },
    addFromSuggestion(suggestion) {
      this.ticker = suggestion;
      this.addTicker();
    },
    onInputChanged(e) {
      this.$emit("onInputChanged", e);
    },
  },
};
</script>
