import { reactive } from "vue";
import ListType from "@/types/ListType";
import AssetType from "@/types/AssetType";
import AssetObjectEntry from "@/types/AssetObjectEntry";
import ListStore from "@/types/ListStore";

const myState: ListStore = {
  offsetSaleCount: 0,
  offsetDefault: 0,
  offsetSaleDate: 0,
  offsetRandomAsset: 0,
  dataBySaleCount: [],
  dataByDefault: [],
  dataBySaleDate: [],
  dataRandomAsset: [],
  isCurrentlyFetchingCount: false,
  isCurrentlyFetchingDefault: false,
  isCurrentlyFetchingDate: false,
  isCurrentlyFetchingRandomAsset: false,
  errorForSaleCount: null,
  errorForDefault: null,
  errorForSaleDate: null,
  errorForRandomAsset: null,
  listFilter: "default",
  pageNumber: 0,
  itemsPerPage: 16,
  pageCount: 0,
  assets: {},
};

const store = {
  state: reactive(myState),
  appendData(newData: AssetType[], filter: ListType): void {
    if (filter === "sale_count") {
      this.state.dataBySaleCount = this.state.dataBySaleCount.concat(newData);
    } else if (filter === "default") {
      this.state.dataByDefault = this.state.dataByDefault.concat(newData);
    } else if (filter === "random_asset") {
      this.state.dataRandomAsset = this.state.dataRandomAsset.concat(newData);
    } else {
      this.state.dataBySaleDate = this.state.dataBySaleDate.concat(newData);
    }
    this.setInformationByFilter(filter);
  },
  updateFilter(filter: ListType): void {
    this.state.listFilter = filter;
    this.state.pageNumber = 0;
    this.setInformationByFilter(filter);
  },
  addToPageNumber(number: number): void {
    this.state.pageNumber += number;
  },
  setPageNumber(number: number): void {
    this.state.pageNumber = number;
  },
  setInformationByFilter(filter: ListType): void {
    if (filter === "sale_count") {
      this.state.pageCount = Math.floor(
        this.state.dataBySaleCount.length / store.state.itemsPerPage
      );
    } else if (filter === "default") {
      this.state.pageCount = Math.floor(
        this.state.dataByDefault.length / store.state.itemsPerPage
      );
    } else if (filter === "sale_date") {
      this.state.pageCount = Math.floor(
        this.state.dataBySaleDate.length / store.state.itemsPerPage
      );
    }
  },
  setOffset(filter: ListType, offset: number) {
    if (filter === "sale_count") {
      this.state.offsetSaleCount = offset;
    } else if (filter === "default") {
      this.state.offsetDefault = offset;
    } else if (filter === "sale_date") {
      this.state.offsetSaleDate = offset;
    } else {
      this.state.offsetRandomAsset = offset;
    }
  },
  getOffset(filter: ListType) {
    if (filter === "sale_count") {
      return this.state.offsetSaleCount;
    } else if (filter === "default") {
      return this.state.offsetDefault;
    } else if (filter === "sale_date") {
      return this.state.offsetSaleDate;
    } else {
      return this.state.offsetRandomAsset;
    }
  },
  setIsCurrentlyFetching(filter: ListType, value: boolean) {
    if (filter === "sale_count") {
      this.state.isCurrentlyFetchingCount = value;
    } else if (filter === "default") {
      this.state.isCurrentlyFetchingDefault = value;
    } else if (filter === "random_asset") {
      this.state.isCurrentlyFetchingRandomAsset = value;
    } else {
      this.state.isCurrentlyFetchingDate = value;
    }
  },
  getIsCurrentlyFetching(filter: ListType): boolean {
    if (filter === "sale_count") {
      return this.state.isCurrentlyFetchingCount;
    } else if (filter === "default") {
      return this.state.isCurrentlyFetchingDefault;
    } else if (filter === "random_asset") {
      return this.state.isCurrentlyFetchingRandomAsset;
    } else {
      return this.state.isCurrentlyFetchingDate;
    }
  },
  setErrorMessage(filter: ListType, error: string | null): void {
    if (filter === "sale_count") {
      this.state.errorForSaleCount = error;
    } else if (filter === "default") {
      this.state.errorForDefault = error;
    } else if (filter === "random_asset") {
      this.state.errorForRandomAsset = error;
    } else {
      this.state.errorForSaleDate = error;
    }
  },
  getErrorMessage(filter: ListType): string | null {
    if (filter === "sale_count") {
      return this.state.errorForSaleCount;
    } else if (filter === "default") {
      return this.state.errorForDefault;
    } else if (filter === "random_asset") {
      return this.state.errorForRandomAsset;
    } else {
      return this.state.errorForSaleDate;
    }
  },
  generateDefaultAssetData(address: string, id: string) {
    const defaultAsset: AssetObjectEntry = {
      asset: null,
      error: null,
      isCurrentlyFetching: false,
    };

    this.state.assets[`${address}-${id}`] = defaultAsset;
  },
  setAssetData(address: string, id: string, data: AssetType | null) {
    this.state.assets[`${address}-${id}`].asset = data;
  },
  setAssetErrorMessage(address: string, id: string, message: string | null) {
    this.state.assets[`${address}-${id}`].error = message;
  },
  setAssetIsCurrentlyFetching(address: string, id: string, value: boolean) {
    this.state.assets[`${address}-${id}`].isCurrentlyFetching = value;
  },
  getAssetData(address: string, id: string): AssetObjectEntry | null {
    return this.state.assets[`${address}-${id}`] ?? null;
  },
  isStoreEmpty(): boolean {
    if (
      !this.state.isCurrentlyFetchingCount &&
      !this.state.dataBySaleCount.length &&
      !this.state.isCurrentlyFetchingDefault &&
      !this.state.dataByDefault.length &&
      !this.state.isCurrentlyFetchingDate &&
      !this.state.dataBySaleDate.length &&
      !this.state.isCurrentlyFetchingRandomAsset &&
      !this.state.dataRandomAsset.length
    ) {
      return true;
    }
    return false;
  },
};

export default store;
