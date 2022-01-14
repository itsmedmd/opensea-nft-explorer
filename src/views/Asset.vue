<template>
  <div class="asset">
    <h1>asset - {{ id }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/store";

export default defineComponent({
  name: "Asset",
  props: ["id"],
  setup(props) {
    console.log("hello from asset ", props.id);
    console.log("store in asset:", store.state);
  },
});
</script>
