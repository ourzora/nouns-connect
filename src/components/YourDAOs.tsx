import request from "graphql-request";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAccount } from "wagmi";
import {
  LastTokenQuery,
  MyHoldingsQuery,
  MyNounsDaosQuery,
} from "../config/daos-query";
import {
  CHAIN_ID,
  FEATURED_ADDRESSES_LIST,
  ZORA_API_URL,
} from "../utils/constants";
import { DAOItem } from "./DAOItem";

export const YourDAOs = () => {
  const { address, isConnected } = useAccount();

  const { data } = useSWR(["fetch-daos", address], ([_, memberAddress]) =>
    request(ZORA_API_URL, MyNounsDaosQuery, {
      memberAddress,
      chain: CHAIN_ID === 1 ? "MAINNET" : "GOERLI",
    })
  );

  const { data: images } = useSWR(
    data
      ? [
          "fetch-nfts",
          data.nouns.nounsDaos.nodes.map((item) => item.collectionAddress),
        ]
      : undefined,
    ([_, addresses]) =>
      request(ZORA_API_URL, LastTokenQuery, {
        tokens: addresses.map((address) => ({
          address,
          tokenId: "0",
        })),
        chain: CHAIN_ID === 1 ? "MAINNET" : "GOERLI",
      })
  );

  const { data: holdings } = useSWR(
    data && address
      ? [
          "fetch-holdings",
          data.nouns.nounsDaos.nodes.map((item) => item.collectionAddress),
        ]
      : undefined,
    ([_, holdingsAddresses]) =>
      request(ZORA_API_URL, MyHoldingsQuery, {
        addresses: holdingsAddresses,
        owner: address,
        chain: CHAIN_ID === 1 ? "MAINNET" : "GOERLI",
      })
  );

  let daos = <span>loading...</span>;
  if (data) {
    daos = data.nouns.nounsDaos.nodes.map((item) => (
      <DAOItem
        cover={
          images
            ? images.tokens.nodes.find(
                (node) =>
                  node.token.collectionAddress === item.collectionAddress
              )?.token.image?.mediaEncoding?.poster
            : undefined
        }
        holdings={
          holdings
            ? holdings.tokens.nodes.filter(
                (node) =>
                  node.token.collectionAddress === item.collectionAddress
              ).length
            : 0
        }
        key={item.name}
        address={item.collectionAddress}
        name={item.name}
      />
    ));
  }

  const [isConnectedState, setIsConnectedState] = useState(false);
  useEffect(() => {
    setIsConnectedState(isConnected);
  }, [isConnected]);

  if (isConnectedState) {
    return <menu className="flex justify-center flex-wrap gap-3">{daos}</menu>;
  }
  return <></>;
};
