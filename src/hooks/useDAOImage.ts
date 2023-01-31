import request from "graphql-request";
import useSWR from "swr";

import { LastTokenQuery } from "../config/daos-query";
import { ZORA_API_URL, CHAIN_NAME } from "../utils/constants";

export const useDAOImage = ({
  collectionAddress,
}: {
  collectionAddress: string;
}) => {
  const { data: imageData } = useSWR(collectionAddress, (collectionAddress) =>
    request(ZORA_API_URL, LastTokenQuery, {
      tokens: [{ address: collectionAddress, tokenId: "0" }],
      chain: CHAIN_NAME,
    })
  );

  return {
    imageData,
    url: imageData?.tokens.nodes.length
      ? imageData.tokens.nodes[0].token.image.mediaEncoding.poster
      : undefined,
  };
};
