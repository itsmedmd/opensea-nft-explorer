import { reactive } from "vue";
import ListType from "@/types/ListType";
import AssetType from "@/types/AssetType";
import ListStore from "@/types/ListStore";

const myState: ListStore = {
  dataBySaleCount: [],
  dataBySalePrice: [],
  dataBySaleDate: [],
};

const store = {
  state: reactive(myState),
  appendData(newData: AssetType[], type: ListType) {
    if (type === "count") {
      this.state.dataBySaleCount = this.state.dataBySaleCount.concat(newData);
    } else if (type === "price") {
      this.state.dataBySalePrice = this.state.dataBySalePrice.concat(newData);
    } else {
      this.state.dataBySaleDate = this.state.dataBySaleDate.concat(newData);
    }
  },
};

export default store;
