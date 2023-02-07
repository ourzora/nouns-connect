import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead } from "wagmi";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import governorAbi from "@nouns/contracts/dist/abi/contracts/governance/NounsDAOLogicV2.sol/NounsDAOLogicV2.json";

import { DescriptionManager } from "./DescriptionManager";
import { RenderRequest } from "./RenderRequest";
import { SubmitProposalNouns } from "./SubmitProposalNouns";
import { SubmitProposalBuilder } from "./SubmitProposalBuilder";
import { Transaction, useTransactionsStore } from "../stores/interactions";
import { AppButton } from "./AppButton";
import { BorderFrame } from "./BorderFrame";
import { ProposalSimulation } from "./ProposalSimulation";
import { ATTRIBUTION_CONTRACT_ADDRESS } from "../utils/constants";
import { NON_BUILDER_DAOS } from "../config/fixed-daos";

const SubmittedTransactionsPreview = ({ dao }: { dao: any }) => {
  const { transactions, clear, addTransactions } = useTransactionsStore();

  const nounsDao = NON_BUILDER_DAOS.find(
    (thisDao) => thisDao.collectionAddress === dao.collectionAddress
  );

  useEffect(() => {
    if (transactions.length === 0) {
      return;
    }

    const lastTxn = transactions[transactions.length - 1];
    if (lastTxn.data.to !== ATTRIBUTION_CONTRACT_ADDRESS) {
      addTransactions([
        {
          data: {
            id: 0,
            gas: "0",
            to: ATTRIBUTION_CONTRACT_ADDRESS,
            calldata: "0xb2273aea",
            value: "0",
          },
          wallet: {
            icon: "/favicon-192x192.png",
            name: "Nouns Connect",
          },
          signature: "createdWithNounsConnect()",
        },
      ]);
    }
  }, [transactions, addTransactions]);

  const SubmitComponent = nounsDao
    ? SubmitProposalNouns
    : SubmitProposalBuilder;

  const { isConnected } = useAccount();
  const { push } = useRouter();

  const onProposalSubmitted = useCallback(
    async ({ proposalId }: { proposalId: string }) => {
      await push(
        `/proposals/created?id=${proposalId}&address=${dao.collectionAddress}`
      );
      clear();
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
                showDeleteButtonInline={false}
                floatingDisplay={true}
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
            <DescriptionManager />
            <div className="h-4"> </div>
            <ProposalSimulation daoTreasuryAddress={dao.treasuryAddress} />
            <div className="h-4"> </div>
            <SubmitComponent
              onSubmitted={onProposalSubmitted}
              isNounsDaoStructure={!!nounsDao}
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
