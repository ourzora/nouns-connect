import { useCallback, useState, useEffect } from "react";
import { CHAIN_ID } from "../utils/constants";

export const RequestDataDecoder = ({
  calldata,
  to,
}: {
  calldata: string;
  to: string;
}) => {
  const [response, setResponse] = useState<any>(undefined);
  const fetchData = useCallback(
    async (calldata: string, to: string) => {
      const result = await fetch(
        `https://${
          CHAIN_ID === 5 ? "goerli." : ""
        }ether.actor/decode/${calldata}`
      );
      if (result.ok) {
        const json = await result.json();
        setResponse(json);
      }
    },
    [setResponse]
  );
  useEffect(() => {
    fetchData(calldata, to);
  }, [calldata, to]);

  if (response) {
    return (
      <span>
        <span>
          {response.functionName}
        </span>
        <span>(</span>
        {response.decoded.map((part, indx) => (
          <span>
            {part.toString()}
            {indx === response.decoded.length - 1 ? "" : ", "}
          </span>
        ))}
        <span>)</span>
      </span>
    );
  } else {
    return <span>...</span>;
  }
};
