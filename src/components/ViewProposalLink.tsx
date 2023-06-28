import { NON_BUILDER_DAOS } from "../config/fixed-daos";
import { CHAIN_ID } from "../utils/constants";

const CLASSNAME =
  "pl-2 text-gray-600 text-xl hover:color-black transition-color";

export const ViewProposalLink = ({
  dao,
  proposalId,
}: {
  dao: any;
  proposalId: string;
}) => {
  const nonBuilderDAO = NON_BUILDER_DAOS.find(
    (nonBuilderDAO) => nonBuilderDAO.collectionAddress === dao.collectionAddress
  );

  console.log({ dao, proposalId, nonBuilderDAO });

  if (nonBuilderDAO) {
    return (
      <a
        href={nonBuilderDAO.proposalLink.replace("PROPOSAL_ID", proposalId)}
        target="_blank"
        title={`View on ${nonBuilderDAO.name}`}
        className={CLASSNAME}
      >
        ↗
      </a>
    );
  }
  return (
    <a
      title="View on nouns.build"
      target="_blank"
      className="text-gray-600 hover:color-black transition-color"
      href={`https://${CHAIN_ID === 5 ? "testnet." : ""}nouns.build/dao/${
        dao.collectionAddress
      }/vote/${proposalId}`}
    >
      ↗
    </a>
  );
};
