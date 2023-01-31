import request from "graphql-request";
import { GetServerSideProps } from "next";

import { DAOItem } from "../components/DAOItem";
import Layout from "../components/LayoutWrapper";
import { YourDAOs } from "../components/YourDAOs";

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

export default IndexPage;
