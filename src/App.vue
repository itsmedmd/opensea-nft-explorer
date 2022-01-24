<template>
  <div class="app">
    <Navigation @updatedFilter="fetchList" />
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
import ListType from "@/types/ListType";
import Trait from "@/types/Trait";
import Creator from "@/types/Creator";
import Collection from "@/types/Collection";

export default defineComponent({
  name: "App",
  components: {
    Navigation,
  },
  setup() {
    const createAssetObject = (obj: any): AssetType => {
      // create typed asset traits
      const assetTraits: Trait[] = [];
      for (const trait of obj.traits) {
        const newTrait: Trait = {
          trait_type: trait.trait_type,
          value: trait.value,
        };
        assetTraits.push(newTrait);
      }

      // create typed asset creator
      const assetCreator: Creator | null = obj.creator
        ? {
            profile_img_url: obj.creator.profile_img_url ?? null,
            username: obj.creator.user ? obj.creator.user.username : null,
          }
        : null;

      // create typed asset collection
      const assetCollection: Collection | null = obj.collection
        ? {
            name: obj.collection.name ?? null,
            image_url: obj.collection.image_url ?? null,
          }
        : null;

      // create typed asset
      const asset: AssetType = {
        id: `${obj.asset_contract.address}-${obj.token_id}`,
        name: obj.name ?? null,
        permalink: obj.permalink,
        token_id: obj.token_id,
        asset_contract: {
          address: obj.asset_contract.address,
        },
        description: obj.description ?? null,
        num_sales: obj.num_sales ?? null,
        image_preview_url: obj.image_preview_url ?? null,
        animation_url: obj.animation_url ?? null,
        image_original_url: obj.image_original_url ?? null,
        image_url: obj.image_url ?? null,
        traits: assetTraits,
        creator: assetCreator,
        collection: assetCollection,
      };

      return asset;
    };

    const fetchList = (filter: ListType) => {
      if (
        (filter === "sale_count" && store.state.dataBySaleCount.length === 0) ||
        (filter === "sale_price" && store.state.dataBySalePrice.length === 0) ||
        (filter === "sale_date" && store.state.dataBySaleDate.length === 0)
      ) {
        console.log("fetchList:", filter);
        const url = `https://api.opensea.io/api/v1/assets?order_by=${filter}&order_direction=desc&offset=0&limit=50`;

        const options = {
          method: "GET",
          headers: { Accept: "application/json" },
        };

        fetch(url, options)
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            } else {
              throw new Error(`Failed to fetch data. ${res.statusText}`);
            }
          })
          .then((res) => {
            const newList: AssetType[] = [];
            for (const rawAsset of res.assets) {
              newList.push(createAssetObject(rawAsset));
            }

            store.appendData(newList, filter);
            console.log("retrieved:", newList);
          })
          .catch((err) => console.error(err));
      }
    };

    const fetchSingle = () => {
      const options = { method: "GET" };
      fetch(
        "https://api.opensea.io/api/v1/asset/0x28472a58a490c5e09a238847f66a68a47cc76f0f/0/",
        options
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error(`Failed to fetch data. ${res.statusText}`);
          }
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.error(err));
    };

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

    return {
      fetchList,
      fetchSingle,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/app.scss"></style>
