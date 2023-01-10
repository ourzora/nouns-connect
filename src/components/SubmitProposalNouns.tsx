import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import governorAbi from "@nouns/contracts/dist/abi/contracts/governance/NounsDAOLogicV2.sol/NounsDAOLogicV2.json";
import { CHAIN_ID } from "../utils/constants";
import { Transaction } from "../stores/interactions";
import toast from "react-hot-toast";
import useSWR from "swr";
// import addressesMainnet from '@zoralabs/nouns-protocol/dist/addresses/1.json';
// import addressesTestnet from '@zoralabs/nouns-protocol/dist/addresses/5.json';

const MESSAGE_LOOKUP = {
  "0xe33f2b3e": "User does not meet quorum to submit a proposal",
};

export const SubmitProposalNouns = ({
  daoAddress,
  from,
  transactions,
  description,
}: {
  daoAddress: string;
  isNounsDaoStructure: boolean;
  from: string;
  description: string;
  transactions: Transaction[];
}) => {
  const { data: signer } = useSigner();

  const { config, error } = usePrepareContractWrite({
    address: daoAddress,
    abi: governorAbi,
    functionName: "propose",
    signer,
    onError: (err: any) => {
      toast(`Error setting up proposal`);
    },
    args: [
      // targets
      transactions.map((txn: Transaction) => txn.to),
      // values
      transactions.map((txn: Transaction) => txn.value),
      // signatures (not sure what to do here – maybe use ether.actor again)
      transactions.map((txn: Transaction) => ""),
      // calldatas
      transactions.map((txn: Transaction) => txn.calldata),
      // description
      description,
    ],
    chainId: CHAIN_ID,
  });

  const { write, isLoading } = useContractWrite({
    ...config,
    onSuccess: () => {
      toast(`Sending proposal request`);
    },
    onSettled: () => {
      toast(`Successfully sent proposal to DAO`);
    },
  });

  if (error) {
    return (
      <>
        <div>Error submitting proposal to DAO: </div>
        <div>{(error as any)?.error?.message}</div>
      </>
    );
  }

  return (
    <button
      className="border-2 border-gray-300 px-2 py-1 mt-2 hover:border-gray-600"
      disabled={!!error || isLoading}
      onClick={() => write()}
    >
      Submit Proposal to DAO
    </button>
  );
};
