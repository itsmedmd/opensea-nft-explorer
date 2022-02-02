import AssetType from "@/types/AssetType";
import ListType from "@/types/ListType";
import Trait from "@/types/Trait";
import Creator from "@/types/Creator";
import Collection from "@/types/Collection";

import store from "@/store/store";

// create a typed asset object from the raw object
// retrieved from the API that only has the required data
const createAssetObject = (obj: any): AssetType | null => {
  // If there are no graphics to display the NFT -
  // don't add it to the list (return null).
  // Otherwise, the priority is as follows:
  // 1. image_preview_url
  // 2. image_url
  // 3. image_original_url
  let priority_image_url = "";
  if (obj.image_preview_url) {
    priority_image_url = obj.image_preview_url;
  } else if (obj.image_url) {
    priority_image_url = obj.image_url;
  } else if (obj.image_original_url) {
    priority_image_url = obj.image_original_url;
  } else {
    return null;
  }

  const hd_image_url: string | null =
    obj.image_url ?? obj.image_original_url ?? null;

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
    hd_image_url,
    priority_image_url,
    animation_url: obj.animation_url ?? null,
    traits: assetTraits,
    creator: assetCreator,
    collection: assetCollection,
  };

  return asset;
};

// fetches an asset list of 50 assets ordered by 'filter'.
// 'maxRepeatCount' defines how many times the fetch will
// be repeated in case of failure.
// 'iterationNumber' defines the current execution number
// (1 by default and higher if repeating the fetch)
const fetchList = (
  filter: ListType,
  maxRepeatCount = 10,
  iterationNumber = 1
) => {
  store.setIsCurrentlyFetching(filter, true);

  if (iterationNumber === 1) {
    store.setErrorMessage(filter, null);
  } else {
    store.setErrorMessage(
      filter,
      `Retrying ${iterationNumber - 1}/${maxRepeatCount}`
    );
  }

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

  fetch(url, options)
    .then((res) => {
      if (res.status === 200) {
        store.setIsCurrentlyFetching(filter, false);
        store.setErrorMessage(filter, null);
        return res.json();
      } else {
        throw new Error("Failed fetching data");
      }
    })
    .then((res) => {
      // create a list of typed AssetType objects from data
      const newList: AssetType[] = [];
      for (const rawAsset of res.assets) {
        const newAsset: AssetType | null = createAssetObject(rawAsset);
        if (newAsset) {
          newList.push(newAsset);
        }
      }

      store.appendData(newList, filter);
    })
    .catch((err) => {
      if (iterationNumber <= maxRepeatCount) {
        // try to fetch again
        console.error(
          `${err}. Repeating data fetch for ${filter}:[${offset}; ${
            offset + 50
          }]. Tries left: ${maxRepeatCount - iterationNumber}`
        );

        fetchList(filter, maxRepeatCount, iterationNumber + 1);
      } else {
        // stop fetching
        console.error(
          `Failed fetching data for ${filter}:[${offset}; ${
            offset + 50
          }]. Stopping retry.`
        );

        store.setIsCurrentlyFetching(filter, false);
        store.setErrorMessage(filter, "Try Loading Again");
      }
    });
};

export default fetchList;
