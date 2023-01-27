import { useState, useCallback, useEffect, useRef } from "react";
import WalletConnect from "@walletconnect/client";
import { IClientMeta, IWalletConnectSession } from "@walletconnect/types";
import { Provider } from "@ethersproject/abstract-provider";
import toast from "react-hot-toast";

const rejectWithMessage = (
  connector: WalletConnect,
  id: number | undefined,
  message: string
) => {
  connector.rejectRequest({ id, error: { message } });
};

export const useWalletConnectClient = ({
  provider,
  chainId,
  onWCRequest,
  daoTreasuryAddress,
}: {
  provider: Provider;
  chainId: number;
  onWCRequest: (a: any, b: any) => void;
  daoTreasuryAddress: string;
}) => {
  const [wcClientData, setWcClientData] = useState<IClientMeta | null>(null);
  const [connector, setConnector] = useState<WalletConnect | undefined>();

  const localStorageSessionKey = useRef(`session_${daoTreasuryAddress}`);

  const onWCReqCurry = useRef(onWCRequest);

  useEffect(() => {
    onWCReqCurry.current = onWCRequest;
  }, [onWCRequest, onWCReqCurry]);

  const trackEvent = useCallback((action: any, meta: any) => {
    if (!meta) return;

    // todo track
    console.log({ action, meta });
  }, []);

  const wcDisconnect = useCallback(async () => {
    try {
      await connector?.killSession();
      setConnector(undefined);
      localStorage.removeItem(localStorageSessionKey.current);
      setWcClientData(null);
    } catch (error) {
      console.log("Error trying to close WC session: ", error);
    }
  }, [connector]);

  const wcConnect = useCallback(
    async ({
      uri,
      session,
    }: {
      uri?: string;
      session?: IWalletConnectSession;
    }) => {
      const wcConnector = new WalletConnect({
        uri,
        session,
        storageId: localStorageSessionKey.current,
      });
      setConnector(wcConnector);
      setWcClientData(wcConnector.peerMeta);

      wcConnector.on("session_request", (error: any, payload: any) => {
        if (error) {
          throw error;
        }

        wcConnector.approveSession({
          accounts: [daoTreasuryAddress],
          chainId,
        });

        trackEvent("New session", wcConnector.peerMeta);

        setWcClientData(payload.params[0].peerMeta);
        toast("WC Connected");
      });

      wcConnector.on("call_request", async (error: any, payload: any) => {
        if (error) {
          throw error;
        }

        try {
          onWCReqCurry.current(error, payload);

          trackEvent("Transaction Confirmed", wcConnector.peerMeta);

          wcConnector.approveRequest({
            id: payload.id,
            result: '0x0000000000000000000000000000000000000000000000000000000000000000',
          });
        } catch (err) {
          rejectWithMessage(wcConnector, payload.id, (err as Error).message);
        }
      });

      wcConnector.on("disconnect", (error: any) => {
        if (error) {
          throw error;
        }
        wcDisconnect();
      });
    },
    [provider, wcDisconnect, onWCReqCurry]
  );

  useEffect(() => {
    if (!connector) {
      const session = localStorage.getItem(localStorageSessionKey.current);
      if (session) {
        wcConnect({ session: JSON.parse(session) });
      }
    }
  }, [connector, wcConnect]);

  return { wcClientData, wcConnect, wcDisconnect };
};
