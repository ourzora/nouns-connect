import { useCallback } from "react";
import {
  useAccount,
  useContract,
  useContractRead,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { RequestType } from "./RequestType";
import managerABI from "@zoralabs/nouns-protocol/dist/artifacts/Manager.sol/Manager.json";
import governorABI from "@zoralabs/nouns-protocol/dist/artifacts/Governor.sol/Governor.json";
import { CHAIN_ID } from "../utils/constants";
// import addressesMainnet from '@zoralabs/nouns-protocol/dist/addresses/1.json';
// import addressesTestnet from '@zoralabs/nouns-protocol/dist/addresses/5.json';

const MANAGER_ADDRESS = {
  '1': '',
  '5': '',
};

export const SubmitProposal = ({
  daoAddress,
  requests,
}: {
  daoAddress: string;
  requests: RequestType[];
}) => {
  const { isError, data: signer } = useSigner();
  const { data } = useContractRead({
    abi: managerABI.abi,
    address: MANAGER_ADDRESS[CHAIN_ID.toString() as any],
    functionName: "getAddresses",
    args: [daoAddress],
  });

  const governorContract = useContract({
    abi: governorABI.abi,
    address: data ? data[4] : undefined,
    signerOrProvider: signer,
  });

  const trySubmit = useCallback(async () => {
    // try to submit requests as DAO request
    console.log({ governorContract });
  }, [signer]);

  return (
    <button disabled={!requests} onClick={trySubmit}>
      Submit Proposal to DAO
    </button>
  );
};
