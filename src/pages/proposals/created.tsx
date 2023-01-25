import { BorderFrame } from "../../components/BorderFrame";
import { CheckIcon } from "../../components/CheckIcon";
import Layout from "../../components/layout";
import { PageFrameSize } from "../../components/PageFrameSize";
import { GetDaoServerSide } from "../../fetchers/get-dao";
import { useDAOImage } from "../../hooks/useDAOImage";

function Created({ dao }: { dao: any }) {
  const { url } = useDAOImage({ collectionAddress: dao.collectionAddress });

  return (
    <Layout title={`Proposal for ${dao.name}`}>
      <PageFrameSize>
        <h1 className="text-6xl justify-center leading-10 text-center sm:text-4xl flex">
          <CheckIcon />
          <div className="mt-2 ml-4">Proposal Submitted</div>
        </h1>
        <div>
          {dao.name} <img src={url} alt={dao.name} />
        </div>
        <BorderFrame>
          <div>
            <h3>Proposal title</h3>
            <div className="rounded bg-gray-500 p-2">Pending</div>
          </div>
        </BorderFrame>
      </PageFrameSize>
    </Layout>
  );
}

export const getServerSideProps = GetDaoServerSide;

export default Created;
