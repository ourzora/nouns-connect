import { CHAIN_ID } from "../utils/constants";
import useSWR from "swr";

export const RequestDataDecoder = ({
  calldata,
  to,
}: {
  calldata: string;
  to: string;
}) => {
  
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
