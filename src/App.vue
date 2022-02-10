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

    // const fetchSingle = () => {
    //   const options = { method: "GET" };
    //   fetch(
    //     "https://api.opensea.io/api/v1/asset/0x28472a58a490c5e09a238847f66a68a47cc76f0f/0/",
    //     options
    //   )
    //     .then((res) => {
    //       if (res.status === 200) {
    //         return res.json();
    //       } else {
    //         throw new Error(`Failed to fetch data. ${res.statusText}`);
    //       }
    //     })
    //     .then((res) => {
    //       console.log(res);
    //     })
    //     .catch((err) => console.error(err));
    // };

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
