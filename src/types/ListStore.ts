import AssetType from "./AssetType";
import AssetObjectEntry from "./AssetObjectEntry";
import ListType from "./ListType";

interface ListStore {
  dataBySaleCount: AssetType[];
  dataByDefault: AssetType[];
  dataBySaleDate: AssetType[];
  isCurrentlyFetchingCount: boolean;
  isCurrentlyFetchingDefault: boolean;
  isCurrentlyFetchingDate: boolean;
  errorForSaleCount: string | null;
  errorForDefault: string | null;
  errorForSaleDate: string | null;
  listFilter: ListType;
  pageNumber: number;
  itemsPerPage: number;
  pageCount: number;
  assets: { [key: string]: AssetObjectEntry };
}

export default ListStore;
