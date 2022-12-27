import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "DAOConnect" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <link href="/styles/globals.css" type="text/stylesheet" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="text-md">
      <nav className="m-8">
        <Link className="" href="/">
          DAOConnect
        </Link>{" "}
        | <Link href="/about">About</Link>
      </nav>
      <aside className="float-right mx-8 -mt-16">
        <ConnectButton />
      </aside>
    </header>
    <div className="md:m-10">{children}</div>
    {/* <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer> */}
  </div>
);

export default Layout;
