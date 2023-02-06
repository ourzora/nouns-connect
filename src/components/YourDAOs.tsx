import request from "graphql-request";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAccount } from "wagmi";

import {
  LastTokenQuery,
  MyHoldingsQuery,
  MyNounsDaosQuery,
} from "../config/daos-query";
import { CHAIN_NAME, ZORA_API_URL } from "../utils/constants";
import { DAOItem } from "./DAOItem";
import Link from "next/link";
import { NON_BUILDER_DAOS } from "../config/fixed-daos";
import { useDAOVotes } from "../hooks/useDAOVotes";

export const YourDAOs = () => {
  const { address, isConnected } = useAccount();

  const { data } = useSWR(["fetch-daos", address], ([_, memberAddress]) =>
    request(ZORA_API_URL, MyNounsDaosQuery, {
      query: {
        memberAddresses: [memberAddress],
        collectionAddresses: NON_BUILDER_DAOS.map((dao) => dao.collectionAddress),
      },
      chain: CHAIN_NAME,
    })
  );

  const foundDaos = address && data?.nouns?.nounsDaos?.nodes;
  const daoVotes = useDAOVotes(foundDaos, address);

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
        chain: CHAIN_NAME,
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
        chain: CHAIN_NAME,
      })
  );

  let daos = <span>loading...</span>;
  if (data) {
    const { nodes } = data.nouns.nounsDaos;

    daos = nodes
      .map((item, indx) => ({ item, indx }))
      .filter(
        ({ item }) =>
          holdings?.tokens.nodes.filter(
            (node) => node.token.collectionAddress === item.collectionAddress
          ).length > 0 || daoVotes[item.collectionAddress]?.votes > 0
      )
      .map(({ item, indx }) => (
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
          quorum={daoVotes[item.collectionAddress].quorum}
          yourVotes={daoVotes[item.collectionAddress].votes}
          key={`${item.name}-${indx}`}
          address={item.collectionAddress}
          name={item.name}
        />
      ));

    if ((daos as any).length === 0) {
      daos = (
        <div className="cursor-pointer p-5 w-full border rounded-lg shadow-sm hover:shadow-md relative">
          We could not find any builder DAOs or nouns DAO membership NFTs on
          this wallet.
          <br />
          <br />
          You can test the application with the{" "}
          <Link
            className="underline"
            href="/daos/0xdf9b7d26c8fc806b1ae6273684556761ff02d422"
          >
            Builder DAO
          </Link>
        </div>
      );
    }
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
