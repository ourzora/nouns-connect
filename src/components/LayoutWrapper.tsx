import React, { ReactNode } from "react";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router";

type Props = {
  children?: ReactNode;
  title?: string;
};

export default function Layout({ children, title = "DAOConnect" }: Props) {
  const { pathname } = useRouter()
  return (
    <>
      <Head>
        <title>{title}</title>
        <link href="/styles/globals.css" type="text/stylesheet" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AnimatePresence>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            delay: 0.25,
            opacity: {
              duration: 0.5
            }
          }}
          className="w-screen min-h-screen fixed top-0 z-10 flex items-center justify-center p-10 pb-20"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}