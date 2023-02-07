import { NON_BUILDER_DAOS } from "../config/fixed-daos";
import { CHAIN_ID } from "../utils/constants";

const CLASSNAME =
  "pl-2 text-gray-600 text-xl hover:color-black transition-color";

export const NounsBuildLink = ({ dao }: { dao: any }) => {
  const nonBuilderDAO = NON_BUILDER_DAOS.find(
    (nonBuilderDAO) => nonBuilderDAO.collectionAddress === dao.collectionAddress
  );
  if (nonBuilderDAO) {
    return (
      <a href={nonBuilderDAO.site} target="_blank" className={CLASSNAME}>
        ↗
      </a>
    );
  }
  return (
    <a
      title="View on nouns.build"
      target="_blank"
      href={`https://${CHAIN_ID === 5 ? "testnet." : ""}nouns.build/dao/${
        dao.collectionAddress
      }`}
    >
      ↗
    </a>
  );
};
