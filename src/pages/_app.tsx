import { alchemyProvider } from "wagmi/providers/alchemy";
import {
  WagmiConfig,
  createClient,
  configureChains,
  mainnet,
  goerli,
} from "wagmi";
import { Toaster } from "react-hot-toast";
import { publicProvider } from "wagmi/providers/public";
import NextNProgress from "nextjs-progressbar";
import { Londrina } from "../fonts/Londrina";
import { ptRootUi } from "../fonts/PtRootUi";

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { CHAIN_ID } from "../utils/constants";
import Header from "../components/Header";
import dynamic from "next/dynamic";

const SplashImageScatter = dynamic(
  () => import("../components/SplashImageScatter"),
  {
    ssr: false,
  }
);

const { chains, provider, webSocketProvider } = configureChains(
  [CHAIN_ID === 1 ? mainnet : goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Nouns Connect",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function MyApp({ Component, pageProps }: any) {
  return (
    <main className={`${Londrina.variable} ${ptRootUi.variable} font-sans`}>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <NextNProgress
            color={"rgba(0,0,0,.5)"}
            startPosition={0.125}
            stopDelayMs={200}
            height={2}
            showOnShallow
            options={{ showSpinner: false }}
          />
          <Header />
          <Toaster />
          <SplashImageScatter />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </main>
  );
}
