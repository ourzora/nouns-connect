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

export const LastTokenQuery = gql`
  query LastTokenQuery($tokens: [TokenInput!]!, $chain: Chain!) {
    tokens(
      where: { tokens: $tokens }
      networks: [{ chain: $chain, network: ETHEREUM }]
    ) {
      nodes {
        token {
          name
          description
          tokenId
          lastRefreshTime
          image {
            url
            size
            mediaEncoding {
              ... on ImageEncodingTypes {
                poster
              }
            }
          }
        }

        networkInfo {
          network
          chain
        }
      }
    }
  }
`;

export const NounsQueryByCollection = gql`
  query MyNounQuery($collectionAddresses: [String!]!, $chain: Chain!) {
    nouns {
      nounsDaos(
        where: { collectionAddresses: $collectionAddresses }
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
`;

export const AllNounsQuery = gql`
  query AllNounsQuery($chain: Chain!) {
    nouns {
      nounsDaos(networks: [{ chain: $chain, network: ETHEREUM }]) {
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
