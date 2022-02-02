<template>
  <div class="asset">
    <div class="asset_content" v-if="priorityData">
      priorityData: {{ priorityData.name }}
      <br />
      priorityData: {{ individualData?.asset ? individualData.asset.name : "" }}
    </div>
    <div class="asset_content" v-else-if="individualData?.asset">
      individualData: {{ individualData.asset.name }}
    </div>
    <div class="asset_loader" v-else>Loading</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import fetchAsset from "@/assets/scripts/fetchAsset";
import store from "@/store/store";

import AssetType from "@/types/AssetType";

export default defineComponent({
  name: "Asset",
  props: ["id"],
  setup(props) {
    const splitUrl = props.id.split("-");
    const address = splitUrl[0];
    const id = splitUrl[1];

    // data that would already be present from fetching the lists
    const priorityData = computed(() => {
      let data: AssetType | null = null;

      // first try to find the asset in the list by currently set filter
      if (store.state.listFilter === "sale_count") {
        data =
          store.state.dataBySaleCount.find((el) => el.id === props.id) ?? null;
      } else if (store.state.listFilter === "default") {
        data =
          store.state.dataByDefault.find((el) => el.id === props.id) ?? null;
      } else {
        data =
          store.state.dataBySaleDate.find((el) => el.id === props.id) ?? null;
      }

      if (data) return data;

      // if the asset was not found by filter, it means that no data is present yet
      // and the individual asset page was accessed directly through the URL
      // so try to look for data in all filters in case the asset belongs to
      // another filter, which could already have the data
      data = store.state.dataByDefault.find((el) => el.id === props.id) ?? null;
      if (data) return data;

      data =
        store.state.dataBySaleCount.find((el) => el.id === props.id) ?? null;
      if (data) return data;

      data =
        store.state.dataBySaleDate.find((el) => el.id === props.id) ?? null;
      if (data) return data;

      return null;
    });

    // data that is fetched for individual asset.
    // only 'top_ownerships' is needed from here.
    // other data is only used as a fallback in case
    // 'priorityData' does not exist
    const individualData = computed(() => store.getAssetData(address, id));

    onMounted(() => {
      // fetch asset data if:
      // 1. There is no data (not even default)
      // 2. There is default data but no fetch is in progress
      if (
        !individualData.value ||
        (!individualData.value.asset &&
          !individualData.value.isCurrentlyFetching)
      ) {
        fetchAsset(address, id);
      }
    });

    return {
      individualData,
      priorityData,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/asset.scss"></style>
