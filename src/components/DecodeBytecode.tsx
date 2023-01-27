import { fetchJson } from "ethers/lib/utils.js";
import useSWR from "swr";
import { CHAIN_ID } from "../utils/constants";

export const DecodeBytecode = ({ value }: { value: string }) => {
  console.log({value})
  const { data: decoded } = useSWR(
    `https://${CHAIN_ID === 5 ? "goerli." : ""}ether.actor/decode/${value.toString()}`,
    fetchJson
  );

  console.log({ decoded });
  return <div>{value}</div>;
};
