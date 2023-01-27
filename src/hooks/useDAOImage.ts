import request from "graphql-request";
import useSWR from "swr";

import { LastTokenQuery } from "../config/daos-query";
import { CHAIN_ID, ZORA_API_URL } from "../utils/constants";

export const useDAOImage = ({
  collectionAddress,
}: {
  collectionAddress: string;
}) => {
  const { data: imageData } = useSWR(collectionAddress, (collectionAddress) =>
    request(ZORA_API_URL, LastTokenQuery, {
      tokens: [{ address: collectionAddress, tokenId: "0" }],
      chain: CHAIN_ID === 1 ? "ETHEREUM" : "GOERLI",
    })
  );

  return {
    imageData,
    url: imageData?.tokens.nodes.length
      ? imageData.tokens.nodes[0].token.image.mediaEncoding.poster
      : undefined,
  };
};
