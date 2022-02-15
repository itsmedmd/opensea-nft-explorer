import router from "@/router/index";

const redirectToAsset = (id: string) => {
  router.push(`/asset/${id}`);
};

export default redirectToAsset;
