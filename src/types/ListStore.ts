import AssetType from "./AssetType";
import AssetObjectEntry from "./AssetObjectEntry";
import ListType from "./ListType";

interface ListStore {
  offsetSaleCount: number;
  offsetDefault: number;
  offsetSaleDate: number;
  offsetRandomAsset: number;
  dataBySaleCount: AssetType[];
  dataByDefault: AssetType[];
  dataBySaleDate: AssetType[];
  dataRandomAsset: AssetType[];
  isCurrentlyFetchingCount: boolean;
  isCurrentlyFetchingDefault: boolean;
  isCurrentlyFetchingDate: boolean;
  isCurrentlyFetchingRandomAsset: boolean;
  errorForSaleCount: string | null;
  errorForDefault: string | null;
  errorForSaleDate: string | null;
  errorForRandomAsset: string | null;
  listFilter: ListType;
  pageNumber: number;
  itemsPerPage: number;
  pageCount: number;
  assets: { [key: string]: AssetObjectEntry };
}

export default ListStore;
