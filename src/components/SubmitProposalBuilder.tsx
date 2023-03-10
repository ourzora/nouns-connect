import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import governorABI from "@zoralabs/nouns-protocol/dist/artifacts/Governor.sol/Governor.json";
import { CHAIN_ID } from "../utils/constants";
import { Transaction } from "../stores/interactions";
import toast from "react-hot-toast";
import { AppButton } from "./AppButton";
import { ethers } from "ethers";
import { useSubmitDescription } from "../stores/submit-description";

const MESSAGE_LOOKUP = {
  "0xe33f2b3e": "User does not meet quorum to submit a proposal",
};

export const SubmitProposalBuilder = ({
  daoAddress,
  onSubmitted,
  transactions,
}: {
  daoAddress: string;
  isNounsDaoStructure: boolean;
  transactions: Transaction[];
  onSubmitted: ({ proposalId }: { proposalId: string }) => void;
}) => {
  const { data: signer } = useSigner();

  const { title, description } = useSubmitDescription();

  const { config, error } = usePrepareContractWrite({
    address: daoAddress,
    abi: governorABI.abi,
    functionName: "propose",
    signer,
    enabled: title.length > 0,
    onError: (err: any) => {
      toast(`Error setting up proposal: ${err.toString()}`);
    },
    args: [
      transactions.map((txn: Transaction) => txn.data.to), // targets
      transactions.map((txn: Transaction) => txn.data.value), // values
      transactions.map((txn: Transaction) => txn.data.calldata), // calldatas
      description.length > 0 ? `${title}&&${description}` : title, // description
    ],
    chainId: CHAIN_ID,
  });

  const { write, isLoading } = useContractWrite({
    ...config,
    onSuccess: () => {
      toast(`Sending proposal request`);
    },
    onError: () => {
      toast(`Failed to send proposal to DAO`);
    },
    onSettled: async (response) => {
      const iface = new ethers.utils.Interface(governorABI.abi);
      const txn = await response.wait();
      // find new proposal hash
      const proposeLog = iface.parseLog(txn.logs[0]);
      const proposalId = proposeLog.args.proposalId;
      onSubmitted({ proposalId });
    },
  });

  console.log({write});

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
    <AppButton
      className=""
      disabled={!!error || isLoading || !write}
      onClick={() => setTimeout(write, 100)}
    >
      {isLoading ? "Submitting Proposal..." : "Submit Proposal"}
    </AppButton>
  );
};
