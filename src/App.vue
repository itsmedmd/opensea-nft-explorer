<template>
  <div class="app">
    <Navigation @mobileToggle="toggleNavigation" />
    <div class="content" :class="{ 'content--mobile': hideContent }">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import Navigation from "@/components/Navigation.vue";
import store from "@/store/store";
import fetchList from "@/assets/scripts/fetchList";

export default defineComponent({
  name: "App",
  components: {
    Navigation,
  },
  setup() {
    const hideContent = ref<boolean>(false);

    const toggleNavigation = (val: boolean) => {
      hideContent.value = val;
    };

    onMounted(() => {
      // if there is no data for the default filter - fetch it
      // (if the default filter has no data, it also means that
      // no data exists in general, so fetch data for all filters)
      if (store.state.pageCount === 0) {
        fetchList("default");
        fetchList("sale_count");
        fetchList("sale_date");
      }
    });

    return {
      hideContent,
      toggleNavigation,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/app.scss"></style>
