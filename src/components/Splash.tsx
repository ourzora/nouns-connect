import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { CHAIN_ID } from "../utils/constants";
import { AppButton } from "./AppButton";
import { SplashImageScatter } from "./SplashImageScatter";

const NETWORK_NAMES = {
  1: "Mainnet",
  5: "Görli",
};

const tagLineText = "font-light font-md my-3 text-xl";

export const Splash = () => {
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const { push } = useRouter();

  const onConnect = useCallback(() => {
    push("/daos");
  }, [push]);
  const { isConnected } = useAccount(onConnect as any);

  const [{ buttonText, buttonOnClick }, setButtonState] = useState({
    buttonText: "Loading...",
    buttonOnClick: () => {},
  });

  useEffect(() => {
    if (isConnected) {
      setButtonState({
        buttonText: "Go to my DAOs",
        buttonOnClick: () => push("/daos"),
      });
    } else if (openConnectModal) {
      setButtonState({
        buttonText: "Connect to your wallet",
        buttonOnClick: () => openConnectModal(),
      });
    } else {
      setButtonState({
        buttonText: `Change chain to ${NETWORK_NAMES[CHAIN_ID]}`,
        buttonOnClick: () => openChainModal(),
      });
    }
  }, [isConnected, openConnectModal]);

  return (
    <section className="flex justify-items-center align-items-center flex-col text-center m-10">
      <SplashImageScatter />
      <h3 className={tagLineText}>The easiest way to</h3>
      <h1 className="text-6xl ">Connect your Nouns DAO</h1>
      <h3 className={tagLineText}>
        to any crypto application to submit a proposal.
      </h3>
      <div className={"mt-10"}>
        <AppButton onClick={buttonOnClick}>{buttonText}</AppButton>
      </div>
    </section>
  );
};
