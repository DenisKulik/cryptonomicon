<template>
  <button
    class="flex items-center justify-center font-medium w-full bg-gray-700 px-4 py-4 sm:px-6 text-md text-gray-300 hover:text-gray-300 hover:opacity-20 transition-all focus:outline-none"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <svg
      class="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="rgb(209 213 219)"
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
</template>

<script>
export default {
  name: "RemoveButton",
};
</script>
