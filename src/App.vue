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
import AssetType from "@/types/AssetType";

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
      const item: AssetType = {
        id: "0x28472a58a490c5e09a238847f66a68a47cc76f0f-0",
        name: "adidas Originals: Into the Metaverse (Phase 1)",
        description:
          "Into the Metaverse is a collaborative NFT project between adidas Originals and NFT pioneers gmoney, Bored Ape Yacht Club and PUNKS Comic. An NFT co-created with the OG communities, creators and doers.",
        num_sales: 20177,
        permalink:
          "https://opensea.io/assets/0x28472a58a490c5e09a238847f66a68a47cc76f0f/0",
        creator: {
          profile_img_url:
            "https://storage.googleapis.com/opensea-static/opensea-profile/8.png",
          username: "adidasOriginals",
        },
        collection: {
          name: "adidas Originals Into the Metaverse",
          image_url:
            "https://lh3.googleusercontent.com/_wXtGDZ07ZelRfyfqDQkhoTX_feD_w3wdFuJ25z2ZLA1R6GFzuQ2jOGURRS8d7UEJGJd1svd61tZnGRS4zN-VXTUUVmg8Wymt-Uk=s120",
        },
        image_preview_url:
          "https://lh3.googleusercontent.com/1rPdFe3vblA6-O-7Id-1D_J9nqlr5RyY1hJyFhOlKn5JbVwQcaB6IHIZlafK-VGbioeK63WonQ0n_B0R5QRPcsgU_xdOAL-d-wKo=s250",
        animation_url:
          "https://storage.opensea.io/files/3565db33a856b19f48396062e59e6d62.mp4",
        image_original_url:
          "https://ipfs.io/ipfs/Qmb4VB12RsXW6DaKranEdgnMUTzfyVBEb5eZ1v7JCEUxL1/",
        image_url:
          "https://lh3.googleusercontent.com/1rPdFe3vblA6-O-7Id-1D_J9nqlr5RyY1hJyFhOlKn5JbVwQcaB6IHIZlafK-VGbioeK63WonQ0n_B0R5QRPcsgU_xdOAL-d-wKo",
        traits: [
          {
            trait_type: "Phase",
            value: "1",
          },
        ],
        asset_contract: {
          address: "0x28472a58a490c5e09a238847f66a68a47cc76f0f",
        },
        token_id: "0",
      };

      for (let i = 0; i < 50; i++) {
        //list.value.push(item);
      }

      //console.log("App mounted, appending data");
      //store.appendData(list.value, "sale_count");
    });
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/app.scss"></style>
