<template>
  <article class="asset-info">
    <section class="asset-info__section">
      animation and link:
      <p>animation url: {{ finalData.animation_url }}</p>
      <p>[logo] {{ finalData.permalink }}</p>
    </section>
    <section class="asset-info__section">
      name and description:
      <p>{{ finalData.name }}</p>
      <p>{{ finalData.description }}</p>
    </section>
    <section class="asset-info__section">
      sales, creator and collection:
      <p>{{ finalData.num_sales }}</p>
      <div v-if="finalData.creator">
        <p>{{ finalData.creator.profile_img_url }}</p>
        <p>{{ finalData.creator.username }}</p>
      </div>
      <div v-if="finalData.collection">
        <p>{{ finalData.collection.image_url }}</p>
        <p>{{ finalData.collection.name }}</p>
      </div>
    </section>
    <section class="asset-info__section">
      traits:
      <div v-if="finalData.traits">
        <p v-for="(trait, i) in finalData.traits" :key="trait.trait_type + i">
          {{ trait.trait_type }}: {{ trait.value }}
        </p>
      </div>
    </section>
    <section class="asset-info__section">
      ownerships:
      <div v-if="finalData.ownerships">
        <div v-for="(own, i) in finalData.ownerships" :key="'own' + i">
          <div v-if="own.owner">
            <span>{{ own.owner.profile_img_url }}</span>
            <span>{{ own.owner.username }}</span>
          </div>
          <p>{{ own.quantity }}</p>
        </div>
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import AssetType from "@/types/AssetType";

export default defineComponent({
  name: "AssetInformation",
  props: {
    data: {
      required: true,
      type: Object as PropType<AssetType>,
    },
    extraData: {
      required: false,
      type: Object as PropType<AssetType | null>,
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
