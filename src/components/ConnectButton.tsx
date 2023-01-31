import {
  ConnectButton as RKConnectButton,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { Avatar } from "./Avatar";
import { motion } from "framer-motion";

const BUTTON_CLASSES = "px-6 h-11";

export default function ConnectButton({ ...props }) {
  const { openChainModal } = useChainModal();

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ ease: "easeInOut" }}
      className="connect-button-wrapper relative flex items-center overflow-hidden rounded-full text-md text-white bg-gray-800"
      {...props}
    >
      <RKConnectButton.Custom>
        {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
          return (
            <>
              {(() => {
                if (!mounted || !account || !chain) {
                  return (
                    <button
                      className={`${BUTTON_CLASSES}`}
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </button>
                  );
                }
                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      className={`text-red-400 ${BUTTON_CLASSES}`}
                    >
                      &#x26A0; Wrong Network
                    </button>
                  );
                }
                return (
                  <button
                    onClick={openAccountModal}
                    className={`${BUTTON_CLASSES}`}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <Avatar />
                      {account.displayName}
                    </div>
                  </button>
                );
              })()}
            </>
          );
        }}
      </RKConnectButton.Custom>
    </motion.div>
  );
}
