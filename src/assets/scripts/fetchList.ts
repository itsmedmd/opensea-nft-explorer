import AssetType from "@/types/AssetType";
import ListType from "@/types/ListType";
import Trait from "@/types/Trait";
import Creator from "@/types/Creator";
import Collection from "@/types/Collection";

import store from "@/store/store";

// create a typed asset object from the raw object
// retrieved from the API that only has the required data
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

// fetches an asset list of 50 assets ordered by 'filter'.
// 'repeatCount' defines how many times the fetch will
// be repeated in case of failure.
const fetchList = (filter: ListType, repeatCount = 5) => {
  store.setIsCurrentlyFetching(filter, true);
  let offset = 0;
  if (filter === "sale_count") {
    offset = store.state.dataBySaleCount.length;
  } else if (filter === "default") {
    offset = store.state.dataByDefault.length;
  } else {
    offset = store.state.dataBySaleDate.length;
  }

  const url = "https://iwtqvh6zbi.execute-api.eu-central-1.amazonaws.com/beta";
  const options = {
    method: "POST",
    body: JSON.stringify({
      filter,
      offset,
    }),
  };

  console.log("fetchList:", filter, offset);

  fetch(url, options)
    .then((res) => {
      if (res.status === 200) {
        store.setIsCurrentlyFetching(filter, false);
        return res.json();
      } else {
        throw new Error(`Failed fetching data.`);
      }
    })
    .then((res) => {
      const newList: AssetType[] = [];
      for (const rawAsset of res.assets) {
        const newAsset = createAssetObject(rawAsset);
        // If there are no graphics (images, videos, gifs)
        // to display the NFT - don't add it to the list
        if (
          newAsset.animation_url ||
          newAsset.image_original_url ||
          newAsset.image_preview_url ||
          newAsset.image_url
        ) {
          newList.push(newAsset);
        }
      }

      store.appendData(newList, filter);
    })
    .catch((err) => {
      console.error(err);

      if (repeatCount > 1) {
        // try to fetch again
        console.log(
          "Repeating data fetch for",
          filter,
          offset,
          ". Tries left:",
          repeatCount - 1
        );
        fetchList(filter, repeatCount - 1);
      } else {
        // stop fetching
        store.setIsCurrentlyFetching(filter, false);
      }
    });
};

export default fetchList;
