import request from "graphql-request";
import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { useAccount, useContractReads } from "wagmi";

import governorABI from "@zoralabs/nouns-protocol/dist/artifacts/Governor.sol/Governor.json";

import {
  LastTokenQuery,
  MyHoldingsQuery,
  MyNounsDaosQuery,
} from "../config/daos-query";
import { CHAIN_ID, ZORA_API_URL } from "../utils/constants";
import { DAOItem } from "./DAOItem";

export const YourDAOs = () => {
  const { address, isConnected } = useAccount();

  const { data } = useSWR(["fetch-daos", address], ([_, memberAddress]) =>
    request(ZORA_API_URL, MyNounsDaosQuery, {
      memberAddress,
      chain: CHAIN_ID === 1 ? "MAINNET" : "GOERLI",
    })
  );

  const now = useMemo(() => {
    return Math.floor(new Date().getTime() / 1000);
  }, []);

  const hasDAOs = address && data?.nouns?.nounsDaos?.nodes;
  const { data: daoVotes } = useContractReads({
    allowFailure: true,
    enabled: hasDAOs,
    contracts: hasDAOs
      ? [
          ...data.nouns.nounsDaos.nodes.map((nounsDao) => ({
            address: nounsDao.governorAddress,
            functionName: "getVotes",
            abi: governorABI.abi,
            args: [address, now - 120],
          })),
          ...data.nouns.nounsDaos.nodes.map((nounsDao) => ({
            address: nounsDao.governorAddress,
            functionName: "quorum",
            abi: governorABI.abi,
          })),
        ]
      : [],
  });

  console.log({ daoVotes });

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
    daos = data.nouns.nounsDaos.nodes.map((item, indx) => (
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
        quorum={
          daoVotes?.length > 0 && daoVotes[indx * 2]
            ? (daoVotes[indx * 2] as any).toNumber()
            : undefined
        }
        yourVotes={
          daoVotes?.length > 0 && daoVotes[indx]
            ? (daoVotes[indx] as any).toNumber()
            : undefined
        }
        key={`${item.name}-${indx}`}
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
