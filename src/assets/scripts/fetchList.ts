import AssetType from "@/types/AssetType";
import ListType from "@/types/ListType";
import store from "@/store/store";
import createAssetObject from "./createAssetObject";

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

  const url =
    "https://iwtqvh6zbi.execute-api.eu-central-1.amazonaws.com/beta/fetchlist";
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

        store.setIsCurrentlyFetching(filter, false);
        store.setErrorMessage(filter, "Try Loading Again");
      }
    });
};

export default fetchList;
