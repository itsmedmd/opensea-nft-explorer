<template>
  <article class="about">
    <section
      v-for="article in articles"
      :key="article.title"
      class="about__section"
    >
      <p class="about__section-title">
        {{ article.title }}
      </p>
      <p class="about__section-text">
        {{ article.text }}
      </p>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  data() {
    return {
      articles: [
        {
          title: "About the project:",
          text: "This project uses an API provided by OpenSea to fetch and display assets (NFTs) based on various properties - such as the most popular NFTs, the most recently sold assets or the highest sale price.",
        },
        {
          title: "What are NFTs?",
          text: "Non-fungible tokens (NFTs) are one of the fastest growing assets in the crypto industry. An NFT is a unique, non-interchangeable unit of data. It contains a piece of identifying information that makes it distinguishable from all other tokens. Because no two tokens are the same, they cannot be traded or exchanged at an equivalent rate or broken down into smaller units like currency.",
        },
        {
          title: "What is OpenSea?",
          text: "OpenSea is the world's first and largest NFT marketplace where people can create, discover, collect, and sell NFTs.",
        },
      ],
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/about.scss"></style>
