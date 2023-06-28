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
import { parseUri, getSdkError } from "@walletconnect/utils";

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
      setWcClientData(null);
    } catch (error) {
      console.log("Error trying to close WC session: ", error);
    }
  }, [web3wallet]);

  const wcConnect = useCallback(
    async ({ uri }: { uri?: string }) => {
      let topic;
      if (parseUri(uri).version === 1) {
        alert("not support");
      } else {
        const wcConnector = new Core({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
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

        wcConnector.on("disconnect", (evt: any) => {
          console.log({ type: "disconnect", evt });
        });

        web3wallet.on(
          "session_proposal",
          async (proposal: Web3WalletTypes.SessionProposal) => {
            const requiredNamespaces = proposal.params.requiredNamespaces;
            const namespaces: any = {};
            Object.keys(requiredNamespaces).forEach((key) => {
              const accounts: string[] = [];
              requiredNamespaces[key].chains.map((chain) => {
                accounts.push(`${chain}:${daoTreasuryAddress}`);
              });
              namespaces[key] = {
                accounts,
                methods: requiredNamespaces[key].methods,
                events: requiredNamespaces[key].events,
              };
            });

            const session = await web3wallet.approveSession({
              id: proposal.id,
              namespaces,
            });
            setTopic(session.topic);
            topic = session.topic;
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
              return await web3wallet.respondSessionRequest({
                topic: event.topic,
                response: {
                  id: event.id,
                  jsonrpc: "2.0",
                  error: {
                    code: 300,
                    message: "error cannot sign",
                  },
                },
              });
            }

            await web3wallet.respondSessionRequest({
              topic: event.topic,
              response: {
                id: event.id,
                result:
                  "0x0000000000000000000000000000000000000000000000000000000000000000",
                jsonrpc: "2.0",
              },
            });
            onWCReqCurry.current(event);
          }
        );
      }
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
