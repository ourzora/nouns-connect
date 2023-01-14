import { alchemyProvider } from "wagmi/providers/alchemy";
import {
  WagmiConfig,
  createClient,
  configureChains,
  mainnet,
  goerli,
} from "wagmi";
import {Toaster} from 'react-hot-toast';
import { publicProvider } from "wagmi/providers/public";

import { Londrina } from "../fonts/Londrina";
import { ptRootUi } from "../fonts/PtRootUi";

import "../styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { CHAIN_ID } from "../utils/constants";

const { chains, provider, webSocketProvider } = configureChains(
  [CHAIN_ID === 1 ? mainnet : goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "DAOConnect",
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
    <main className={`${Londrina.variable} ${ptRootUi.variable}`}>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <Toaster />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </main>
  );
}
