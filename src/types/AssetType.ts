import Trait from "./Trait";
import Creator from "./Creator";
import Collection from "./Collection";
import Ownership from "./Ownership";

interface AssetType {
  id: string;
  permalink: string;
  token_id: string;
  priority_image_url: string;
  asset_contract: {
    address: string;
  };
  name: string | null;
  description: string | null;
  num_sales: number | null;
  animation_url: string | null;
  hd_image_url: string | null;
  creator: Creator | null;
  collection: Collection | null;
  traits: Trait[] | null;
  ownerships: Ownership[] | null;
}

export default AssetType;
