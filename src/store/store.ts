import { reactive } from "vue";
import ListType from "@/types/ListType";
import AssetType from "@/types/AssetType";
import ListStore from "@/types/ListStore";

const myState: ListStore = {
  dataBySaleCount: [],
  dataBySalePrice: [],
  dataBySaleDate: [],
  isCurrentlyFetchingCount: false,
  isCurrentlyFetchingPrice: false,
  isCurrentlyFetchingDate: false,
  listFilter: "sale_count",
  pageNumber: 0,
  itemsPerPage: 16,
  pageCount: 0,
  currentDataCount: 0,
};

const store = {
  state: reactive(myState),
  appendData(newData: AssetType[], filter: ListType): void {
    if (filter === "sale_count") {
      this.state.dataBySaleCount = this.state.dataBySaleCount.concat(newData);
    } else if (filter === "sale_price") {
      this.state.dataBySalePrice = this.state.dataBySalePrice.concat(newData);
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
  setInformationByFilter(filter: ListType): void {
    if (filter === "sale_count") {
      this.state.pageCount = Math.floor(
        this.state.dataBySaleCount.length / store.state.itemsPerPage
      );
      this.state.currentDataCount = this.state.dataBySaleCount.length;
    } else if (filter === "sale_price") {
      this.state.pageCount = Math.floor(
        this.state.dataBySalePrice.length / store.state.itemsPerPage
      );
      this.state.currentDataCount = this.state.dataBySalePrice.length;
    } else {
      this.state.pageCount = Math.floor(
        this.state.dataBySaleDate.length / store.state.itemsPerPage
      );
      this.state.currentDataCount = this.state.dataBySaleDate.length;
    }
  },
  setIsCurrentlyFetching(filter: ListType, value: boolean) {
    if (filter === "sale_count") {
      this.state.isCurrentlyFetchingCount = value;
    } else if (filter === "sale_price") {
      this.state.isCurrentlyFetchingPrice = value;
    } else {
      this.state.isCurrentlyFetchingDate = value;
    }
  },
  getIsCurrentlyFetching(filter: ListType): boolean {
    if (filter === "sale_count") {
      return this.state.isCurrentlyFetchingCount;
    } else if (filter === "sale_price") {
      return this.state.isCurrentlyFetchingPrice;
    } else {
      return this.state.isCurrentlyFetchingDate;
    }
  },
};

export default store;
