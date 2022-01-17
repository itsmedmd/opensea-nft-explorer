<template>
  <div class="pagination">
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
import store from "@/store/store";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Pagination",
  props: ["isNextDisabled"],
  setup() {
    const pageNumber = computed(() => {
      return store.state.pageNumber;
    });

    const updatePageNumber = (toAdd: number) => {
      store.addToPageNumber(toAdd);
    };

    const isPrevDisabled = computed(() => {
      if (pageNumber.value === 0) {
        return true;
      }
      return false;
    });

    return {
      pageNumber,
      isPrevDisabled,
      updatePageNumber,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/pagination.scss"></style>
