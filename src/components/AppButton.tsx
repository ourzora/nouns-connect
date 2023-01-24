import { motion } from "framer-motion";

export const AppButton = ({
  children,
  inverted = false,
  className,
  ...props
}: any) => {
  return (
    <motion.button
      {...props}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ease: "easeInOut"}}
      className={`h-11 flex items-center margin-auto px-5 justify-center text-lg ${
        inverted ? "text-black bg-white" : "bg-black text-white"
      } rounded-full font-pt font-bold ${className}`}
    >
      {children}
    </motion.button>
  );
};
