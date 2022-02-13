import IntersectionObserverOptions from "@/types/IntersectionObserverOptions";
import { Directive } from "vue";

const LazyloadDirective: Directive = {
  mounted: (el: HTMLElement) => {
    function loadImage() {
      const imageElement = Array.from(el.children).find(
        (el) => el.nodeName === "IMG"
      ) as HTMLImageElement;

      if (imageElement) {
        imageElement.addEventListener("load", () => {
          el.classList.add("loaded");
        });

        if (imageElement.dataset.url) {
          imageElement.src = imageElement.dataset.url;
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
