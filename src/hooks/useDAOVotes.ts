import { NounsTokenABI } from "@nouns/contracts";
import { useMemo } from "react";
import { useContractReads } from "wagmi";
import { NON_BUILDER_DAOS } from "../config/fixed-daos";

import governorABI from "@zoralabs/nouns-protocol/dist/artifacts/Governor.sol/Governor.json";
import nounsGovernorABI from "../abis/nouns-governor.abi.json";

export const useDAOVotes = (foundDaos: any, address: string) => {
  const now = useMemo(() => {
    return Math.floor(new Date().getTime() / 1000);
  }, []);

  const { data: daoVotes } = useContractReads({
    allowFailure: true,
    enabled: !!(foundDaos && address),
    contracts:
      address && foundDaos
        ? [
            ...foundDaos.map((nounsDao) => {
              const isNounsTypeDao = NON_BUILDER_DAOS.find(
                (dao) => dao.token === nounsDao.collectionAddress
              );
              if (isNounsTypeDao) {
                return {
                  address: nounsDao.collectionAddress,
                  functionName: "getCurrentVotes",
                  args: [address],
                  abi: NounsTokenABI,
                };
              }
              return {
                address: nounsDao.governorAddress,
                functionName: "getVotes",
                abi: governorABI.abi,
                args: [address, now - 120],
              };
            }),
            ...foundDaos.map((nounsDao) => {
              const isNounsDao = NON_BUILDER_DAOS.find(
                (dao) => dao.token === nounsDao.collectionAddress
              );
              if (isNounsDao) {
                return {
                  address: nounsDao.governorAddress,
                  functionName: "proposalThreshold",
                  abi: nounsGovernorABI,
                };
              }
              return {
                address: nounsDao.governorAddress,
                functionName: "quorum",
                abi: governorABI.abi,
              };
            }),
          ]
        : [],
  });

  return useMemo(() => {
    if (!foundDaos) {
      return {};
    }

    return foundDaos.reduce((last, dao, indx) => {
      const isNounsTypeDao = NON_BUILDER_DAOS.find(
        (nounsDao) => nounsDao.token === dao.collectionAddress
      );
      last[dao.collectionAddress] = {
        quorum:
          daoVotes?.length > 0 && daoVotes[indx * 2]
            ? (daoVotes[indx * 2] as any).toNumber() + (isNounsTypeDao ? 1 : 0)
            : undefined,
        votes:
          daoVotes?.length > 0 && daoVotes[indx]
            ? (daoVotes[indx] as any).toNumber()
            : undefined,
      };
      return last;
    }, {});
  }, [foundDaos, daoVotes]);
};
