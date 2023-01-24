import React from 'react'
import { AnimatePresence } from "framer-motion"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";

const Logo = dynamic(() => import('./Logo'), {
  ssr: false,
})

export default function Header() {
  return (
    <header className="font-pt leading-6 fixed w-screen flex justify-between items-center px-8 h-header z-20">
      <nav className="text-xl font-bold flex align-center">
        <AnimatePresence>
          <Logo />
        </AnimatePresence>
        {/* | <Link href="/about">About</Link> */}
      </nav>
      <ConnectButton />
    </header>
  )
}
