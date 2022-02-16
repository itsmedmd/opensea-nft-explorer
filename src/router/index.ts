import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Asset from "../views/Asset.vue";
import NotFound from "../views/NotFound.vue";

const defaultTitle = "Deimantas Butėnas - OpenSea NFT Explorer";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: `${defaultTitle} - Home`,
    },
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      title: `${defaultTitle} - About`,
    },
  },
  {
    path: "/asset/:id",
    name: "Asset",
    component: Asset,
    props: true,
    meta: {
      title: `${defaultTitle} - Asset`,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: `${defaultTitle} - Not Found`,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
