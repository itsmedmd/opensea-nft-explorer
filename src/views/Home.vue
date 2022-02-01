<template>
  <div class="home">
    <Pagination :isNextDisabled="isNextDisabled" />
    <div class="home__itemlist">
      <Item
        v-for="(item, index) in computedList"
        :key="item.id + index"
        :data="item"
      />
    </div>
    <div class="home__loader-container" v-if="showLoader">
      <div class="home__loader">
        <p class="home__loader-text">Loading</p>
      </div>
    </div>
    <Pagination :isNextDisabled="isNextDisabled" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
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

    // if the user is on the last page and
    // there is a fetch for data in progress,
    // then show the loader
    const showLoader = computed(() => {
      if (
        isNextDisabled.value &&
        store.getIsCurrentlyFetching(store.state.listFilter)
      ) {
        return true;
      }
      return false;
    });

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
      showLoader,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/home.scss"></style>
