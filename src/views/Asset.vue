<template>
  <article class="asset">
    <h1
      ref="headingRef"
      class="sr-only"
      aria-live="assertive"
      :tabindex="isHeadingFocusable ? 0 : -1"
    >
      Asset page
    </h1>
    <AssetInformation
      v-if="priorityData && showPriority"
      :data="priorityData"
      :isFetchingOwnerships="
        individualData ? individualData.isCurrentlyFetching : true
      "
      :extraData="individualData?.asset ? individualData.asset : null"
    />
    <AssetInformation
      v-else-if="individualData?.asset && !showPriority"
      :data="individualData.asset"
      :isFetchingOwnerships="individualData.isCurrentlyFetching"
    />
    <div v-else>
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
      <div v-else>
        <NotFound />
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onMounted, watch } from "vue";
import NotFound from "@/views/NotFound.vue";
import AssetInformation from "@/components/AssetInformation.vue";

import fetchAsset from "@/assets/scripts/fetchAsset";
import store from "@/store/store";
import AssetType from "@/types/AssetType";
import scrollToTop from "@/assets/scripts/scrollToTop";

export default defineComponent({
  name: "Asset",
  props: ["id"],
  components: {
    NotFound,
    AssetInformation,
  },
  setup(props) {
    const headingRef = ref<HTMLElement | null>(null);
    const isHeadingFocusable = ref<boolean>(true);
    const splitUrl = props.id.split("-");
    const address = ref<string>(splitUrl[0]);
    const id = ref<string>(splitUrl[1]);

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

      data =
        store.state.dataRandomAsset.find((el) => el.id === props.id) ?? null;
      if (data) return data;

      return null;
    });

    // data that is fetched for individual asset.
    // only 'top_ownerships' is needed from here.
    // other data is only used as a fallback in case
    // 'priorityData' does not exist
    const individualData = computed(() =>
      store.getAssetData(address.value, id.value)
    );

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

    const manuallyRefetch = () => {
      fetchAsset(address.value, id.value);
    };

    // if there is a fetch for data in progress,
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

    // if there is no longer a fetch for data in progress
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

    // focus heading, then turn off ability to access
    // the element with tab.
    // This is used so that when Asset page is loaded,
    // screen readers would start reading text in order
    // from the start of the page.
    const focusHeading = () => {
      if (headingRef.value) {
        isHeadingFocusable.value = true;
        headingRef.value.focus();
        isHeadingFocusable.value = false;
      }
    };

    // if the address changed from one asset to another
    // and it's a new asset - fetch data for it.
    watch(
      () => props.id,
      () => {
        const splitUrl = props.id.split("-");
        address.value = splitUrl[0];
        id.value = splitUrl[1];

        focusHeading();

        if (isIndividualDataEmpty.value) {
          fetchAsset(address.value, id.value);
        }
      }
    );

    onMounted(() => {
      scrollToTop();
      focusHeading();

      // fetch asset data if there is no individualData
      if (isIndividualDataEmpty.value) {
        fetchAsset(address.value, id.value);
      }
    });

    return {
      headingRef,
      isHeadingFocusable,
      individualData,
      priorityData,
      showPriority,
      loaderText,
      refetchButtonText,
      manuallyRefetch,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/asset.scss"></style>
