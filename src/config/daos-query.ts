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

export const ProposalByIdQuery = gql`
  query nounsProposal($proposalId: String!, $chain: Chain!) {
    nouns {
      nounsProposal(where:{
        proposalId: $proposalId
      }, network:{
        chain: $chain, network: ETHEREUM
      }) {
        proposalId
        proposalNumber
        description
        status
        timeCreated
        proposer
        values
        targets
        calldatas
      }
    }
  }
`;

export const MyHoldingsQuery = gql`
  query MyHoldingsQuery(
    $addresses: [String!]!
    $owner: String!
    $chain: Chain!
  ) {
    tokens(
      where: { ownerAddresses: [$owner], collectionAddresses: $addresses }
      networks: [{ chain: $chain, network: ETHEREUM }]
    ) {
      nodes {
        token {
          name
          collectionAddress
          owner
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
          collectionAddress
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
          networkInfo {
            network
            chain
          }
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
