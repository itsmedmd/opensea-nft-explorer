<template>
  <div class="asset">
    <div class="asset_content" v-if="data?.asset">
      {{ data.asset.name }}
    </div>
    <div class="asset_loader" v-else>Loading</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import fetchAsset from "@/assets/scripts/fetchAsset";
import store from "@/store/store";

export default defineComponent({
  name: "Asset",
  props: ["id"],
  setup(props) {
    const splitUrl = props.id.split("-");
    const address = splitUrl[0];
    const id = splitUrl[1];
    const data = computed(() => store.getAssetData(address, id));

    onMounted(() => {
      // fetch asset data if:
      // 1. There is no data (not even default)
      // 2. There is default data but no fetch is in progress
      if (
        !data.value ||
        (!data.value.asset && !data.value.isCurrentlyFetching)
      ) {
        fetchAsset(address, id);
      }
    });

    return {
      data,
    };
  },
});
</script>
