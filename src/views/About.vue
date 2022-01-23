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
          text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam totam optio asperiores, beatae aperiam voluptatem voluptatum est, repellendus dicta amet quasi. Officiis similique alias obcaecati labore expedita reiciendis ducimus rem!",
        },
        {
          title: "What are NFTs?",
          text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam totam optio asperiores, beatae aperiam voluptatem voluptatum est, repellendus dicta amet quasi. Officiis similique alias obcaecati labore expedita reiciendis ducimus rem!",
        },
        {
          title: "What is OpenSea?",
          text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam totam optio asperiores, beatae aperiam voluptatem voluptatum est, repellendus dicta amet quasi. Officiis similique alias obcaecati labore expedita reiciendis ducimus rem!",
        },
      ],
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/about.scss"></style>
