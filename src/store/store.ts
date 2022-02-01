import { reactive } from "vue";
import ListType from "@/types/ListType";
import AssetType from "@/types/AssetType";
import ListStore from "@/types/ListStore";

const myState: ListStore = {
  dataBySaleCount: [],
  dataByDefault: [],
  dataBySaleDate: [],
  isCurrentlyFetchingCount: false,
  isCurrentlyFetchingDefault: false,
  isCurrentlyFetchingDate: false,
  listFilter: "default",
  pageNumber: 0,
  itemsPerPage: 16,
  pageCount: 0,
};

const store = {
  state: reactive(myState),
  appendData(newData: AssetType[], filter: ListType): void {
    if (filter === "sale_count") {
      this.state.dataBySaleCount = this.state.dataBySaleCount.concat(newData);
    } else if (filter === "default") {
      this.state.dataByDefault = this.state.dataByDefault.concat(newData);
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
    } else if (filter === "default") {
      this.state.pageCount = Math.floor(
        this.state.dataByDefault.length / store.state.itemsPerPage
      );
    } else {
      this.state.pageCount = Math.floor(
        this.state.dataBySaleDate.length / store.state.itemsPerPage
      );
    }
  },
  setIsCurrentlyFetching(filter: ListType, value: boolean) {
    if (filter === "sale_count") {
      this.state.isCurrentlyFetchingCount = value;
    } else if (filter === "default") {
      this.state.isCurrentlyFetchingDefault = value;
    } else {
      this.state.isCurrentlyFetchingDate = value;
    }
  },
  getIsCurrentlyFetching(filter: ListType): boolean {
    if (filter === "sale_count") {
      return this.state.isCurrentlyFetchingCount;
    } else if (filter === "default") {
      return this.state.isCurrentlyFetchingDefault;
    } else {
      return this.state.isCurrentlyFetchingDate;
    }
  },
};

export default store;
