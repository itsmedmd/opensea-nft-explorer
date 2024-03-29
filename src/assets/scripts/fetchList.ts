import AssetType from "@/types/AssetType";
import ListType from "@/types/ListType";
import store from "@/store/store";
import redirectToAsset from "./redirectToAsset";
import createAssetObject from "./createAssetObject";

// Fetches an asset list of 50 assets ordered by 'filter'.
// * 'maxRepeatCount' defines how many times the fetch will
//    be repeated in case of failure.
// * 'iterationNumber' defines the current execution number
//    (1 by default and higher if repeating the fetch)
const fetchList = (
  filter: ListType,
  maxRepeatCount = 10,
  iterationNumber = 1
) => {
  store.setIsCurrentlyFetching(filter, true);

  // set "Retrying x/n" message if there are multiple
  // failed attempts to get data
  if (iterationNumber === 1) {
    store.setErrorMessage(filter, null);
  } else {
    store.setErrorMessage(
      filter,
      `Retrying ${iterationNumber - 1}/${maxRepeatCount}`
    );
  }

  // set the list offset based on provided filter
  let offset = store.getOffset(filter);
  let limit = 50;
  let fetchFilter: ListType = filter;

  // * if the filter is "random_asset", then:
  //    1. Change fetch limit (object count) to 1
  //    2. Change fetch filter to sale_count
  if (filter === "random_asset") {
    // random asset will be retrieved from the sale_count sorting
    fetchFilter = "sale_count";

    // there will be only 1 asset retrieved
    limit = 1;

    // If this is the first time fetching this current asset -
    // create a random offset.
    // * Offset is not equal to 0 only when refetching due to an error.
    if (offset === 0) {
      offset = Math.floor(Math.random() * 1000) + 1000;
      store.setOffset(filter, offset);
    }
  }

  const url =
    "https://iwtqvh6zbi.execute-api.eu-central-1.amazonaws.com/beta/fetchlist";
  const options = {
    method: "POST",
    body: JSON.stringify({
      filter: fetchFilter,
      offset,
      limit,
    }),
  };

  fetch(url, options)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("Failed fetching data");
      }
    })
    .then((res) => {
      // create a list of typed AssetType objects from data
      const newList: AssetType[] = [];
      if (res.assets) {
        for (const rawAsset of res.assets) {
          const newAsset: AssetType | null = createAssetObject(rawAsset);
          if (newAsset) {
            newList.push(newAsset);
          }
        }
      }

      // if all entries in the list were filtered out, then start a new fetch.
      // By default push the offset forwards by 'offset + limit'
      // but if the filter is random_asset, make it 0 so that
      // a new random offset will be generated for it.
      if (!newList.length) {
        if (filter === "random_asset") {
          store.setOffset(filter, 0);
        } else {
          store.setOffset(filter, offset + limit);
        }

        setTimeout(() => {
          fetchList(filter, maxRepeatCount);
        }, 1000);
      } else if (newList.length && filter === "random_asset") {
        // if there is an item in the list and the filter
        // is "random_asset", then redirect to that asset page
        redirectToAsset(newList[0].id);
      }

      store.appendData(newList, filter);

      // set a new offset for future fetches
      if (filter === "random_asset") {
        store.setOffset(filter, 0);
      } else {
        store.setOffset(filter, offset + limit);
      }

      store.setIsCurrentlyFetching(filter, false);
      store.setErrorMessage(filter, null);
    })
    .catch((err) => {
      if (iterationNumber <= maxRepeatCount) {
        // try to fetch again
        console.error(
          `${err}. Repeating data fetch for ${filter}:[${offset}; ${
            offset + limit
          }]. Tries left: ${maxRepeatCount - iterationNumber}`
        );

        setTimeout(() => {
          fetchList(filter, maxRepeatCount, iterationNumber + 1);
        }, 1000);
      } else {
        // stop fetching
        console.error(
          `Failed fetching data for ${filter}:[${offset}; ${
            offset + limit
          }]. Stopping retry.`
        );

        if (filter === "random_asset") {
          // In case there is no data for the current offset of
          // random_asset, set the future offset to 0 so a new
          // random offset would be generated
          store.setOffset(filter, 0);
        }

        store.setIsCurrentlyFetching(filter, false);
        store.setErrorMessage(filter, "Try Loading Again");
      }
    });
};

export default fetchList;
