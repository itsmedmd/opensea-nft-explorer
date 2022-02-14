import AssetType from "@/types/AssetType";
import ListType from "@/types/ListType";
import store from "@/store/store";
import createAssetObject from "./createAssetObject";

// Fetches an asset list of 50 assets ordered by 'filter'.
// * 'maxRepeatCount' defines how many times the fetch will
//    be repeated in case of failure.
// * 'iterationNumber' defines the current execution number
//    (1 by default and higher if repeating the fetch)
// * 'addOffset' defines the number that should be
//    added to the current offset of the current filter
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
  // * if the filter is "random_asset", then:
  //    1. Change fetch limit (object count) to 1
  //    2. Change fetch filter to the default one
  let offset = store.getOffset(filter);
  let limit = 50;
  let fetchFilter: ListType = filter;

  if (filter === "random_asset") {
    // random asset will be retrieved from the default sorting
    fetchFilter = "default";

    // there will be only 1 asset retrieved
    limit = 1;

    // if this is the first time fetching a random asset -
    // create a random offset
    if (offset === 0) {
      offset = Math.floor(Math.random() * 2000) + 1600;
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

  console.log(`fetching ${filter}: ${offset}[${limit}]`);

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
      for (const rawAsset of res.assets) {
        const newAsset: AssetType | null = createAssetObject(rawAsset);
        if (newAsset) {
          newList.push(newAsset);
        }
      }

      // if all entries in the list were filtered out, then start a
      // new fetch with the offset pushed forwards by 'offset + limit'
      if (!newList.length) {
        store.setOffset(filter, offset + limit);
        fetchList(filter, maxRepeatCount);
      }

      // The reason for the third argument of 'appendData is to
      // set the new offset to previous offset + limit of the number
      // of items that were being fetched so that the
      // future fetches would start from that new offset
      store.appendData(newList, filter, offset + limit);
      store.setIsCurrentlyFetching(filter, false);
      store.setErrorMessage(filter, null);
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

        if (filter === "random_asset") {
          // In case there is no data for the current offset of
          // random_asset, set the future offset to 0 so
          // that if the user fetches a random asset again,
          // a new random offset would be generated in hopes
          // that it would contain data
          store.setOffset(filter, 0);
        }

        store.setIsCurrentlyFetching(filter, false);
        store.setErrorMessage(filter, "Try Loading Again");
      }
    });
};

export default fetchList;
