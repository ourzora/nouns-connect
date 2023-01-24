import { useContract, useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import governorABI from "@zoralabs/nouns-protocol/dist/artifacts/Governor.sol/Governor.json";
import { CHAIN_ID } from "../utils/constants";
import { Transaction } from "../stores/interactions";
import toast from "react-hot-toast";
import { AppButton } from "./AppButton";
import { useDescription } from "../stores/description";
import { useRouter } from "next/router";
// import addressesMainnet from '@zoralabs/nouns-protocol/dist/addresses/1.json';
// import addressesTestnet from '@zoralabs/nouns-protocol/dist/addresses/5.json';

const MESSAGE_LOOKUP = {
  "0xe33f2b3e": "User does not meet quorum to submit a proposal",
};

export const SubmitProposalBuilder = ({
  daoAddress,
  from,
  daoTokenAddress,
  transactions,
}: {
  daoAddress: string;
  daoTokenAddress: string;
  isNounsDaoStructure: boolean;
  from: string;
  transactions: Transaction[];
}) => {
  const { isError, data: signer } = useSigner();

  const { title, description } = useDescription();

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

  const {push} = useRouter();

  const governorContract = useContract({address: daoAddress, abi: governorABI.abi});

  const { write, isLoading } = useContractWrite({
    ...config,
    onSuccess: () => {
      toast(`Sending proposal request`);
    },
    onError: () => {
      toast(`Issue sending proposal to DAO`);
    },
    onSettled: async (response) => {
      const txn = await response.wait()
      // find new proposal hash
      console.log({txn});
      // txn.logs.find((log) => log.)
      const txnId = '0'
      // push(`/proposals/created?id=${txnId}&address=${daoTokenAddress}`)
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
    <AppButton
      className=""
      disabled={!!error || isLoading}
      onClick={() => write()}
    >
      Submit Proposal
    </AppButton>
  );
};
