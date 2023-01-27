import request from "graphql-request";
import { GetServerSideProps } from "next";

import { DAOItem } from "../components/DAOItem";
import Layout from "../components/LayoutWrapper";
import { PageFrameSize } from "../components/PageFrameSize";
import { YourDAOs } from "../components/YourDAOs";
import { AllNounsQuery } from "../config/daos-query";
import {
  CHAIN_ID,
  FEATURED_ADDRESSES_LIST,
  ZORA_API_URL,
} from "../utils/constants";

const AllDAOs = ({ daos }: { daos: any }) => {
  return (
    <>
      <section className="relative mt-6" id="search">
        <input
          className="w-full text-gray-800 p-3 pl-11 border-2 rounded-lg text-md focus:outline-none"
          autoFocus={true}
          placeholder="Search..."
          id="search"
          autoCorrect="off"
          autoCapitalize="none"
        />
        <button
          type="submit"
          style={{ marginTop: "16px", marginLeft: "18px" }}
          className="absolute left-0 top-0"
        >
          <svg
            className="text-gray-400 h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            width="512px"
            height="512px"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
      </section>
      {daos.length && (
        <section id="all-daos">
          <h1>Featured DAOs</h1>
          {daos.map((dao) => (
            <DAOItem
              key={dao.collectionAddress}
              name={dao.name}
              address={dao.collectionAddress}
            />
          ))}
        </section>
      )}
    </>
  );
};

const IndexPage = () => {
  /**
   * TODO: might be nice to do a carousel here so we can maintain the fixed center layout on desktop
   */
  return (
    <Layout title="NounsConnect | Home">
      <div className="w-full max-w-[1440px] px-6">
        <div className="text-center mt-20 lg:mt-10">
          <h1 className="mt-6 text-5xl lg:text-4xl">Select DAO</h1>
          <p
            className="mt-2 my-16 text-center text-xl font-pt"
            style={{ color: "#808080" }}
          >
            Choose the DAO you would like to connect an application to
          </p>
        </div>
        <YourDAOs />
      </div>
    </Layout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ res }) => {
//   res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=50, stale-while-revalidate=59"
//   );

// const daosResponse = await request(ZORA_API_URL, NounsQueryByCollection, {
//   chain: { "1": "MAINNET", "5": "GOERLI" }[CHAIN_ID.toString()],
//   collectionAddresses: FEATURED_ADDRESSES_LIST,
// });

// const daosResponse = await request(ZORA_API_URL, AllNounsQuery, {
//   chain: { "1": "MAINNET", "5": "GOERLI" }[CHAIN_ID.toString()],
// });

// return {
//   props: { daos: daosResponse.nouns.nounsDaos.nodes },
// };
// };

export default IndexPage;
