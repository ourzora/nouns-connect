import { CHAIN_ID } from "../utils/constants";

const NON_BUILDER_DAOS_GOERLI = [];
const NON_BUILDER_DAOS_MAINNET = [
  { name: "Nouns DAO", token: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03" },
  { name: "Lilnouns DAO", token: "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b" },
];

export const NON_BUILDER_DAOS =
  CHAIN_ID === 1 ? NON_BUILDER_DAOS_MAINNET : NON_BUILDER_DAOS_GOERLI;
