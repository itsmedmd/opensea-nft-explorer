import AssetType from "@/types/AssetType";
import ListType from "@/types/ListType";
import Trait from "@/types/Trait";
import Creator from "@/types/Creator";
import Collection from "@/types/Collection";

import store from "@/store/store";

// create a typed asset object that only has the required data
const createAssetObject = (obj: any): AssetType => {
  // create typed asset traits
  const assetTraits: Trait[] = [];
  for (const trait of obj.traits) {
    const newTrait: Trait = {
      trait_type: trait.trait_type,
      value: trait.value,
    };
    assetTraits.push(newTrait);
  }

  // create typed asset creator
  const assetCreator: Creator | null = obj.creator
    ? {
        profile_img_url: obj.creator.profile_img_url ?? null,
        username: obj.creator.user ? obj.creator.user.username : null,
      }
    : null;

  // create typed asset collection
  const assetCollection: Collection | null = obj.collection
    ? {
        name: obj.collection.name ?? null,
        image_url: obj.collection.image_url ?? null,
      }
    : null;

  // create typed asset
  const asset: AssetType = {
    id: `${obj.asset_contract.address}-${obj.token_id}`,
    name: obj.name ?? null,
    permalink: obj.permalink,
    token_id: obj.token_id,
    asset_contract: {
      address: obj.asset_contract.address,
    },
    description: obj.description ?? null,
    num_sales: obj.num_sales ?? null,
    image_preview_url: obj.image_preview_url ?? null,
    animation_url: obj.animation_url ?? null,
    image_original_url: obj.image_original_url ?? null,
    image_url: obj.image_url ?? null,
    traits: assetTraits,
    creator: assetCreator,
    collection: assetCollection,
  };

  return asset;
};

const fetchList = (filter: ListType) => {
  const offset = store.state.currentDataCount;
  const url = `https://api.opensea.io/api/v1/assets?order_by=${filter}&order_direction=desc&offset=${offset}&limit=50`;

  console.log("fetchList:", filter, url);

  const options = {
    method: "GET",
    headers: { Accept: "application/json" },
  };

  fetch(url, options)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error(`Failed to fetch data. ${res.statusText}`);
      }
    })
    .then((res) => {
      const newList: AssetType[] = [];
      for (const rawAsset of res.assets) {
        newList.push(createAssetObject(rawAsset));
      }

      store.appendData(newList, filter);
    })
    .catch((err) => console.error(err));
};

export default fetchList;
