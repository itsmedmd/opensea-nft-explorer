import AssetType from "./AssetType";
import ListType from "./ListType";

interface ListStore {
  dataBySaleCount: AssetType[];
  dataBySalePrice: AssetType[];
  dataBySaleDate: AssetType[];
  listFilter: ListType;
  pageNumber: number;
  itemsPerPage: number;
}

export default ListStore;
