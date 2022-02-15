<template>
  <div class="pagination" v-if="isPaginationVisible">
    <button
      class="pagination__navigate"
      type="button"
      :disabled="isPrevDisabled"
      @click="updatePageNumber(-1)"
    >
      <span class="pagination__rotate-180">&#10148;</span>
      <div class="sr-only">Previous Page</div>
    </button>
    <span class="pagination__number">
      {{ pageNumber + 1 }}
    </span>
    <button
      class="pagination__navigate"
      type="button"
      :disabled="isNextDisabled"
      @click="updatePageNumber(1)"
    >
      <div class="sr-only">Next Page</div>
      &#10148;
    </button>
    <p class="pagination__description">Page</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import store from "@/store/store";
import fetchList from "@/assets/scripts/fetchList";

export default defineComponent({
  name: "Pagination",
  props: ["isNextDisabled"],
  setup() {
    const pageNumber = computed(() => store.state.pageNumber);

    const isPrevDisabled = computed(() => store.state.pageNumber === 0);

    const isPaginationVisible = computed(() => store.state.pageCount !== 0);

    const updatePageNumber = (toAdd: number) => {
      // start the page at the top
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      store.addToPageNumber(toAdd);
    };

    return {
      pageNumber,
      isPrevDisabled,
      isPaginationVisible,
      updatePageNumber,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/pagination.scss"></style>
