<template>
  <div class="app">
    <Navigation />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

import Navigation from "@/components/Navigation.vue";
import store from "@/store/store";
import fetchList from "@/assets/scripts/fetchList";

export default defineComponent({
  name: "App",
  components: {
    Navigation,
  },
  setup() {
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
      console.log("App mounted, appending data");

      // if there is no data for the defai;t filter - fetch it
      if (store.state.pageCount === 0) {
        fetchList(store.state.listFilter);
      }
    });
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/app.scss"></style>
