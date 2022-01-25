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
        (filter === "sale_count" &&
          sliceEnd >= store.state.dataBySaleCount.length) ||
        (filter === "sale_price" &&
          sliceEnd >= store.state.dataBySalePrice.length) ||
        (filter === "sale_date" &&
          sliceEnd >= store.state.dataBySaleDate.length)
      ) {
        return true;
      }
      return false;
    });

    const computedList = computed(() => {
      const filter = store.state.listFilter;
      const sliceStart = store.state.pageNumber * store.state.itemsPerPage;
      const sliceEnd = sliceStart + store.state.itemsPerPage;

      if (filter === "sale_count") {
        return store.state.dataBySaleCount.slice(sliceStart, sliceEnd);
      } else if (filter === "sale_price") {
        return store.state.dataBySalePrice.slice(sliceStart, sliceEnd);
      } else {
        return store.state.dataBySaleDate.slice(sliceStart, sliceEnd);
      }
    });

    return {
      computedList,
      isNextDisabled,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/home.scss"></style>
