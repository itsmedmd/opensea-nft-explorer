<template>
  <div class="home">
    <h1>home!</h1>
    <p>list filter: {{ computedFilter }}</p>
    <div class="home__itemlist">
      <Item v-for="item in computedList" :key="item.id" :data="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Item from "@/components/Item.vue";
import store from "@/store/store";

export default defineComponent({
  name: "Home",
  components: {
    Item,
  },
  setup() {
    const computedList = computed(() => {
      if (store.state.listFilter === "count") {
        return store.state.dataBySaleCount.slice(0, 16);
      } else if (store.state.listFilter === "price") {
        return store.state.dataBySalePrice.slice(0, 16);
      } else {
        return store.state.dataBySaleDate.slice(0, 16);
      }
    });

    const computedFilter = computed(() => {
      return store.state.listFilter;
    });

    return {
      computedList,
      computedFilter,
    };
  },
});
</script>

<style lang="scss" scoped src="@/assets/styles/components/home.scss"></style>
