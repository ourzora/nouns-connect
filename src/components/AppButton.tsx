import { motion } from "framer-motion";

export const AppButton = ({
  children,
  inverted = false,
  className,
  ...props
}: any) => {
  const TagName = "href" in props ? motion.a : motion.button;
  return (
    <TagName
      {...props}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ ease: "easeInOut" }}
      className={`py-3 px-4 ${
        inverted
          ? "hover:bg-gray-100 bg-white"
          : "bg-gray-900 hover:bg-gray-700 text-white"
      } rounded font-pt transition-colors text-md font-bold ${
        props.disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {children}
    </TagName>
  );
};
