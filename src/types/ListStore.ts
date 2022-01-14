import AssetType from "./AssetType";

interface ListStore {
  dataBySaleCount: AssetType[];
  dataBySalePrice: AssetType[];
  dataBySaleDate: AssetType[];
}

export default ListStore;
