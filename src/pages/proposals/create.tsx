import dynamic from "next/dynamic";

import Layout from "../../components/layout";
import { DAOHeader } from "../../components/DAOHeader";
import { GetDaoServerSide } from "../../fetchers/get-dao";
import { PageFrameSize } from "../../components/PageFrameSize";

const SubmittedTransactionsPreview = dynamic(
  () => import("../../components/SubmittedTransactionsPreview"),
  {
    ssr: false,
  }
);

function CreateComponent({ dao }: { dao: any }) {
  return (
    <PageFrameSize>
      <DAOHeader showConnection={false} dao={dao} />
      <SubmittedTransactionsPreview dao={dao} />
    </PageFrameSize>
  );
}

const DAOActionPage = ({ dao }) => {
  return (
    <Layout title="Nouns Connect | Create Proposal">
      <CreateComponent dao={dao} />
    </Layout>
  );
};

export const getServerSideProps = GetDaoServerSide;

export default DAOActionPage;
