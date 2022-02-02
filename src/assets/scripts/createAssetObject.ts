import AssetType from "@/types/AssetType";
import Trait from "@/types/Trait";
import Creator from "@/types/Creator";
import Collection from "@/types/Collection";
import Ownership from "@/types/Ownership";

// create a typed asset object from the raw object
// retrieved from the API that only has the required data
const createAssetObject = (obj: any): AssetType | null => {
  // If there are no graphics to display the NFT -
  // don't add it to the list (return null).
  // Otherwise, the priority is as follows:
  // 1. image_preview_url
  // 2. image_url
  // 3. image_original_url
  let priority_image_url = "";
  if (obj.image_preview_url) {
    priority_image_url = obj.image_preview_url;
  } else if (obj.image_url) {
    priority_image_url = obj.image_url;
  } else if (obj.image_original_url) {
    priority_image_url = obj.image_original_url;
  } else {
    return null;
  }

  const hd_image_url: string | null =
    obj.image_url ?? obj.image_original_url ?? null;

  // create typed asset traits
  const assetTraits: Trait[] = [];
  if (obj.traits) {
    for (const trait of obj.traits) {
      const newTrait: Trait = {
        trait_type: trait.trait_type,
        value: trait.value,
      };
      assetTraits.push(newTrait);
    }
  }

  // create typed asset ownerships
  // (a list of owners and owned NFTs quantity)
  const assetOwnerships: Ownership[] = [];
  if (obj.top_ownerships) {
    for (const ownership of obj.top_ownerships) {
      const ownershipOwner: Creator | null = ownership.owner
        ? {
            profile_img_url: ownership.owner.profile_img_url ?? null,
            username: ownership.owner.user
              ? ownership.owner.user.username
              : null,
          }
        : null;

      const newOwnership: Ownership = {
        quantity: ownership.quantity,
        owner: ownershipOwner,
      };
      assetOwnerships.push(newOwnership);
    }
  }

  // create typed asset creator
  const assetCreator: Creator | null = obj.creator
    ? {
        profile_img_url: obj.creator.profile_img_url ?? null,
        username: obj.creator.user ? obj.creator.user.username : null,
      }
    : null;

  // create typed asset collection
  const assetCollection: Collection | null = obj.collection
    ? {
        name: obj.collection.name ?? null,
        image_url: obj.collection.image_url ?? null,
      }
    : null;

  // create typed asset
  const asset: AssetType = {
    id: `${obj.asset_contract.address}-${obj.token_id}`,
    name: obj.name ?? null,
    permalink: obj.permalink,
    token_id: obj.token_id,
    asset_contract: {
      address: obj.asset_contract.address,
    },
    description: obj.description ?? null,
    num_sales: obj.num_sales ?? null,
    hd_image_url,
    priority_image_url,
    animation_url: obj.animation_url ?? null,
    traits: assetTraits,
    creator: assetCreator,
    collection: assetCollection,
    ownerships: assetOwnerships,
  };

  return asset;
};

export default createAssetObject;
