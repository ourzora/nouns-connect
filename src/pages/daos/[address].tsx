import request from "graphql-request";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useProvider } from "wagmi";

import { ConnectWalletInput } from "../../components/ConnectWalletInput";
import Layout from "../../components/layout";
import { RenderRequest } from "../../components/RenderRequest";
import { AllNounsQueries } from "../../config/daos-query";
import { Transaction, useTransactionsStore } from "../../stores/interactions";
import { CHAIN_ID, ZORA_API_URL } from "../../utils/constants";
import { useWalletConnectClient } from "../../utils/useWalletConnectClient";

function DAOActionComponent({ dao }: { dao: any }) {
  const [error, setError] = useState<undefined | string>(undefined);
  const { transactions, addTransactions } = useTransactionsStore();

  const onWCRequest = useCallback(
    (error: any, payload: any) => {
      if (error) {
        toast(error.toString());
        setError(error);
      }

      const paramArgs = payload.params.map((param: any) => ({
        id: payload.id,
        gas: param.gas,
        to: param.to,
        calldata: param.data,
        value: param.value || "0",
      }));
      addTransactions(paramArgs);
    },
    [setError, addTransactions]
  );

  const chainId = CHAIN_ID;
  const provider = useProvider();
  const { isConnected } = useAccount();

  const handleConnectionURI = async ({ uri }: { uri: string }) => {
    try {
      await wcConnect({ uri });
    } catch (err: any) {
      console.error(err);
    }
  };

  const { wcClientData, wcConnect, wcDisconnect } = useWalletConnectClient({
    onWCRequest,
    daoTreasuryAddress: dao.treasuryAddress,
    provider,
    chainId,
  });

  if (wcClientData) {
    return (
      <>
        {error && <span>{error}</span>}
        <h3 className="text-l">Connected to:</h3>
        <h4 className="font-bold">{wcClientData.name}</h4>
        <p>{wcClientData.description}</p>
        <button
          className="underline mt-4"
          onClick={() => {
            toast("Disconnected Wallet from DAO");
            wcDisconnect();
          }}
        >
          Disconnect Wallet Connect from App
        </button>
        <br />
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
            <div>No transactions added to this DAO</div>
          ) : (
            <Link
              href={`/proposals/create?address=${dao.collectionAddress.toLowerCase()}`}
            >
              Create Proposal
            </Link>
          )
        ) : (
          <div className="mt-5 underline">
            Connect your wallet to submit a proposal
          </div>
        )}
      </>
    );
  }

  return (
    <ConnectWalletInput onConnect={handleConnectionURI} client={wcClientData} />
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
