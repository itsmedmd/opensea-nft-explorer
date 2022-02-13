<template>
  <router-link :to="'/asset/' + data.id">
    <div class="item">
      <img
        v-lazyload
        :data-url="data.preview_image_url"
        :alt="data.name + ' image'"
        class="item__image"
      />
      <div class="item__info">
        <p class="item__collection">{{ collectionName }}</p>
        <p class="item__name">{{ itemName }}</p>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import AssetType from "@/types/AssetType";
import LazyloadDirective from "@/assets/directives/LazyloadDirective";

export default defineComponent({
  name: "Item",
  directives: {
    lazyload: LazyloadDirective,
  },
  props: {
    data: {
      required: true,
      type: Object as PropType<AssetType>,
    },
  },
  setup(props) {
    const collectionName = computed(() => {
      if (
        props.data.collection?.name &&
        props.data.collection.name.length > 30
      ) {
        return props.data.collection.name.slice(0, 30) + "...";
      }
      return props.data.collection?.name ? props.data.collection.name : "";
    });

    const itemName = computed(() => {
      if (props.data.name && props.data.name.length > 50) {
        return props.data.name.slice(0, 50) + "...";
      }
      return props.data.name ? props.data.name : "";
    });

    return {
      collectionName,
      itemName,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/item.scss"></style>
