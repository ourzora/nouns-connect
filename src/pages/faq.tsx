import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useCallback, useState } from "react";
import { DefinitionListItem } from "../components/DefinitionListItem";
import Layout from "../components/layout";
import { PageFrameSize } from "../components/PageFrameSize";

const MadePossibleLogo = dynamic(
  () => import("../components/MadePossibleLogo"),
  {
    ssr: false,
  }
);

const FAQItem = ({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) => (
  <div id={id} className="my-2">
    <h3 className="text-2xl mb-2 mt-4">{title}</h3>
    <p className="font-pt text-lg">{children}</p>
  </div>
);

const ExternalLink = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => (
  <a href={href} target="_blank" className="underline">
    {children}
  </a>
);

const FAQ = () => {
  const [hasWarning, setHasWarning] = useState<boolean>(false);
  const toggleWarningTokens = useCallback(() => {
    setHasWarning(!hasWarning);
  }, [hasWarning, setHasWarning]);

  return (
    <Layout>
      <PageFrameSize>
        <h1 className="text-4xl mb-6">NounsConnect FAQ</h1>
        <FAQItem title="Who is behind NounsConnect?">
          Nouns Connect is a project started under the ZORA umbrella
        </FAQItem>

        <FAQItem title="My WalletConnect QR Code is not scanning">
          Make sure you're clicking the “Need the WalletConnect modal?” and
          using that QR code or copying the connection link there.
        </FAQItem>

        <FAQItem id="supported-apps" title="What apps are supported?">
          <div className="mb-4">
            Most DApps are supported that do not require a signature-based
            login. Some common actions to use are:
          </div>
          <dl>
            <DefinitionListItem name="Trade NFTs:">
              <ul>
                <li>
                  <ExternalLink href="https://create.zora.co/">
                    create.zora.co
                  </ExternalLink>{" "}
                  – ZORA create is a tool for purchasing and minting NFTs
                </li>
                <li>
                  <ExternalLink href="https://gem.xyz/">gem.xyz</ExternalLink> –
                  gem is a NFT marketplace aggregator
                </li>
                <li>
                  <ExternalLink href="https://looksrare.org/">
                    looksrare.org
                  </ExternalLink>{" "}
                  – LooksRare is an NFT marketplace for 721s and 1155s
                </li>
              </ul>
            </DefinitionListItem>
            <DefinitionListItem name="Transfer ETH or Tokens:">
              <ul>
                <li>
                  <ExternalLink href="https://myetherwallet.com/">
                    myetherwallet.com
                  </ExternalLink>{" "}
                  – MyEtherWallet allows transferring ETH, ERC20s and NFTs to
                  other users.
                </li>
              </ul>
            </DefinitionListItem>
            <DefinitionListItem name="Create an ETH split contract">
              <ul>
                <li>
                  <ExternalLink href="https://app.0xsplits.xyz/">
                    app.0xsplits.xyz
                  </ExternalLink>{" "}
                  – 0xsplits allows your DAO to create a splits contract that
                  pays out to multiple users as it accrues value.
                </li>
              </ul>
            </DefinitionListItem>
            <DefinitionListItem
              name={
                <>
                  Trade tokens <button onClick={toggleWarningTokens}>⚠</button>
                </>
              }
            >
              <AnimatePresence>
                {hasWarning && (
                  <motion.p
                    key="warning"
                    className="mb-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "100%" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    Note: If an application requires an approval, that will not
                    be reflected until the approval proposal is passed.
                    Additionally, apps with slippage and timeouts need to be
                    adjusted to allow for leniency with the required delay to
                    execute.
                  </motion.p>
                )}
              </AnimatePresence>
              <ul>
                <li>
                  <ExternalLink href="https://app.uniswap.org/">
                    app.uniswap.org
                  </ExternalLink>{" "}
                  – Uniswap is the original ERC20 DEX that allows you to trade
                  ETH for tokens
                </li>
                <li>
                  <ExternalLink href="https://app.aave.com/">
                    app.aave.com
                  </ExternalLink>{" "}
                  – AAVE is the largest ETH liquidity protocol.
                </li>
                <li>
                  <ExternalLink href="https://app.compound.finance/">
                    app.compound.finance
                  </ExternalLink>{" "}
                  – Compound is a lending and liquidity protocol
                </li>
              </ul>
            </DefinitionListItem>
          </dl>
          <div>
            You can log in and out of each of these apps to add different types
            of transactions to your proposal.
          </div>
        </FAQItem>

        <FAQItem title="How do I get a wallet QR or URL?">
          You can get the wallet QR by clicking on: "Copy QR Code" or taking a
          screenshot and clicking the QR code icon to connect the app.
        </FAQItem>

        <FAQItem title="How do I report a bug / improvement?">
          <a
            href="https://twitter.com/isiain"
            className="hover:underline"
            target="_blank"
          >
            @isiain
          </a>{" "}
          is the primary developer and early on will respond to bug reports.
          Later, we plan to properly release and open source the tool to the
          nouns and builder communities.
        </FAQItem>

        <MadePossibleLogo />
      </PageFrameSize>
    </Layout>
  );
};

export default FAQ;
