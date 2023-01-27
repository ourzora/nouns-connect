import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead } from "wagmi";
import { useCallback } from "react";
import { useRouter } from "next/router";

import governorAbi from "@nouns/contracts/dist/abi/contracts/governance/NounsDAOLogicV2.sol/NounsDAOLogicV2.json";

import { DescriptionManager } from "./DescriptionManager";
import { RenderRequest } from "./RenderRequest";
import { SubmitProposalNouns } from "./SubmitProposalNouns";
import { SubmitProposalBuilder } from "./SubmitProposalBuilder";
import { Transaction, useTransactionsStore } from "../stores/interactions";
import { AppButton } from "./AppButton";
import { BorderFrame } from "./BorderFrame";

const SubmittedTransactionsPreview = ({ dao }: { dao: any }) => {
  const { transactions, clear } = useTransactionsStore();
  const { isError } = useContractRead({
    abi: governorAbi,
    address: dao.governorAddress,
    functionName: "admin",
    watch: false,
  });

  const SubmitComponent = isError ? SubmitProposalBuilder : SubmitProposalNouns;

  const { isConnected } = useAccount();
  const { push } = useRouter();

  const onProposalSubmitted = useCallback(
    ({ proposalId }: { proposalId: string }) => {
      clear();
      push(
        `/proposals/created?id=${proposalId}&address=${dao.collectionAddress}`
      );
    },
    [push, clear]
  );

  return (
    <>
      {transactions?.length > 0 ? (
        <>
          <h3 className="font-lg text-left mt-4 -mb-4">Transactions</h3>
          {transactions.map((transaction: Transaction, indx: number) => (
            <BorderFrame key={indx}>
              <RenderRequest
                indx={indx}
                key={transaction.data.id}
                transaction={transaction}
                defaultCollapsed={true}
              />
            </BorderFrame>
          ))}
        </>
      ) : (
        <BorderFrame>
          No transactions added to this DAO{" "}
          <AppButton
            className="my-8"
            href={`/daos/${dao.collectionAddress.toLowerCase()}`}
          >
            Go to Propose Page
          </AppButton>
        </BorderFrame>
      )}

      {transactions.length > 0 ? (
        isConnected ? (
          <>
            <DescriptionManager hasTitle={isError} />
            <div className="h-4"> </div>
            <SubmitComponent
              onSubmitted={onProposalSubmitted}
              isNounsDaoStructure={!isError}
              daoAddress={dao.governorAddress}
              transactions={transactions}
            />
            <div className="h-4"> </div>
          </>
        ) : (
          <div className="mt-5 font-pt text-lg">
            Connect your wallet to submit a proposal
            <ConnectButton />
          </div>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default SubmittedTransactionsPreview;
