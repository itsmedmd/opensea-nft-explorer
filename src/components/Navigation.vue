<template>
  <div class="aside">
    <nav class="aside__nav">
      <ul class="aside__nav-list">
        <li class="aside__nav-item">
          <router-link class="aside__nav-link" to="/"> Home </router-link>
        </li>
        <li class="aside__nav-item">
          <router-link class="aside__nav-link" to="/about"> About </router-link>
        </li>
      </ul>
    </nav>

    <div class="aside__content">
      <div class="aside__list-container" v-if="isHomePage">
        <p class="aside__list-title">Sort by:</p>
        <ul class="aside__list">
          <li class="aside__list-item">
            <button
              class="nav-button"
              :class="{ 'nav-button--active': currentFilter === 'count' }"
              @click="updateFilter('count')"
            >
              Sales count
            </button>
          </li>
          <li class="aside__list-item">
            <button
              class="nav-button"
              :class="{ 'nav-button--active': currentFilter === 'price' }"
              @click="updateFilter('price')"
            >
              Sale price
            </button>
          </li>
          <li class="aside__list-item">
            <button
              class="nav-button"
              :class="{ 'nav-button--active': currentFilter === 'date' }"
              @click="updateFilter('date')"
            >
              Latest sold
            </button>
          </li>
        </ul>
      </div>

      <div class="aside__list-container" v-else>
        <router-link class="nav-button nav-button--back" to="/">
          Go back
        </router-link>
      </div>

      <div class="aside__list-container">
        <p class="aside__list-title">Feeling lucky?</p>
        <ul>
          <li class="aside__list-item">
            <button class="nav-button">Show a random item</button>
          </li>
          <li class="aside__list-item" v-if="isHomePage">
            <button class="nav-button">Randomise the list</button>
          </li>
        </ul>
      </div>

      <div class="aside__logo-container">
        <a href="https://opensea.io" rel="noreferrer">
          <img
            src="../assets/images/opensea-logo.svg"
            alt="OpenSea logo"
            class="aside__logo"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import ListType from "@/types/ListType";
import store from "@/store/store";

export default defineComponent({
  name: "Navigation",
  setup() {
    const route = useRoute();

    const updateFilter = (filter: ListType) => {
      store.updateFilter(filter);
    };

    const currentFilter = computed(() => {
      return store.state.listFilter;
    });

    const isHomePage = computed(() => (route.path === "/" ? true : false));

    return {
      isHomePage,
      currentFilter,
      updateFilter,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/navigation.scss"></style>
