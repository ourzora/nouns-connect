import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import governorAbi from "@nouns/contracts/dist/abi/contracts/governance/NounsDAOLogicV2.sol/NounsDAOLogicV2.json";
import { CHAIN_ID } from "../utils/constants";
import { Transaction } from "../stores/interactions";
import toast from "react-hot-toast";
import useSWR from "swr";
import { AppButton } from "./AppButton";
import { useDescription } from "../stores/description";
import { ethers } from "ethers";
import { useRouter } from "next/router";
// import addressesMainnet from '@zoralabs/nouns-protocol/dist/addresses/1.json';
// import addressesTestnet from '@zoralabs/nouns-protocol/dist/addresses/5.json';

const MESSAGE_LOOKUP = {
  "0xe33f2b3e": "User does not meet quorum to submit a proposal",
};

export const SubmitProposalNouns = ({
  daoAddress,
  from,
  transactions,
  onSubmitted,
}: {
  daoAddress: string;
  isNounsDaoStructure: boolean;
  from: string;
  description: string;
  transactions: Transaction[];
  onSubmitted: ({ proposalId }: { proposalId: string }) => void;
}) => {
  const { data: signer } = useSigner();
  const { description } = useDescription();

  const { config, error } = usePrepareContractWrite({
    address: daoAddress,
    abi: governorAbi,
    functionName: "propose",
    signer,
    enabled: description.length > 0,
    onError: (err: any) => {
      toast(`Error setting up proposal`);
    },
    args: [
      // targets
      transactions.map((txn: Transaction) => txn.data.to),
      // values
      transactions.map((txn: Transaction) => txn.data.value),
      // signatures (not sure what to do here – maybe use ether.actor again)
      transactions.map((txn: Transaction) => ""),
      // calldatas
      transactions.map((txn: Transaction) => txn.data.calldata),
      // description
      description,
    ],
    chainId: CHAIN_ID,
  });

  const { push } = useRouter();

  const { write, isLoading } = useContractWrite({
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

  return (
    <AppButton
      className=""
      disabled={!!error || isLoading}
      onClick={() => write()}
    >
      {isLoading ? "Submitting Proposal..." : "Submit Proposal"}
    </AppButton>
  );
};
