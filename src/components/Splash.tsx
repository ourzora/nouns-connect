import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { usePushStore } from "../stores/push-store";
import { CHAIN_ID } from "../utils/constants";
import { AppButton } from "./AppButton";

const NETWORK_NAMES = {
  1: "Mainnet",
  5: "Görli",
};

const tagLineText = "font-light font-md my-3 text-xl font-londrina";

export const Splash = () => {
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const { push } = useRouter();

  const onConnect = useCallback(() => {
    push("/daos");
  }, [push]);

  const { isConnected } = useAccount({ onConnect });

  const [{ buttonText, buttonOnClick }, setButtonState] = useState({
    buttonText: "Loading...",
    buttonOnClick: () => {},
  });

  const { setPermissionGranted } = usePushStore();

  useEffect(() => {
    if (isConnected) {
      setButtonState({
        buttonText: "Go to my DAOs",
        buttonOnClick: () => {
          if ("Notification" in window) {
            Notification.requestPermission((permission) => {
              console.log("has push notif", permission);
              setPermissionGranted(permission);
            });
          }
          push("/daos");
        },
      });
    } else if (openConnectModal) {
      setButtonState({
        buttonText: "Connect Wallet",
        buttonOnClick: () => openConnectModal(),
      });
    } else {
      setButtonState({
        buttonText: `Change chain to ${NETWORK_NAMES[CHAIN_ID]}`,
        buttonOnClick: () => openChainModal(),
      });
    }
  }, [isConnected, openConnectModal, setPermissionGranted]);

  return (
    <section className="flex items-center text-center fixed h-screen top-0 z-50 relative font-londrina">
      <div className="flex flex-col">
        <h3 className={tagLineText}>The easiest way to</h3>
        <h1 className="text-6xl font-londrina">Connect your Nouns DAO</h1>
        <h3 className={tagLineText}>
          to any crypto application to submit a proposal.
        </h3>
        <div className={"pt-10 justify-center flex"}>
          <AppButton onClick={buttonOnClick}>{buttonText}</AppButton>
        </div>
      </div>
    </section>
  );
};
