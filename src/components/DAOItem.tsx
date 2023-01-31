import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";

export const DAOItem = ({
  address,
  name,
  cover,
  quorum,
  yourVotes,
  holdings,
}: {
  address: string;
  name: string;
  cover?: string;
  quorum?: number;
  yourVotes?: number;
  holdings?: number;
}) => {
  const [votesType, amount, isSingular] = useMemo(() => {
    if (!quorum || !yourVotes) {
      return [undefined, 0, 0];
    }
    if (quorum >= yourVotes) {
      return ["You have", yourVotes, yourVotes === 1];
    }
    return ["You need", yourVotes - quorum, yourVotes - quorum === 1];
  }, [yourVotes, quorum]);
  return (
    <Link className={votesType === 'You need' ? 'opacity-60' : ''} href={`/daos/${address}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        transition={{ ease: "easeInOut" }}
        className="cursor-pointer w-full border rounded-lg shadow-sm hover:shadow-md relative"
        style={{ borderColor: "rgba(232, 232, 232, 1)" }}
        key={address}
      >
        <div className="w-full flex h-60 overflow-hidden aspect-square relative rounded-lg">
          <img
            src={cover}
            alt=""
            className="w-full h-full object-cover absolute "
          />
        </div>
        <div className="p-6 inline-block">
          <span className="block text-2xl">{name}</span>
          <span
            className="block text-sm font-pt font-normal mt-2"
            style={{ color: "#808080" }}
          >
            {votesType ? (
              <>
                {votesType} {amount} vote{isSingular ? "" : "s"}.
              </>
            ) : holdings === 0 ? (
              <>Loading...</>
            ) : (
              <>You have {holdings.toString()} NFTs</>
            )}
          </span>
        </div>
      </motion.div>
    </Link>
  );
};
