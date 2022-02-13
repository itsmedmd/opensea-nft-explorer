import IntersectionObserverOptions from "@/types/IntersectionObserverOptions";
import { Directive } from "vue";

const LazyloadDirective: Directive = {
  mounted: (el: HTMLImageElement) => {
    function loadImage() {
      if (el.dataset.url) {
        console.log("Setting url");
        el.src = el.dataset.url;
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
