import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useProvider } from "wagmi";

import { ConnectWalletInput } from "../../components/ConnectWalletInput";
import Layout from "../../components/layout";
import { RenderRequest } from "../../components/RenderRequest";
import { Transaction, useTransactionsStore } from "../../stores/interactions";
import { CHAIN_ID } from "../../utils/constants";
import { useWalletConnectClient } from "../../utils/useWalletConnectClient";
import { useWCConnectionStore } from "../../stores/connection";
import { BorderFrame } from "../../components/BorderFrame";
import { AppButton } from "../../components/AppButton";
import { DAOHeader } from "../../components/DAOHeader";
import { GetDaoServerSide } from "../../fetchers/get-dao";

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
          <h3 className="font-lg text-left">Transactions</h3>
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
      ) : wcClientData ? (
        <BorderFrame>
          <div className="font-lg p-20">
            Go back to <span className="font-bold">{wcClientData?.name}</span>{" "}
            to start
            <br />
            generating transactions for your proposal.
          </div>
        </BorderFrame>
      ) : (
        <></>
      )}
      <div className="mt-8" />
      {wcClientData ? (
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
  return (
    <Layout title="DAOConnect">
      <div className="text-center relative max-w-3xl w-full mx-4">
        <DAOHeader showConnection={true} dao={dao} />

        <DAOActionComponent dao={dao} />
      </div>
    </Layout>
  );
};

export const getServerSideProps = GetDaoServerSide;

export default DAOActionPage;
