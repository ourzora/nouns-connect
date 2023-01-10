import request from "graphql-request";
import useSWR from "swr";
import { useAccount } from "wagmi";
import { MyNounsDaosQuery } from "../config/daos-query";
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

  let daos = <span>loading...</span>;
  if (data) {
    daos = data.nouns.nounsDaos.nodes.map((item) => (
      <DAOItem
        key={item.name}
        address={item.collectionAddress}
        name={item.name}
        // description={item.description}
      />
    ));
  }

  if (typeof window !== 'undefined' && isConnected) {
    return (
      <>
        <h1>Your DAOs</h1>
        {daos}
      </>
    );
  }
  return <></>;
};
