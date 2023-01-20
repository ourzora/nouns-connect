import { CHAIN_ID } from "../utils/constants";
import useSWR from "swr";

const fetcher = (url: URL) => fetch(url).then((res) => res.json());

export const RequestDataDecoder = ({
  calldata,
  to,
}: {
  calldata: string;
  to: string;
}) => {
  const { data } = useSWR(
    `https://${
      CHAIN_ID === 5 ? "goerli." : ""
    }ether.actor/decode/${to}/${calldata}`,
    fetcher
  );

  if (data?.decoded) {
    return (
      <span>
        <span>{data.functionName}</span>
        <span>(</span>
        {data.decoded.map((part, indx) => (
          <span>
            {part.toString()}
            {indx === data.decoded.length - 1 ? "" : ", "}
          </span>
        ))}
        <span>)</span>
      </span>
    );
  } else {
    return <span>...</span>;
  }
};
