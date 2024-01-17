<script>
import { getCoinList, subscribeToTicker, unsubscribeFromTicker } from "@/api";
import AddTicker from "@/components/AddTicker.vue";
import TickersGraph from "@/components/TickersGraph.vue";
import PreloaderPage from "@/components/PreloaderPage.vue";
import NavigateButton from "@/components/NavigateButton.vue";

export default {
  name: "App",
  components: { NavigateButton, PreloaderPage, TickersGraph, AddTicker },
  data() {
    return {
      initialized: false,
      coinlist: [],
      searchSuggestions: [],
      tickers: [],
      selectedTicker: null,
      graph: [],
      GRAPH_WIDTH: 38,
      maxGraphElements: 1,
      error: "",
      page: 1,
      filter: "",
    };
  },
  created() {
    (async () => {
      const windowData = Object.fromEntries(
        new URL(window.location).searchParams.entries()
      );
      if (windowData.filter) this.filter = windowData.filter;
      if (windowData.page) this.page = windowData.page;

      this.coinlist = await getCoinList();

      const tickersData = localStorage.getItem("crypto-list");
      if (tickersData) {
        this.tickers = JSON.parse(tickersData);
        this.tickers.forEach((ticker) => {
          subscribeToTicker(ticker.name, (newPrice) =>
            this.updateTicker(ticker.name, newPrice)
          );
        });
      }

      this.initialized = true;
    })();
  },
  mounted() {
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },
  computed: {
    startIndex() {
      return (this.page - 1) * 6;
    },
    endIndex() {
      return this.page * 6;
    },
    filteredTickers() {
      return this.tickers.filter((ticker) =>
        ticker.name.includes(this.filter.toUpperCase())
      );
    },
    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },
  methods: {
    calculateMaxGraphElements() {
      if (!this.$refs.graph) return;
      this.maxGraphElements =
        this.$refs.graph.$el.clientWidth / this.GRAPH_WIDTH;
    },
    updateTicker(tickerName, price) {
      const ticker = this.tickers.find((ticker) => ticker.name === tickerName);
      ticker.price = price;
      if (ticker === this.selectedTicker) {
        this.graph.push(price);
        while (this.graph.length > this.maxGraphElements) {
          this.graph.shift();
        }
      }
    },
    formatPrice(price) {
      if (price === "-") return price;
      return price > 1 ? price.toFixed(2) : price?.toPrecision(2);
    },
    onInputChanged(e) {
      this.error = "";
      this.searchSuggestions = [];

      if (e.currentTarget.value.trim() === "") return;

      for (let i = 0; i < this.coinlist.length; i++) {
        if (this.searchSuggestions.length >= 4) break;

        if (
          this.coinlist[i][1].Symbol.toUpperCase().includes(
            e.currentTarget.value.toUpperCase()
          )
        ) {
          this.searchSuggestions.push(this.coinlist[i][1].Symbol);
        }
      }
    },
    add(currentTicker) {
      if (this.tickers.some((t) => t.name === currentTicker.name)) {
        this.error = "Ticker already exists";
        return;
      }

      this.tickers = [...this.tickers, currentTicker];
      subscribeToTicker(currentTicker.name, (newPrice) =>
        this.updateTicker(currentTicker.name, newPrice)
      );

      this.filter = "";
      this.error = "";
      this.searchSuggestions = [];
    },
    select(ticker) {
      this.selectedTicker = ticker;
    },
    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
      if (this.selectedTicker === tickerToRemove) this.selectedTicker = null;
      unsubscribeFromTicker(tickerToRemove.name);
    },
    clearSelectedTicker() {
      this.selectedTicker = null;
    },
  },
  watch: {
    tickers() {
      localStorage.setItem("crypto-list", JSON.stringify(this.tickers));
    },
    selectedTicker() {
      this.graph = [];
      this.$nextTick().then(this.calculateMaxGraphElements);
    },
    filter() {
      this.page = 1;
    },
    pageStateOptions(value) {
      history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
  },
};
</script>

<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <PreloaderPage v-if="!initialized" />
    <div v-if="initialized" class="container">
      <AddTicker
        :error="error"
        :search-suggestions="searchSuggestions"
        @addTicker="add"
        @onInputChanged="onInputChanged"
      />
      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          <NavigateButton
            v-if="page > 1"
            :title="'Prev'"
            @click.native="page = page - 1"
          />
          <NavigateButton
            v-if="hasNextPage"
            :title="'Next'"
            @click.native="page = page + 1"
          />
          <div>Filter: <input v-model="filter" /></div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in paginatedTickers"
            :key="t.name"
            @click="select(t)"
            :class="{ 'border-4': selectedTicker === t }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="handleDelete(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <TickersGraph
        v-if="selectedTicker"
        ref="graph"
        :graph="graph"
        :selected-ticker="selectedTicker"
        @closeGraph="clearSelectedTicker"
      />
    </div>
  </div>
</template>

<style>
@import "@/assets/tailwind.css";
</style>
