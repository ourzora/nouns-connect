import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

const ConnectButton = dynamic(() => import("./ConnectButton"), {
  ssr: false,
});
const Logo = dynamic(() => import("./Logo"), {
  ssr: false,
});

export default function Header() {
  return (
    <header
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 75%, rgba(255,255,255,0) 100%)",
      }}
      className="font-pt top-0 leading-6 fixed w-screen flex justify-between items-center px-8 h-header z-20"
    >
      <nav className="text-xl font-bold flex align-center">
        <AnimatePresence>
          <Logo />
        </AnimatePresence>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="hover:underline hidden md:block"
        >
          <Link className="text-gray-400 ml-4 text-md" href="/faq">
            FAQ
          </Link>
        </motion.span>
        <Link
          className="text-gray-400 ml-2 text-md block hover:underline md:hidden"
          href="/faq"
        >
          ?
        </Link>
      </nav>
      <ConnectButton />
    </header>
  );
}
