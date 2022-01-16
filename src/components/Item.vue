<template>
  <router-link :to="'/asset/' + data.id" custom v-slot="{ navigate }">
    <div role="link" @click="navigate">
      <img :src="data.image_preview_url" :alt="data.name + ' image'" />
      <div class="item__info">
        <p>{{ data.collection.name }}</p>
        <p>{{ data.name }}</p>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import AssetType from "@/types/AssetType";

export default defineComponent({
  name: "Item",
  props: {
    data: {
      required: true,
      type: Object as PropType<AssetType>,
    },
  },
});
</script>

<style></style>
