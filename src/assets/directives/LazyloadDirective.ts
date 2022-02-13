import IntersectionObserverOptions from "@/types/IntersectionObserverOptions";
import { Directive } from "vue";

const LazyloadDirective: Directive = {
  mounted: (el: HTMLElement) => {
    function loadImage() {
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
  },
};

export default LazyloadDirective;
