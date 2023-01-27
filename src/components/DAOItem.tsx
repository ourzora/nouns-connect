import Link from "next/link";
import { motion } from "framer-motion";

export const DAOItem = ({
  address,
  name,
  cover,
  holdings,
}: {
  address: string;
  name: string;
  cover?: string;
  holdings?: number;
}) => (
  <Link className="" href={`/daos/${address}`}>
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={{ease: "easeInOut"}}
      className="cursor-pointer w-full border rounded-lg shadow-sm hover:shadow-md relative"
      style={{borderColor: 'rgba(232, 232, 232, 1)'}}
      key={address}
    >
      <div className="w-full flex h-60 overflow-hidden aspect-square relative rounded-lg">
        <img src={cover} alt="" className="w-full h-full object-cover absolute " />
      </div>
      <div className="p-6 inline-block">
        <span className="block text-2xl">{name}</span>
        <span
          className="block text-sm font-pt font-normal mt-2"
          style={{ color: "#808080" }}
        >
          You have {holdings.toString()} votes
        </span>
      </div>
    </motion.div>
  </Link>
);
