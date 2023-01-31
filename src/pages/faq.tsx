import dynamic from "next/dynamic";
import React from "react";
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
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="my-2">
    <h3 className="text-2xl mb-2 mt-4">{title}</h3>
    <p className="font-pt text-lg">{children}</p>
  </div>
);

const FAQ = () => {
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

        <FAQItem title="What apps are supported?">
          Most DApps are supported that do not require a signature-based login.
        </FAQItem>

        <FAQItem title="How do I report a bug / improvement?">
          <a href="https://twitter.com/isiain" className="hover:underline" target="_blank">@isiain</a> is the primary developer and early on will respond to bug
          reports. Later, we plan to properly release and open source the tool
          to the nouns and builder communities.
        </FAQItem>

        <MadePossibleLogo />
      </PageFrameSize>
    </Layout>
  );
};

export default FAQ;
