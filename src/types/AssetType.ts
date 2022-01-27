import Trait from "./Trait";
import Creator from "./Creator";
import Collection from "./Collection";

interface AssetType {
  id: string;
  permalink: string;
  token_id: string;
  asset_contract: {
    address: string;
  };
  name: string | null;
  description: string | null;
  num_sales: number | null;
  image_preview_url: string | null;
  animation_url: string | null;
  image_original_url: string | null;
  image_url: string | null;
  creator: Creator | null;
  collection: Collection | null;
  traits: Trait[] | null;
}

export default AssetType;
