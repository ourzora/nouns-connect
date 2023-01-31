import { useState, useCallback, useEffect, useRef } from "react";
import { Provider } from "@ethersproject/abstract-provider";
import toast from "react-hot-toast";
import { Core } from "@walletconnect/core";
import {
  IWeb3Wallet,
  Web3Wallet,
  Web3WalletTypes,
} from "@walletconnect/web3wallet";
import { CHAIN_ID } from "./constants";
import { encodeTypeByte, getSdkError } from "@walletconnect/utils";

export const useWalletConnectClient = ({
  provider,
  chainId,
  onWCRequest,
  daoTreasuryAddress,
}: {
  provider: Provider;
  chainId: number;
  onWCRequest: (a: any) => void;
  daoTreasuryAddress: string;
}) => {
  const [wcClientData, setWcClientData] = useState<any>(null);
  const [web3wallet, setWeb3wallet] = useState<IWeb3Wallet | undefined>();
  const [topic, setTopic] = useState<string | undefined>();

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
      web3wallet.disconnectSession({
        topic,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });
      localStorage.removeItem(localStorageSessionKey.current);
      setWcClientData(null);
    } catch (error) {
      console.log("Error trying to close WC session: ", error);
    }
  }, [web3wallet]);

  const wcConnect = useCallback(
    async ({ uri }: { uri?: string }) => {
      const wcConnector = new Core({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        storageOptions: {
          database: `session-${daoTreasuryAddress}`,
        },
      });
      const web3wallet = await Web3Wallet.init({
        core: wcConnector,
        metadata: {
          name: "Nouns Connect",
          description: "Nouns Connect",
          url: "https://nounsconnect.wtf/",
          icons: [],
        },
      });
      setWeb3wallet(web3wallet as any);

      await web3wallet.core.pairing.pair({ uri });

      const namespaces = {
        eip155: {
          accounts: [`eip155:${CHAIN_ID}:${daoTreasuryAddress}`],
          methods: ["eth_sendTransaction"],
          events: [],
        },
      };

      wcConnector.on("disconnect", (evt: any) => {
        console.log({ type: "disconnect", evt });
      });

      web3wallet.on(
        "session_proposal",
        async (proposal: Web3WalletTypes.SessionProposal) => {
          const session = await web3wallet.approveSession({
            id: proposal.id,
            namespaces,
          });
          setTopic(session.topic);
          trackEvent("New session", proposal.params.proposer.metadata);
          setWcClientData(proposal.params.proposer.metadata);
          toast("WC Connected");
        }
      );

      web3wallet.on(
        "session_request",
        async (event: Web3WalletTypes.SessionRequest) => {
          console.log({ event });
          if (
            ["personal_sign", "eth_sign", "eth_signTypedData"].includes(
              event.params.request.method
            )
          ) {
            new Notification(
              "Cannot sign messages from a WalletConnect client",
              {
                body: "A message was requested to be signed, but a connected wallet cannot sign a message",
              }
            );
            toast("Cannot sign messages from a DAO", { duration: 20000 });
          }

          onWCReqCurry.current(undefined, event);
          await web3wallet.respondSessionRequest({
            topic,
            response: {
              id: event.id,
              result:
                "0x0000000000000000000000000000000000000000000000000000000000000000",
              jsonrpc: "2.0",
            },
          });
        }
      );
    },
    [
      setWcClientData,
      wcDisconnect,
      wcDisconnect,
      setWcClientData,
      wcClientData,
      web3wallet,
      setWeb3wallet,
    ]
  );

  return { wcClientData, wcConnect, wcDisconnect };
};
