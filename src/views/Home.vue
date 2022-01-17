<template>
  <div class="home">
    <h1>home!</h1>
    <p>list filter: {{ computedFilter }}</p>
    <Pagination :isNextDisabled="isNextDisabled" />
    <div class="home__itemlist">
      <Item v-for="item in computedList" :key="item.id" :data="item" />
    </div>
    <Pagination :isNextDisabled="isNextDisabled" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Item from "@/components/Item.vue";
import Pagination from "@/components/Pagination.vue";
import store from "@/store/store";

export default defineComponent({
  name: "Home",
  components: {
    Item,
    Pagination,
  },
  setup() {
    const isNextDisabled = computed(() => {
      const filter = store.state.listFilter;
      const sliceStart = store.state.pageNumber * store.state.itemsPerPage;
      const sliceEnd = sliceStart + store.state.itemsPerPage;

      if (
        (filter === "count" &&
          sliceEnd >= store.state.dataBySaleCount.length) ||
        (filter === "price" &&
          sliceEnd >= store.state.dataBySalePrice.length) ||
        (filter === "date" && sliceEnd >= store.state.dataBySaleDate.length)
      ) {
        return true;
      }
      return false;
    });

    const computedList = computed(() => {
      const filter = store.state.listFilter;
      const sliceStart = store.state.pageNumber * store.state.itemsPerPage;
      const sliceEnd = sliceStart + store.state.itemsPerPage;

      if (filter === "count") {
        return store.state.dataBySaleCount.slice(sliceStart, sliceEnd);
      } else if (filter === "price") {
        return store.state.dataBySalePrice.slice(sliceStart, sliceEnd);
      } else {
        return store.state.dataBySaleDate.slice(sliceStart, sliceEnd);
      }
    });

    const computedFilter = computed(() => {
      return store.state.listFilter;
    });

    return {
      computedList,
      computedFilter,
      isNextDisabled,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/home.scss"></style>
