<template>
  <article class="asset-info">
    <div class="asset-info__left-column">
      <section class="asset-info__section">
        <figure v-lazyload class="asset-info__graphics-container">
          <video
            v-if="finalData.animation_url"
            controls
            autoplay
            loop
            muted
            :data-url="finalData.animation_url"
            class="asset-info__graphics"
          />
          <img
            v-else
            :data-url="finalData.hd_image_url ?? finalData.priority_image_url"
            class="asset-info__graphics"
          />
          <div class="asset-info__graphics-loader">
            <div class="spinner"></div>
          </div>
        </figure>

        <div class="asset-info__logo-container">
          <a
            :href="finalData.permalink"
            rel="noreferrer"
            class="cta-button asset-info__logo-link"
          >
            <img
              src="../assets/images/opensea-badge.svg"
              alt="OpenSea logo"
              class="asset-info__logo-image"
            />
            View asset in OpenSea
          </a>
        </div>
      </section>
      <section
        v-if="finalData.name || finalData.description"
        class="asset-info__section"
      >
        <p
          v-if="finalData.name"
          :class="{ 'asset-info__name--no-margin': !finalData.description }"
          class="asset-info__name"
        >
          {{ finalData.name }}
        </p>
        <p v-if="finalData.description" class="asset-info__description">
          {{ finalData.description }}
        </p>
      </section>
    </div>
    <div class="asset-info__right-column">
      <section class="asset-info__section">
        <p
          class="asset-info__sales-text"
          :class="{
            'asset-info__sales-text--no-border':
              !finalData.creator && !finalData.collection,
          }"
        >
          Total sales: {{ finalData.num_sales ?? 0 }}
        </p>
        <div :class="{ 'asset-info__sub-section': finalData.collection }">
          <p class="asset-info__sub-section-title">Creator:</p>
          <UserData
            :imgSource="finalData?.creator?.profile_img_url ?? ''"
            :username="finalData?.creator?.username ?? ''"
            dataType="user"
            :isBig="true"
          />
        </div>
        <div>
          <p class="asset-info__sub-section-title">Collection:</p>
          <UserData
            :imgSource="finalData?.collection?.image_url ?? ''"
            :username="finalData?.collection?.name ?? ''"
            dataType="collection"
            :isBig="true"
          />
        </div>
      </section>
      <section class="asset-info__section">
        <p class="asset-info__section-title">Asset Traits:</p>
        <div v-if="finalData.traits?.length">
          <div
            v-for="(trait, i) in finalData.traits"
            :key="trait.trait_type + i"
            class="asset-info__trait"
          >
            <p class="asset-info__tait-type">{{ trait.trait_type }}:</p>
            <p class="asset-info__tait-value">{{ trait.value }}</p>
          </div>
        </div>
        <p v-else>This asset has no traits</p>
      </section>
      <section class="asset-info__section">
        <p class="asset-info__section-title">Top Public Owners:</p>
        <div v-if="finalData.ownerships?.length">
          <div
            v-for="(own, i) in finalData.ownerships"
            :key="'own' + i"
            class="asset-info__ownership"
          >
            <p class="asset-info__ownership-quantity">
              {{ own.quantity }}
            </p>
            <div v-if="own.owner">
              <UserData
                :imgSource="own.owner.profile_img_url ?? ''"
                :username="own.owner.username ?? ''"
                dataType="user"
              />
            </div>
            <p v-else class="bold">Anonymous User</p>
          </div>
        </div>
        <div v-else-if="isFetchingOwnerships" class="spinner"></div>
        <p v-else>Currently there are no public owners of this asset</p>
      </section>
    </div>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import AssetType from "@/types/AssetType";
import UserData from "@/components/UserData.vue";
import LazyloadDirective from "@/assets/directives/LazyloadDirective";

export default defineComponent({
  name: "AssetInformation",
  directives: {
    lazyload: LazyloadDirective,
  },
  components: {
    UserData,
  },
  props: {
    data: {
      required: true,
      type: Object as PropType<AssetType>,
    },
    extraData: {
      required: false,
      type: Object as PropType<AssetType | null>,
    },
    isFetchingOwnerships: {
      required: true,
      type: Boolean,
    },
  },
  setup(props) {
    const finalData = computed(() => {
      const tempData = props.data;
      // if there are both data and extraData,
      // then it means that data is priorityData and
      // extraData is individualData, so add top ownerships
      // form individualData to the combined data because
      // priorityData doesn't have information about top ownerships.
      if (props.extraData?.ownerships?.length) {
        tempData.ownerships = props.extraData.ownerships;
      }

      return tempData;
    });

    return {
      finalData,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/asset-info.scss"></style>
