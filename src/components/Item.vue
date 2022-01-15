<template>
  <div class="item">{{ data.name }} //</div>
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
  setup() {
    //<router-link to="/asset/15">test</router-link>
  },
});
</script>

<style></style>
