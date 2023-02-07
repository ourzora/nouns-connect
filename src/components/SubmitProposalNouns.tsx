import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import governorAbi from "@nouns/contracts/dist/abi/contracts/governance/NounsDAOLogicV2.sol/NounsDAOLogicV2.json";
import { CHAIN_ID } from "../utils/constants";
import { Transaction } from "../stores/interactions";
import toast from "react-hot-toast";
import { AppButton } from "./AppButton";
import { ethers } from "ethers";
import { useSubmitDescription } from "../stores/submit-description";

const MESSAGE_LOOKUP = {
  "0xe33f2b3e": "User does not meet quorum to submit a proposal",
};

export const SubmitProposalNouns = ({
  daoAddress,
  transactions,
  onSubmitted,
}: {
  daoAddress: string;
  isNounsDaoStructure: boolean;
  transactions: Transaction[];
  onSubmitted: ({ proposalId }: { proposalId: string }) => void;
}) => {
  const { data: signer } = useSigner();
  const { description, title } = useSubmitDescription();

  const args = [
    // targets
    transactions.map((txn: Transaction) => txn.data.to),
    // values
    transactions.map((txn: Transaction) => txn.data.value),
    // signatures (not sure what to do here – maybe use ether.actor again)
    transactions.map((txn: Transaction) => txn.signature),
    // calldatas
    transactions.map((txn: Transaction) => txn.data.calldata),
    // description
    title && !description ? `# ${title}` : `# ${title}\n\n${description}`,
  ];

  const { config, error } = usePrepareContractWrite({
    address: daoAddress,
    abi: governorAbi,
    functionName: "propose",
    signer,
    enabled: title.length > 0,
    onError: (err: any) => {
      toast(`Error setting up proposal`);
      console.error({ err });
    },
    args,
    chainId: CHAIN_ID,
  });

  const { write, isLoading, error: writeError } = useContractWrite({
    ...config,
    onSuccess: () => {
      toast(`Sending proposal request`);
    },
    onError: () => {
      toast(`Error sending request`);
    },
    onSettled: async (response: any) => {
      const iface = new ethers.utils.Interface(governorAbi);
      const txn = await response.wait();
      const proposeLog = iface.parseLog(txn.logs[0]);
      onSubmitted({ proposalId: proposeLog.args.id });
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

  console.log({ writeError, config, args, error, isLoading, write });

  return (
    <AppButton
      className=""
      disabled={!!error || isLoading || !write}
      onClick={() => write()}
    >
      {isLoading ? "Submitting Proposal..." : "Submit Proposal"}
    </AppButton>
  );
};
