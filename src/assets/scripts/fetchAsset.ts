import AssetType from "@/types/AssetType";
import store from "@/store/store";
import createAssetObject from "./createAssetObject";

// fetches an asset based on its address and id
// 'maxRepeatCount' defines how many times the fetch will
// be repeated in case of failure.
// 'iterationNumber' defines the current execution number
// (1 by default and higher if repeating the fetch)
const fetchAsset = (
  asset_address: string,
  asset_id: string,
  maxRepeatCount = 10,
  iterationNumber = 1
) => {
  // if this is the first time seeing this individual asset,
  // generate default data for it
  if (!store.getAssetData(asset_address, asset_id)) {
    store.generateDefaultAsset(asset_address, asset_id);
  }
  store.setAssetIsCurrentlyFetching(asset_address, asset_id, true);

  const url =
    "https://iwtqvh6zbi.execute-api.eu-central-1.amazonaws.com/beta/fetchasset";
  const options = {
    method: "POST",
    body: JSON.stringify({
      asset_address,
      asset_id,
    }),
  };

  fetch(url, options)
    .then((res) => {
      if (res.status === 200) {
        store.setAssetIsCurrentlyFetching(asset_address, asset_id, false);
        store.setAssetErrorMessage(asset_address, asset_id, null);
        return res.json();
      } else {
        throw new Error("Failed fetching asset");
      }
    })
    .then((res) => {
      const newAsset: AssetType | null = createAssetObject(res);
      store.setAssetData(asset_address, asset_id, newAsset);
    })
    .catch((err) => {
      if (iterationNumber <= maxRepeatCount) {
        // try to fetch again
        console.error(
          `${err}. Repeating data fetch for ${asset_address}/${asset_id}.
          Tries left: ${maxRepeatCount - iterationNumber}`
        );

        fetchAsset(
          asset_address,
          asset_id,
          maxRepeatCount,
          iterationNumber + 1
        );
      } else {
        // stop fetching
        console.error(
          `Failed fetching data for ${asset_address}/${asset_id}.
          Stopping retry.`
        );

        store.setAssetIsCurrentlyFetching(asset_address, asset_id, false);
        store.setAssetErrorMessage(
          asset_address,
          asset_id,
          "Try Loading Again"
        );
      }
    });
};

export default fetchAsset;
