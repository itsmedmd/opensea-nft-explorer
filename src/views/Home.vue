<template>
  <div class="home">
    <h1>home!</h1>
    <p>list filter: {{ computedFilter }}</p>
    <div class="itemlist">
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
        return store.state.dataBySaleCount;
      } else if (store.state.listFilter === "price") {
        return store.state.dataBySalePrice;
      } else {
        return store.state.dataBySaleDate;
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
