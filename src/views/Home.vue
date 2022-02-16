<template>
  <article class="home">
    <h1 class="sr-only" aria-live="assertive">Home page</h1>
    <Pagination :isNextDisabled="isNextDisabled" />
    <div class="home__itemlist">
      <Item
        v-for="(item, index) in computedList"
        :key="item.id + index"
        :data="item"
      />
    </div>
    <div
      class="loader-container"
      :class="{ 'loader-container--centered': noDataAvailable }"
      v-if="loaderText"
    >
      <div class="loader">
        <p class="loader-text">{{ loaderText }}</p>
      </div>
    </div>
    <div
      class="loader-container"
      :class="{ 'loader-container--centered': noDataAvailable }"
      v-else-if="refetchButtonText"
    >
      <button
        class="loader-text loader-button"
        type="button"
        @click="manuallyRefetch"
      >
        {{ refetchButtonText }}
      </button>
    </div>
    <Pagination :isNextDisabled="isNextDisabled" />
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from "vue";
import Item from "@/components/Item.vue";
import Pagination from "@/components/Pagination.vue";
import store from "@/store/store";
import fetchList from "@/assets/scripts/fetchList";

export default defineComponent({
  name: "Home",
  components: {
    Item,
    Pagination,
  },
  setup() {
    // calculate whether the button to navigate
    // to the next page should be disabled or not
    const isNextDisabled = computed(() => {
      const filter = store.state.listFilter;
      const sliceStart = store.state.pageNumber * store.state.itemsPerPage;
      const sliceEnd = sliceStart + store.state.itemsPerPage;

      if (
        (filter === "sale_count" &&
          sliceEnd >= store.state.dataBySaleCount.length) ||
        (filter === "default" &&
          sliceEnd >= store.state.dataByDefault.length) ||
        (filter === "sale_date" &&
          sliceEnd >= store.state.dataBySaleDate.length)
      ) {
        return true;
      }
      return false;
    });

    // only get items from the list that should
    // be shown in the current page
    const computedList = computed(() => {
      const filter = store.state.listFilter;
      const sliceStart = store.state.pageNumber * store.state.itemsPerPage;
      const sliceEnd = sliceStart + store.state.itemsPerPage;

      if (filter === "sale_count") {
        return store.state.dataBySaleCount.slice(sliceStart, sliceEnd);
      } else if (filter === "default") {
        return store.state.dataByDefault.slice(sliceStart, sliceEnd);
      } else {
        return store.state.dataBySaleDate.slice(sliceStart, sliceEnd);
      }
    });

    watch(
      () => computedList.value,
      () => {
        // fetch new data if the last page containing data
        // is in the further 0-2 pages and if there is currently
        // no fetch in progress for the currently set filter
        if (
          store.state.pageNumber + 2 >= store.state.pageCount &&
          !store.getIsCurrentlyFetching(store.state.listFilter)
        ) {
          fetchList(store.state.listFilter);
        }
      }
    );

    // if the user is on the last page and
    // there is a fetch for data in progress,
    // the loader should be visible.
    // if the loader is visible - compute the loader text.
    const loaderText = computed(() => {
      if (
        isNextDisabled.value &&
        store.getIsCurrentlyFetching(store.state.listFilter)
      ) {
        const errorMessage = store.getErrorMessage(store.state.listFilter);
        if (errorMessage) {
          // 1. If there is an error, then show the loader with the error message.
          return errorMessage;
        } else {
          // 2. If there is no error, then show the default loader message.
          return "Loading";
        }
      }
      // 3. Don't show the loader.
      return null;
    });

    // if the user is on the last page and
    // there is no longer a fetch for data in progress
    // and there is an error - show a button
    // for manual refetch.
    const refetchButtonText = computed(() => {
      const errorMessage = store.getErrorMessage(store.state.listFilter);
      if (
        isNextDisabled.value &&
        !store.getIsCurrentlyFetching(store.state.listFilter) &&
        errorMessage
      ) {
        // 1. Show the manual refetch button.
        return errorMessage;
      }
      // 2. Don't show the button.
      return null;
    });

    const noDataAvailable = computed(() => store.state.pageCount === 0);

    const manuallyRefetch = () => {
      // make sure that currently there is no fetch for this filter
      if (!store.getIsCurrentlyFetching(store.state.listFilter)) {
        fetchList(store.state.listFilter);
      }
    };

    onMounted(() => {
      // if there is no data for the current filter and a fetch
      // for it is not currently in progress - fetch it
      if (
        store.state.pageCount === 0 &&
        !store.getIsCurrentlyFetching(store.state.listFilter)
      ) {
        fetchList(store.state.listFilter);
      }
    });

    return {
      computedList,
      isNextDisabled,
      loaderText,
      refetchButtonText,
      noDataAvailable,
      manuallyRefetch,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/home.scss"></style>
