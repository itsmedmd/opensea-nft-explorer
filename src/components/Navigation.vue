<template>
  <aside class="aside">
    <nav class="aside__nav">
      <ul class="aside__nav-list">
        <li class="aside__nav-item">
          <router-link
            class="aside__nav-link"
            to="/"
            @click="conditionallyToggleNavigation"
          >
            Home
          </router-link>
        </li>
        <li class="aside__nav-item">
          <router-link
            class="aside__nav-link"
            to="/about"
            @click="conditionallyToggleNavigation"
          >
            About
          </router-link>
        </li>
        <li class="aside__nav-item-mobile">
          <button
            @click="toggleNavigation"
            type="button"
            class="button cta-button aside__nav-mobile-button"
            aria-controls="navigation-content"
            :aria-expanded="showMobileNav"
          >
            Menu
          </button>
        </li>
      </ul>
    </nav>

    <div
      id="navigation-content"
      class="aside__content"
      :class="{ 'aside__content--mobile': showMobileNav }"
    >
      <div class="aside__list-container" v-if="isHomePage">
        <p class="aside__list-title">Sort by:</p>
        <ul class="aside__list">
          <li class="aside__list-item" v-if="isHomePage">
            <button
              class="nav-button"
              :class="{ 'nav-button--active': currentFilter === 'default' }"
              :disabled="currentFilter === 'default'"
              @click="updateFilter('default')"
            >
              Random
            </button>
          </li>
          <li class="aside__list-item">
            <button
              class="nav-button"
              :class="{ 'nav-button--active': currentFilter === 'sale_count' }"
              :disabled="currentFilter === 'sale_count'"
              @click="updateFilter('sale_count')"
            >
              Sales count
            </button>
          </li>
          <li class="aside__list-item">
            <button
              class="nav-button"
              :class="{ 'nav-button--active': currentFilter === 'sale_date' }"
              :disabled="currentFilter === 'sale_date'"
              @click="updateFilter('sale_date')"
            >
              Latest sold
            </button>
          </li>
        </ul>
      </div>

      <div class="aside__list-container" v-else>
        <router-link
          class="nav-button nav-button--back"
          to="/"
          @click="conditionallyToggleNavigation"
        >
          Go back
        </router-link>
      </div>

      <div class="aside__list-container">
        <p class="aside__list-title">Feeling lucky?</p>
        <ul>
          <li class="aside__list-item">
            <button v-if="loaderText" class="nav-button">
              <div class="spinner spinner--button"></div>
              {{ loaderText }}
            </button>
            <button v-else class="nav-button" @click="showRandomAsset">
              {{ refetchText ? refetchText : "Show a random item" }}
            </button>
          </li>
        </ul>
      </div>

      <div class="aside__logo-container">
        <p class="aside__logo-title">Powered by:</p>
        <a href="https://opensea.io" rel="noreferrer" class="aside__logo-link">
          <img
            src="../assets/images/opensea-logo.svg"
            alt="OpenSea logo"
            class="aside__logo"
          />
        </a>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import ListType from "@/types/ListType";
import store from "@/store/store";
import fetchList from "@/assets/scripts/fetchList";
import scrollToTop from "@/assets/scripts/scrollToTop";

import { debounce } from "debounce";

export default defineComponent({
  name: "Navigation",
  setup(props, { emit }) {
    const route = useRoute();
    const currentFilter = computed(() => store.state.listFilter);
    const isHomePage = computed(() => (route.path === "/" ? true : false));
    const showMobileNav = ref<boolean>(false);

    const toggleNavigation = () => {
      showMobileNav.value = !showMobileNav.value;
      emit("mobileToggle", showMobileNav.value);
    };

    // turn off navigation if the user is
    // navigating from mobile navigation menu
    const conditionallyToggleNavigation = () => {
      // start the page at the top
      scrollToTop();

      if (showMobileNav.value) {
        toggleNavigation();
      }
    };

    // disable mobile navigation if it is turned on
    // when the screen becomes wider than 768px
    const disableMobileNavigationOnResize = () => {
      if (window.innerWidth > 768) {
        conditionallyToggleNavigation();
      }
    };

    const updateFilter = (filter: ListType) => {
      store.updateFilter(filter);
      conditionallyToggleNavigation();

      // start the page at the top
      scrollToTop();

      // if there is no data for the new filter and currently
      // there is no fetch in progress for it - fetch it
      if (
        store.state.pageCount === 0 &&
        !store.getIsCurrentlyFetching(filter)
      ) {
        fetchList(store.state.listFilter);
      }
    };

    const showRandomAsset = () => {
      fetchList("random_asset", 2);
    };

    // if there is a fetch for a random asset data,
    // the loader should be visible.
    // if the loader is visible - compute the loader text.
    const loaderText = computed(() => {
      if (store.getIsCurrentlyFetching("random_asset")) {
        const errorMessage = store.getErrorMessage("random_asset");
        if (errorMessage) {
          // 1. If there is an error, then show the loader with the error message.
          return errorMessage;
        } else {
          // 2. If there is no error, then show the default loader message.
          return "Loading";
        }
      }

      // turn off mobile navigation in case it was on
      if (loaderText.value) {
        conditionallyToggleNavigation();
      }

      // 3. Stop showing the loader
      return null;
    });

    // if there is no longer a fetch for data in progress
    // and there is an error - show a text for manual refetch.
    const refetchText = computed(() => {
      const errorMessage = store.getErrorMessage("random_asset");
      if (!store.getIsCurrentlyFetching("random_asset") && errorMessage) {
        // 1. Show the manual refetch text.
        return errorMessage;
      }

      // 2. Don't show the manual refetch text.
      return null;
    });

    // Add event listener on window to listen for resize
    // to disable navigation if the navigation was enabled
    // but the user resized the screen.
    // * Also debounce the function execution for 30ms.
    onMounted(() => {
      window.onresize = debounce(disableMobileNavigationOnResize, 20);
    });

    return {
      isHomePage,
      currentFilter,
      showMobileNav,
      loaderText,
      refetchText,
      updateFilter,
      toggleNavigation,
      conditionallyToggleNavigation,
      scrollToTop,
      showRandomAsset,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/navigation.scss"></style>
