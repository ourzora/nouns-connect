import request from "graphql-request";

import { NounsQueryByCollection } from "../config/daos-query";
import { CHAIN_NAME, ZORA_API_URL } from "../utils/constants";

export const GetDaoServerSide = async ({
  res,
  query,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=50, stale-while-revalidate=59"
  );

  const daos = await request(ZORA_API_URL, NounsQueryByCollection, {
    chain: CHAIN_NAME,
    collectionAddresses: [query.address as string],
  });

  const dao = daos.nouns.nounsDaos.nodes[0];

  return {
    props: { dao },
  };
};