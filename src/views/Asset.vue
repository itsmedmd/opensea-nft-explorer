<template>
  <div class="asset">
    <div class="asset_content" v-if="priorityData && showPriority">
      priorityData: {{ priorityData.name }}
      <br />
      individualData from priorityData:
      {{ individualData?.asset ? individualData.asset.name : "" }}
    </div>
    <div
      class="asset_content"
      v-else-if="individualData?.asset && !showPriority"
    >
      individualData: {{ individualData.asset.name }}
    </div>
    <div class="asset_loader" v-else-if="!showNotFound">
      <div
        class="loader-container loader-container--centered"
        v-if="loaderText"
      >
        <div class="loader">
          <p class="loader-text">{{ loaderText }}</p>
        </div>
      </div>
      <div
        class="loader-container loader-container--centered"
        v-else-if="refetchButtonText"
      >
        <button
          class="loader-text loader-button"
          type="button"
          @click="manuallyRefetch"
        >
          {{ refetchButtonText }}
        </button>
      </div>
    </div>
    <div v-else>
      <NotFound />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import NotFound from "@/views/NotFound.vue";
import fetchAsset from "@/assets/scripts/fetchAsset";
import store from "@/store/store";

import AssetType from "@/types/AssetType";

export default defineComponent({
  name: "Asset",
  props: ["id"],
  components: {
    NotFound,
  },
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

    // individualData is considered empty when:
    // 1. There is no data (not even placeholder(empty))
    // 2. There is placeholder(empty) data but no fetch is in progress
    const isIndividualDataEmpty = computed(
      () =>
        !individualData.value ||
        (!individualData.value.asset &&
          !individualData.value.isCurrentlyFetching)
    );

    // compute whether to prioritise displaying
    // priorityData or individualData.
    // This is needed in case the asset is entered directly
    // through an URL, so that there is no unnecessary re-render.
    const showPriority = computed(() => {
      if (priorityData.value && isIndividualDataEmpty.value) {
        // if there is priorityData and there is no individualData,
        // show priorityData
        return true;
      } else if (
        (!priorityData.value && !isIndividualDataEmpty.value) ||
        (!priorityData.value && isIndividualDataEmpty.value)
      ) {
        // if there is individualData and there is no priorityData
        // OR if there is no data at all,
        // show individualData
        return false;
      }
      // by default (if both priorityData and individualData exist),
      // show priorityData
      return true;
    });

    const showNotFound = computed(() => {
      if (
        !priorityData.value &&
        isIndividualDataEmpty.value &&
        !store.isStoreEmpty()
      ) {
        return true;
      }
      return false;
    });

    const manuallyRefetch = () => {
      fetchAsset(address, id);
    };

    // if the user is on the last page and
    // there is a fetch for data in progress,
    // the loader should be visible.
    // if the loader is visible - compute the loader text.
    const loaderText = computed(() => {
      if (individualData.value?.isCurrentlyFetching) {
        const errorMessage = individualData.value.error;
        if (errorMessage) {
          // 1. If there is an error, then show the loader with the error message.
          return errorMessage;
        } else {
          // 2. If there is no error, then show the default loader message.
          return "Loading";
        }
      }
      // 3. Don't show the loader.
      return null;
    });

    // if the user is on the last page and
    // there is no longer a fetch for data in progress
    // and there is an error - show a button
    // for manual refetch.
    const refetchButtonText = computed(() => {
      const errorMessage = individualData.value?.error;
      if (!individualData.value?.isCurrentlyFetching && errorMessage) {
        // 1. Show the manual refetch button.
        return errorMessage;
      }
      // 2. Don't show the button.
      return null;
    });

    onMounted(() => {
      // fetch asset data if there is no individualData
      if (isIndividualDataEmpty.value) {
        fetchAsset(address, id);
      }
    });

    return {
      individualData,
      priorityData,
      showPriority,
      showNotFound,
      loaderText,
      refetchButtonText,
      manuallyRefetch,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/asset.scss"></style>
