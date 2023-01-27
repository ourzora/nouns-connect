import { useEnsName } from "wagmi";
import { CHAIN_ID } from "../utils/constants";

export const PrettyAddress = ({
  address,
  prettyName,
}: {
  address: `0x${string}`;
  prettyName?: string;
}) => {
  const { data: ensName } = useEnsName({ address, enabled: !prettyName });

  return (
    <span title={address}>
      {prettyName ? prettyName : ensName ? ensName : address}{" "}
      <a
        title="View on etherscan"
        target="_blank"
        className="text-gray-600 hover:color-black transition-color"
        href={`https://${
          CHAIN_ID === 5 ? "goerli." : ""
        }etherscan.io/address/${address}`}
      >
        ↗
      </a>
    </span>
  );
};
