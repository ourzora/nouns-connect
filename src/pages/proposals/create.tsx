import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead } from "wagmi";
import { useCallback } from "react";
import { useRouter } from "next/router";

import { DescriptionManager } from "../../components/DescriptionManager";
import Layout from "../../components/layout";
import { RenderRequest } from "../../components/RenderRequest";
import { SubmitProposalNouns } from "../../components/SubmitProposalNouns";
import { SubmitProposalBuilder } from "../../components/SubmitProposalBuilder";
import { Transaction, useTransactionsStore } from "../../stores/interactions";
import governorAbi from "@nouns/contracts/dist/abi/contracts/governance/NounsDAOLogicV2.sol/NounsDAOLogicV2.json";
import { AppButton } from "../../components/AppButton";
import { BorderFrame } from "../../components/BorderFrame";
import { DAOHeader } from "../../components/DAOHeader";
import { GetDaoServerSide } from "../../fetchers/get-dao";
import { PageFrameSize } from "../../components/PageFrameSize";

function DAOActionComponent({ dao }: { dao: any }) {
  const { transactions, clear } = useTransactionsStore();
  const { data, isError, isLoading } = useContractRead({
    abi: governorAbi,
    address: dao.governorAddress,
    functionName: "admin",
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
    <PageFrameSize>
      <DAOHeader showConnection={false} dao={dao} />

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
              from={dao.treasuryAddress}
              transactions={transactions}
            />
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
    </PageFrameSize>
  );
}

const DAOActionPage = ({ dao }) => {
  return (
    <Layout title="Nouns Connect | Create Proposal">
      <DAOActionComponent dao={dao} />
    </Layout>
  );
};

export const getServerSideProps = GetDaoServerSide;

export default DAOActionPage;
