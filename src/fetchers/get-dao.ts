import request from "graphql-request";

import { NounsQueryByCollection } from "../config/daos-query";
import { NON_BUILDER_DAOS } from "../config/fixed-daos";
import { CHAIN_NAME, ZORA_API_URL } from "../utils/constants";

export const GetDaoServerSide = async ({ res, query }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=50, stale-while-revalidate=59"
  );

  const { address } = query;

  const daos = await request(ZORA_API_URL, NounsQueryByCollection, {
    chain: CHAIN_NAME,
    collectionAddresses: [address],
  });

  let dao = daos.nouns.nounsDaos.nodes[0];

  const nonBuilderDAO = NON_BUILDER_DAOS.find(
    (dao) => dao.collectionAddress === address
  );

  if (!dao && nonBuilderDAO) {
    dao = nonBuilderDAO;
  }

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dao },
  };
};
