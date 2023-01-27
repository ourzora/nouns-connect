import { ConnectButton as RKConnectButton } from '@rainbow-me/rainbowkit'
import { Avatar } from './Avatar'
import { motion } from 'framer-motion'

export default function ConnectButton({ ...props }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ease: "easeInOut"}}
      className="connect-button-wrapper relative flex items-center overflow-hidden rounded-full text-lg text-white bg-gray-800 px-6 h-11"
      {...props}>
      <RKConnectButton.Custom>
        {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
          return (
            <>
              {(() => {
                if (!mounted || !account || !chain) {
                  return (
                    <button onClick={openConnectModal} className="pl-2.5">
                      Connect Wallet
                    </button>
                  )
                }
                if (chain.unsupported) {
                  return (
                    <div className="text-red-400">&#x26A0; Wrong Network</div>
                  )
                }
                return (
                  <button onClick={openAccountModal}>
                    <div className="flex items-center gap-3 text-white">
                      <Avatar />
                      {account.displayName}
                    </div>
                  </button>
                )
              })()}
            </>
          )
        }}
      </RKConnectButton.Custom>
    </motion.div>
  )
}
