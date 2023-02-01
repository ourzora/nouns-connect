export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID_STR, 10);
export const CHAIN_NAME = {
  "1": "MAINNET",
  "5": "GOERLI",
}[process.env.NEXT_PUBLIC_CHAIN_ID_STR];
export let FEATURED_ADDRESSES_LIST = (
  process.env.NEXT_PUBLIC_FEATURED_ADDRESSES || ""
).split(",");
export const ZORA_API_URL = "https://api.zora.co/graphql";
