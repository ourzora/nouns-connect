import { CHAIN_ID } from "../utils/constants";

const NON_BUILDER_DAOS_GOERLI = [
  {
    name: "Lilnouns DAO Testnet",
    collectionAddress: "0x1d0030f304b542d5a5f77cc0e5945fd79ec89d8e",
    governorAddress: "0x4f49457d0ddd610b451686aeb17de9562094cd00",
    treasuryAddress: "0xd82c7DC502cbF88cFc5F0821BC514BBA88d70513",
    proposalLink: "https://lilnouns.wtf/vote/PROPOSAL_ID",
    site: "https://nouns.wtf/",
  },
  {
    name: "Nouns DAO Testnet",
    collectionAddress: "0xbd9bd9722fde1ec321f590993f7f5961f1bd0d06",
    governorAddress: "0xd08faceb444dbb6b063a51c2ddfb564fa0f8dce0",
    treasuryAddress: "0x2f12ABA664E6D2b4DDD264E2a175d29703836AaE",
    proposalLink: "https://master--nouns-testnet.netlify.app/vote/PROPOSAL_ID",
    site: "https://nouns.wtf/",
  },
];

// Governance from backend
const NON_BUILDER_DAOS_MAINNET = [
  {
    name: "Nouns DAO",
    collectionAddress: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
    proposalLink: "https://nouns.wtf/vote/PROPOSAL_ID",
    site: "https://nouns.wtf/",
  },
  {
    name: "Lilnouns DAO",
    collectionAddress: "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b",
    proposalLink: "https://lilnouns.wtf/vote/PROPOSAL_ID",
    site: "https://lilnouns.wtf/",
  },
];

export const NON_BUILDER_DAOS =
  CHAIN_ID === 1 ? NON_BUILDER_DAOS_MAINNET : NON_BUILDER_DAOS_GOERLI;
