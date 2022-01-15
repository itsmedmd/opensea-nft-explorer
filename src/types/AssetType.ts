interface Trait {
  trait_type: string;
  value: string;
}

interface Ownership {
  quantity: number;
  owner: {
    profile_img_url: string | null;
    username: string | null;
  };
}

interface AssetType {
  id: string;
  name: string | null;
  description: string | null;
  num_sales: number | null;
  permalink: string;
  token_id: string;
  image_preview_url: string | null;
  animation_url: string | null;
  image_original_url: string | null;
  image_url: string | null;
  asset_contract: {
    address: string;
  };
  creator: {
    profile_img_url: string | null;
    username: string | null;
  };
  collection: {
    name: string;
    image_url: string | null;
  };
  traits: Trait[] | null;
  top_ownerships: Ownership[] | null;
}

export default AssetType;
