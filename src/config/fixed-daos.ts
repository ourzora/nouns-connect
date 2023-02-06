import { CHAIN_ID } from "../utils/constants";

const NON_BUILDER_DAOS_GOERLI = [
  {
    name: "Lilnouns DAO Testnet",
    collectionAddress: "0x1d0030f304b542D5A5F77CC0E5945fd79ec89D8E",
    governanceAddress: "0x4F49457D0Ddd610B451686AeB17dE9562094cD00",
  },
  {
    name: "Nouns DAO Testnet",
    collectionAddress: "0xbd9bd9722FDE1ec321F590993F7f5961F1Bd0d06",
    governanceAddress: "0xD08faCeb444dbb6b063a51C2ddFb564Fa0f8Dce0",
  },
];
const NON_BUILDER_DAOS_MAINNET = [
  // governance from backend
  { name: "Nouns DAO", collectionAddress: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03" },
  { name: "Lilnouns DAO", collectionAddress: "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b" },
];

export const NON_BUILDER_DAOS =
  CHAIN_ID === 1 ? NON_BUILDER_DAOS_MAINNET : NON_BUILDER_DAOS_GOERLI;
