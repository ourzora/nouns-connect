import request from "graphql-request";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useProvider } from "wagmi";
import useSWR from "swr";

import { ConnectWalletInput } from "../../components/ConnectWalletInput";
import Layout from "../../components/layout";
import { RenderRequest } from "../../components/RenderRequest";
import {
  LastTokenQuery,
  NounsQueryByCollection,
} from "../../config/daos-query";
import { Transaction, useTransactionsStore } from "../../stores/interactions";
import { CHAIN_ID, ZORA_API_URL } from "../../utils/constants";
import { useWalletConnectClient } from "../../utils/useWalletConnectClient";
import { useWCConnectionStore } from "../../stores/connection";
import { BorderFrame } from "../../components/BorderFrame";
import { AppButton } from "../../components/AppButton";

function DAOActionComponent({ dao }: { dao: any }) {
  const [error, setError] = useState<undefined | string>(undefined);
  const { transactions, addTransactions } = useTransactionsStore();
  const { connectTo, connectedTo, icon, disconnect } = useWCConnectionStore();

  const onWCRequest = useCallback(
    (error: any, payload: any) => {
      if (error) {
        toast(error.toString());
        setError(error);
      }

      const paramArgs = payload.params.map((param: any) => ({
        data: {
          id: payload.id,
          gas: param.gas,
          to: param.to,
          calldata: param.data,
          value: param.value || "0",
        },
        wallet: { connectedTo, icon },
      }));
      addTransactions(paramArgs);
    },
    [setError, addTransactions, connectedTo, icon]
  );

  const chainId = CHAIN_ID;
  const provider = useProvider();
  const { isConnected } = useAccount();

  const handleConnectionURI = async ({ uri }: { uri: string }) => {
    try {
      await wcConnect({ uri });
    } catch (err: any) {
      toast("Error Connecting Wallet");
      console.error(err);
    }
  };

  const { wcClientData, wcConnect, wcDisconnect } = useWalletConnectClient({
    onWCRequest,
    daoTreasuryAddress: dao.treasuryAddress,
    provider,
    chainId,
  });

  useEffect(() => {
    if (wcClientData?.name) {
      console.log(wcClientData);
      connectTo(
        wcClientData.name,
        wcClientData.icons?.length >= 1 ? wcClientData.icons[0] : undefined
      );
    } else {
      disconnect();
    }
  }, [wcClientData?.name]);

  const disconnectButton = (
    <AppButton
      inverted
      onClick={() => {
        toast("Disconnected Wallet from DAO");
        wcDisconnect();
        disconnect();
      }}
    >
      Disconnect from App
    </AppButton>
  );

  return (
    <>
      {error && <span>{error}</span>}

      {!wcClientData && (
        <ConnectWalletInput
          onConnect={handleConnectionURI}
          client={wcClientData}
        />
      )}

      {transactions?.length > 0 ? (
        <>
          {transactions.map((transaction: Transaction, indx: number) => (
            <BorderFrame key={indx}>
              <RenderRequest
                indx={indx}
                key={transaction.data.id}
                transaction={transaction}
              />
            </BorderFrame>
          ))}
        </>
      ) : isConnected ? (
        <BorderFrame>
          <div className="font-lg p-20">
            Go back to <span className="font-bold">{wcClientData?.name}</span>{" "}
            to start
            <br />
            generating transactions for your proposal.
          </div>
        </BorderFrame>
      ) : (
        <div className="mt-5 underline">
          Connect your wallet to submit a proposal
        </div>
      )}
      <div className="mt-8" />
      {isConnected ? (
        transactions.length === 0 ? (
          <>{disconnectButton}</>
        ) : (
          <div className="flex ml-8">
            {disconnectButton}
            <AppButton
              className="ml-4 flex-grow"
              href={`/proposals/create?address=${dao.collectionAddress.toLowerCase()}`}
            >
              Next step
            </AppButton>
          </div>
        )
      ) : (
        <></>
      )}
    </>
  );
}

const DAOActionPage = ({ dao }) => {
  const { connectedTo, icon } = useWCConnectionStore();
  const { data: imageData } = useSWR(
    dao.collectionAddress,
    (collectionAddress) =>
      request(ZORA_API_URL, LastTokenQuery, {
        tokens: [{ address: collectionAddress, tokenId: "0" }],
        chain: CHAIN_ID === 1 ? "ETHEREUM" : "GOERLI",
      })
  );

  return (
    <Layout title="DAOConnect">
      <div className="text-center">
        <h1 className="text-6xl sm:text-4xl">
          {!connectedTo && <>Let’s connect </>}
          {imageData && imageData.tokens.nodes.length && (
            <img
              className="mx-2 w-14 h-14 rounded-lg inline-block"
              src={imageData.tokens.nodes[0].token.image.mediaEncoding.poster}
              alt=""
            />
          )}{" "}
          {dao.name}
        </h1>
        <p
          className="mt-2 mb-6 font-pt text-xl font-regular"
          style={{ color: "#808080" }}
        >
          {connectedTo ? (
            <>
              is now connected to{" "}
              {icon && (
                <img
                  src={icon}
                  className="inline-block px-1"
                  width="30"
                  height="30"
                  alt=""
                />
              )}{" "}
              <span className="text-black">{connectedTo}</span>
            </>
          ) : (
            <>We’re now going to connect {dao.name} to your app of choice</>
          )}
        </p>

        <DAOActionComponent dao={dao} />
      </div>
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
