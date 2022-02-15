import IntersectionObserverOptions from "@/types/IntersectionObserverOptions";
import { Directive } from "vue";

const lazyLoadFunction = (el: HTMLElement) => {
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
        // if the user generates a random asset from within
        // an asset page, first remove the graphics src
        // so that a loader could be shown and the old
        // graphics wouldn't stay visible till new ones load.
        graphicsElement.src = "";
      }
      if (graphicsElement.dataset.url) {
        graphicsElement.src = graphicsElement.dataset.url;
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
