<template>
  <article class="not-found">
    <h1 class="not-found__message">This page does not exist.</h1>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFound",
});
</script>

<style lang="scss" src="@/assets/styles/components/not-found.scss"></style>
