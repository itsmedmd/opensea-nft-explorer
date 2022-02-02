import AssetType from "./AssetType";

interface AssetObjectEntry {
  asset: AssetType | null;
  error: string | null;
  isCurrentlyFetching: boolean;
}

export default AssetObjectEntry;
