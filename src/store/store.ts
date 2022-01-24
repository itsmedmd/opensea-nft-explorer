import { reactive } from "vue";
import ListType from "@/types/ListType";
import AssetType from "@/types/AssetType";
import ListStore from "@/types/ListStore";

const myState: ListStore = {
  dataBySaleCount: [],
  dataBySalePrice: [],
  dataBySaleDate: [],
  listFilter: "sale_count",
  pageNumber: 0,
  itemsPerPage: 16,
};

const store = {
  state: reactive(myState),
  appendData(newData: AssetType[], type: ListType): void {
    if (type === "sale_count") {
      this.state.dataBySaleCount = this.state.dataBySaleCount.concat(newData);
    } else if (type === "sale_price") {
      this.state.dataBySalePrice = this.state.dataBySalePrice.concat(newData);
    } else {
      this.state.dataBySaleDate = this.state.dataBySaleDate.concat(newData);
    }
  },
  updateFilter(filter: ListType): void {
    this.state.listFilter = filter;
    this.state.pageNumber = 0;
  },
  addToPageNumber(number: number): void {
    this.state.pageNumber += number;
  },
};

export default store;
