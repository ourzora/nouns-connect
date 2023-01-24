import { ConnectButton } from "@rainbow-me/rainbowkit";
import request from "graphql-request";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useAccount, useContractRead } from "wagmi";
import { DescriptionManager } from "../../components/DescriptionManager";

import Layout from "../../components/layout";
import { RenderRequest } from "../../components/RenderRequest";
import { SubmitProposalNouns } from "../../components/SubmitProposalNouns";
import { SubmitProposalBuilder } from "../../components/SubmitProposalBuilder";
import { NounsQueryByCollection } from "../../config/daos-query";
import { useDescription } from "../../stores/description";
import { Transaction, useTransactionsStore } from "../../stores/interactions";
import { CHAIN_ID, ZORA_API_URL } from "../../utils/constants";
import governorAbi from "@nouns/contracts/dist/abi/contracts/governance/NounsDAOLogicV2.sol/NounsDAOLogicV2.json";
import { AppButton } from "../../components/AppButton";
import { BorderFrame } from "../../components/BorderFrame";
import { DAOHeader } from "../../components/DAOHeader";

function DAOActionComponent({ dao }: { dao: any }) {
  const { transactions } = useTransactionsStore();
  const { description, editing: editingDescription } = useDescription();
  const { data, isError, isLoading } = useContractRead({
    abi: governorAbi,
    address: dao.governorAddress,
    functionName: "admin",
  });

  const SubmitComponent = isError ? SubmitProposalBuilder : SubmitProposalNouns;

  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col relative max-w-3xl w-full mx-4">
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
              isNounsDaoStructure={!isError}
              daoTokenAddress={dao.tokenAddress}
              daoAddress={dao.governorAddress}
              from={dao.treasuryAddress}
              transactions={transactions}
            />
          </>
        ) : (
          <div className="mt-5 underline">
            Connect your wallet to submit a proposal
            <ConnectButton />
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

const DAOActionPage = ({ dao }) => {
  return (
    <Layout title="Nouns Connect | Create Proposal">
      <DAOActionComponent dao={dao} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=50, stale-while-revalidate=59"
  );

  const daos = await request(ZORA_API_URL, NounsQueryByCollection, {
    chain: { "1": "MAINNET", "5": "GOERLI" }[CHAIN_ID.toString()],
    collectionAddresses: [query.address as string],
  });

  const dao = daos.nouns.nounsDaos.nodes[0];

  return {
    props: { dao },
  };
};

export default DAOActionPage;
