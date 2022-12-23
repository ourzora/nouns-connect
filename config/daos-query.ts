import { gql } from "graphql-request";

export const MyNounsDaosQuery = gql`
  query MyNounsDao($memberAddress: String!, $chain: Chain!) {
    nouns {
      nounsDaos(
        where: { memberAddresses: [$memberAddress] }
        networks: [{ chain: $chain, network: ETHEREUM }]
      ) {
        nodes {
          name
          auctionAddress
          contractAddress
          description
          governorAddress
          collectionAddress
          treasuryAddress
          totalSupply
          networkInfo {
            network
            chain
          }
        }
      }
    }
  }
`;
