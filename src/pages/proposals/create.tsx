import { ConnectButton } from "@rainbow-me/rainbowkit";
import request from "graphql-request";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useAccount } from "wagmi";
import { DescriptionManager } from "../../components/DescriptionManager";

import Layout from "../../components/layout";
import { RenderRequest } from "../../components/RenderRequest";
import { SubmitProposal } from "../../components/SubmitProposal";
import { AllNounsQueries } from "../../config/daos-query";
import { useDescription } from "../../stores/description";
import { Transaction, useTransactionsStore } from "../../stores/interactions";
import { CHAIN_ID, ZORA_API_URL } from "../../utils/constants";

function DAOActionComponent({ dao }: { dao: any }) {
  const { transactions } = useTransactionsStore();
  const { description, editing: editingDescription } = useDescription();

  const { isConnected } = useAccount();

  return (
    <>
      <ul>
        {transactions.map((transaction: Transaction, indx: number) => (
          <>
            <RenderRequest
              indx={indx}
              key={transaction.id}
              transaction={transaction}
            />
          </>
        ))}
      </ul>
      {isConnected ? (
        transactions.length === 0 ? (
          <div>
            No transactions added to this DAO{" "}
            <Link href={`/daos/${dao.collectionAddress.toLowerCase()}`}>
              Go to Propose Page
            </Link>
          </div>
        ) : (
          <>
            <DescriptionManager />
            {description.length > 0 && !editingDescription && (
              <SubmitProposal
                description={description}
                daoAddress={dao.governorAddress}
                from={dao.treasuryAddress}
                transactions={transactions}
              />
            )}
          </>
        )
      ) : (
        <div className="mt-5 underline">
          Connect your wallet to submit a proposal
          <ConnectButton />
        </div>
      )}
    </>
  );
}

const DAOActionPage = ({ dao }) => {
  return (
    <Layout title="DAOConnect">
      <h1>
        DAOConnect for <strong className="">{dao.name}</strong>
      </h1>

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

  const daos = await request(ZORA_API_URL, AllNounsQueries, {
    chain: { "1": "MAINNET", "5": "GOERLI" }[CHAIN_ID.toString()],
    collectionAddresses: [query.address as string],
  });

  const dao = daos.nouns.nounsDaos.nodes[0];

  return {
    props: { dao },
  };
};

export default DAOActionPage;
