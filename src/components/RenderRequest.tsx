import { BigNumber, ethers } from "ethers";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { Transaction, useTransactionsStore } from "../stores/interactions";
import { CHAIN_ID } from "../utils/constants";
import { RequestDataDecoder } from "./RequestDataDecoder";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { PrettyAddress } from "./PrettyAddress";
import { DefinitionListItem } from "./DefinitionListItem";
import { ContractDataItems } from "./ContractDataItems";
import { XIcon } from "./XIcon";

export const RenderRequest = ({
  indx,
  transaction,
}: {
  transaction: Transaction;
  indx: number;
}) => {
  const { removeTransactionAtIndex } = useTransactionsStore();
  const removeTxnClick = useCallback(() => {
    removeTransactionAtIndex(indx);
    toast("Transaction removed from queue");
  }, [indx]);

  const { data: contractData, error: contractError } = useSWR(
    `https://${CHAIN_ID === 5 ? "goerli." : ""}ether.actor/${
      transaction.data.to
    }.json`,
    fetcher
  );

  const { data: decodeData, error: decodeError } = useSWR(
    contractError || contractData?.guessFromInterface
      ? `https://${CHAIN_ID === 5 ? "goerli." : ""}ether.actor/decode/${
          transaction.data.to
        }/${transaction.data.calldata}`
      : undefined,
    fetcher
  );

  const parsedResponse = useMemo(() => {
    if (!contractData?.abi) {
      return undefined;
    }
    try {
      const iface = new ethers.utils.Interface(contractData.abi);
      return iface.parseTransaction({
        data: transaction.data.calldata,
        value: transaction.data.value,
      });
    } catch {
      return undefined;
    }
  }, [contractData?.abi]);

  return (
    <div className="flex w-full">
      <div
        className="w-6 h-6 mr-4 bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(${transaction.wallet.icon})` }}
      />
      <div className="w-full">
        <div className="flex w-full">
          <div className="mb-4 flex-grow font-sm text-left text-lg">
            <span className="font-bold capitalize">
              {parsedResponse?.name || "Custom Data"}
            </span>{" "}
            on{" "}
            <span className="font-bold">
              <PrettyAddress
                address={transaction.data.to as any}
                prettyName={contractData?.info?.ContractName}
              />
            </span>
          </div>
          <div className="">
            <button
              className="text-right"
              onClick={() => removeTransactionAtIndex(indx)}
            >
              <XIcon />
            </button>
          </div>
        </div>
        <div>
          {parsedResponse && (
            <ContractDataItems
              args={parsedResponse?.args}
              functionFragmentInputs={parsedResponse?.functionFragment?.inputs}
            />
          )}
          <dl>
            <DefinitionListItem name="ETH Value">
              {BigNumber.from("0").eq(transaction.data.value)
                ? "No ETH value"
                : formatEther(transaction.data.value)}
            </DefinitionListItem>
          </dl>
        </div>
      </div>
    </div>
  );
};
