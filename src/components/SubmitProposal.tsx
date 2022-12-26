import { useCallback } from "react";
import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { RequestType } from "./RequestType";
import managerABI from "@zoralabs/nouns-protocol/dist/artifacts/Manager.sol/Manager.json";
import governorABI from "@zoralabs/nouns-protocol/dist/artifacts/Governor.sol/Governor.json";
import { CHAIN_ID } from "../utils/constants";
import { Transaction } from "../stores/interactions";
// import addressesMainnet from '@zoralabs/nouns-protocol/dist/addresses/1.json';
// import addressesTestnet from '@zoralabs/nouns-protocol/dist/addresses/5.json';

const MESSAGE_LOOKUP = {
  "0xe33f2b3e": "User does not meet quorum to submit a proposal",
}

export const SubmitProposal = ({
  daoAddress,
  from,
  transactions,
  description,
}: {
  daoAddress: string;
  from: string;
  description: string;
  transactions: Transaction[];
}) => {
  const { isError, data: signer } = useSigner();

  const { config, error } = usePrepareContractWrite({
    address: daoAddress,
    abi: governorABI.abi,
    functionName: "propose",
    signer,
    args: [
      transactions.map((txn: Transaction) => txn.to), // targets
      transactions.map((txn: Transaction) => txn.value), // values
      transactions.map((txn: Transaction) => txn.calldata), // calldatas
      description, // description
    ],
    chainId: CHAIN_ID,
  });

  const { write } = useContractWrite(config);

  if (error) {
    console.log({error})
    return (
      <>
        <div>Error submitting proposal to DAO: </div>
        <div>{MESSAGE_LOOKUP[((error as any)?.error?.data?.originalError?.data)] || 'Unknown Error'}</div>
      </>
    );
  }

  return (
    <button disabled={!!error} onClick={() => write()}>
      Submit Proposal to DAO
    </button>
  );
};
