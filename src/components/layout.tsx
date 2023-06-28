import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import Logo from "./Logo";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "NounsConnect" }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <link href="/styles/globals.css" type="text/stylesheet" />

      <link rel="shortcut icon" type="image/png" href="/favicon-192x192.png" />
      <link rel="shortcut icon" sizes="192x192" href="/favicon-192x192.png" />
      <link rel="apple-touch-icon" href="/favicon-192x192.png" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div
      className="md:m-10 font-londrina flex items-center justify-center"
      style={{ minHeight: "80vh" }}
    >
      {children}
    </div>
  </>
);

export default Layout;
