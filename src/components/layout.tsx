import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Logo } from "./Logo";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Nouns Connect" }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <link href="/styles/globals.css" type="text/stylesheet" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="font-pt leading-6">
      <nav className="m-8 text-xl font-bold flex align-center">
        <Link className="" href="/">
          <Logo /> <span className="">NounsConnect</span>
        </Link>{" "}
        {/* | <Link href="/about">About</Link> */}
      </nav>
      <aside className="float-right mx-8 -mt-16">
        <ConnectButton />
      </aside>
    </header>
    <div
      className="md:m-10 font-londrina flex items-center justify-center"
      style={{ minHeight: "80vh" }}
    >
      {children}
    </div>
    {/* <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer> */}
  </>
);

export default Layout;
