import IntersectionObserverOptions from "@/types/IntersectionObserverOptions";
import store from "@/store/store";
import ListType from "@/types/ListType";
import { Directive, DirectiveBinding } from "vue";

// binding is provided a value if the image is a list item
const lazyLoadFunction = (el: HTMLElement, binding: DirectiveBinding) => {
  function handleLoadStatus(el: HTMLElement, currentFilter: ListType) {
    if (!el.classList.contains("loaded")) {
      store.deleteAsset(binding.value, currentFilter);
    }
  }

  function loadImage() {
    el.classList.remove("loaded");

    const imageElement = Array.from(el.children).find(
      (el) => el.nodeName === "IMG"
    ) as HTMLImageElement;

    const videoElement = Array.from(el.children).find(
      (el) => el.nodeName === "VIDEO"
    ) as HTMLVideoElement;

    let graphicsElement: HTMLImageElement | HTMLVideoElement | null = null;
    if (imageElement) {
      graphicsElement = imageElement;
      imageElement.addEventListener("load", () => {
        el.classList.add("loaded");
      });

      imageElement.addEventListener("error", () => {
        imageElement.alt = "Preview image of asset";
      });
    } else if (videoElement) {
      graphicsElement = videoElement;
      videoElement.addEventListener("loadeddata", () => {
        el.classList.add("loaded");
      });
    }

    if (graphicsElement) {
      if (graphicsElement.src) {
        // if the user generates a random asset from within an asset page,
        // first remove the graphics src so that a loader could be shown and
        // the old graphics wouldn't stay visible
        // (otherwise the old graphics stay visible until the new ones load)
        graphicsElement.src = "";
      }
      if (graphicsElement.dataset.url) {
        graphicsElement.src = graphicsElement.dataset.url;
        if (imageElement && binding.value) {
          // If the image is in a list, after 5 seconds check
          // if the image is loaded. If not - remove it from the list.
          // Also pass in the current list filter to know from which
          // list to delete the asset.
          setTimeout(() => handleLoadStatus(el, store.state.listFilter), 5000);
        }
      }
    }
  }

  function handleIntersect(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage();
        observer.unobserve(el);
      }
    });
  }

  function createObserver() {
    const options: IntersectionObserverOptions = {
      root: null,
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(el);
  }

  if (window["IntersectionObserver"]) {
    createObserver();
  } else {
    loadImage();
  }
};

const LazyloadDirective: Directive = {
  mounted: lazyLoadFunction,
  updated: lazyLoadFunction,
};

export default LazyloadDirective;
