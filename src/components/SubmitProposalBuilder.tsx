import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import governorABI from "@zoralabs/nouns-protocol/dist/artifacts/Governor.sol/Governor.json";
import { CHAIN_ID } from "../utils/constants";
import { Transaction } from "../stores/interactions";
import toast from "react-hot-toast";
// import addressesMainnet from '@zoralabs/nouns-protocol/dist/addresses/1.json';
// import addressesTestnet from '@zoralabs/nouns-protocol/dist/addresses/5.json';

const MESSAGE_LOOKUP = {
  "0xe33f2b3e": "User does not meet quorum to submit a proposal",
};

export const SubmitProposalBuilder = ({
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
  const { isError, data: signer } = useSigner();

  const { config, error } = usePrepareContractWrite({
    address: daoAddress,
    abi: governorABI.abi,
    functionName: "propose",
    signer,
    onError: (err: any) => {
      toast(`Error setting up proposal: ${err.toString()}`);
    },
    args: [
      transactions.map((txn: Transaction) => txn.to), // targets
      transactions.map((txn: Transaction) => txn.value), // values
      transactions.map((txn: Transaction) => txn.calldata), // calldatas
      description, // description
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
    console.log({ error });
    return (
      <>
        <div>Error submitting proposal to DAO: </div>
        <div>
          {MESSAGE_LOOKUP[(error as any)?.error?.data?.originalError?.data] ||
            "Unknown Error"}
        </div>
      </>
    );
  }

  return (
    <button
      className="border-2 border-gray-300 px-2 py-1 mt-2 hover:border-gray-600"
      disabled={!!error}
      onClick={() => write()}
    >
      Submit Proposal to DAO
    </button>
  );
};
