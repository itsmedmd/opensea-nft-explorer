import Creator from "./Creator";

interface Ownership {
  quantity: number;
  owner: Creator | null;
}

export default Ownership;
