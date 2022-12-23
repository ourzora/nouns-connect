import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useAccount, useProvider, useQuery } from "wagmi";
import { ConnectWalletInput } from "../../components/ConnectWalletInput";
import Layout from "../../components/layout";
import { RenderRequest } from "../../components/RenderRequest";
import { RequestType } from "../../components/RequestType";
import { SubmitProposal } from "../../components/SubmitProposal";
import { DAOS } from "../../config/daos";
import { CHAIN_ID } from "../../utils/constants";
import { useWalletConnectClient } from "../../utils/useWalletConnectClient";

function DAOActionComponent({ daoAddress }) {
  const [error, setError] = useState<undefined | string>(undefined);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const { isReady, query } = useRouter();

  const onWCRequest = useCallback(
    (error: any, payload: any) => {
      if (error) {
        setError(error);
      }

      const paramArgs = payload.params.map((param: any) => ({
        id: payload.id,
        gas: param.gas,
        to: param.to,
        calldata: param.data,
        value: param.value || "0",
      }));

      setRequests([...requests, ...paramArgs]);
    },
    [requests, setError, setRequests]
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
    daoAddress,
    provider,
    chainId,
  });

  if (wcClientData) {
    console.log({ wcClientData });
    return (
      <>
        {error && <span>{error}</span>}
        <h3 className="text-l">Connected to:</h3>
        <h4 className="font-bold">{wcClientData.name}</h4>
        <p>{wcClientData.description}</p>
        <button className="underline mt-4" onClick={() => wcDisconnect()}>
          Disconnect Wallet Connect from App
        </button>
        <br />
        <ul>
          {requests.map((request: any, indx: number) => (
            <>
              <RenderRequest indx={indx} key={request.id} request={request} />
            </>
          ))}
        </ul>
        {isConnected && requests.length > 0 ? (
          <SubmitProposal daoAddress={daoAddress} requests={requests} />
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

const DAOActionPage = () => {
  const { query, isReady } = useRouter();
  const DAO = isReady
    ? DAOS.find((dao) => dao.token === query.address)
    : undefined;
  if (!DAO) {
    return <span>loading...</span>;
  }
  return (
    <Layout title="DAOConnect">
      <h1>DAOConnect for <strong className="">{DAO.name}</strong></h1>

      {isReady && <DAOActionComponent daoAddress={DAO.token} />}
    </Layout>
  );
};

export default DAOActionPage;
