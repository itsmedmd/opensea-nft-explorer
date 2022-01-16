<template>
  <div class="asset">
    <h1>address {{ asset_address }}</h1>
    <h1>id {{ asset_id }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/store";

export default defineComponent({
  name: "Asset",
  props: ["id"],
  setup(props) {
    const split = props.id.split("-");
    const asset_address = split[0];
    const asset_id = split[1];
    console.log("store in asset:", store.state);

    return {
      asset_address,
      asset_id,
    };
  },
});
</script>
