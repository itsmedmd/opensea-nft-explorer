<template>
  <div class="pagination" v-if="isPaginationVisible">
    <button
      class="pagination__navigate"
      type="button"
      :disabled="isPrevDisabled"
      @click="addPageNumber(-1)"
    >
      <span class="pagination__rotate-180">&#10148;</span>
      <span class="sr-only">Navigate to the previous page</span>
    </button>

    <button
      type="button"
      class="pagination__navigate-side-page"
      @click="setPageNumber(0)"
    >
      <span class="sr-only">Navigate to the first page</span>
      1
    </button>

    <span class="pagination__number">
      <span class="sr-only">Current page</span>
      ... {{ pageNumber }} ...
    </span>

    <button
      type="button"
      class="pagination__navigate-side-page"
      @click="setPageNumber(lastPageNumber - 1)"
    >
      <span class="sr-only">Navigate to the last page</span>
      {{ lastPageNumber }}
    </button>

    <button
      class="pagination__navigate"
      type="button"
      :disabled="isNextDisabled"
      @click="addPageNumber(1)"
    >
      <span class="sr-only">Navigate to the next page</span>
      &#10148;
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import store from "@/store/store";
import scrollToTop from "@/assets/scripts/scrollToTop";

export default defineComponent({
  name: "Pagination",
  props: ["isNextDisabled"],
  setup() {
    const pageNumber = computed(() => store.state.pageNumber + 1);
    const lastPageNumber = computed(() => store.state.pageCount + 1);
    const isPrevDisabled = computed(() => store.state.pageNumber === 0);
    const isPaginationVisible = computed(() => store.state.pageCount !== 0);

    const addPageNumber = (toAdd: number) => {
      scrollToTop();
      store.addToPageNumber(toAdd);
    };

    const setPageNumber = (newNumber: number) => {
      scrollToTop();
      store.setPageNumber(newNumber);
    };

    return {
      pageNumber,
      lastPageNumber,
      isPrevDisabled,
      isPaginationVisible,
      addPageNumber,
      setPageNumber,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/pagination.scss"></style>
