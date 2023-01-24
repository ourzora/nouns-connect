import { BigNumber, ethers } from "ethers";
import { useCallback, useMemo } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { formatEther } from "ethers/lib/utils.js";

import { Transaction, useTransactionsStore } from "../stores/interactions";
import { CHAIN_ID } from "../utils/constants";
import { fetcher, textFetcher } from "../utils/fetcher";
import { PrettyAddress } from "./PrettyAddress";
import { DefinitionListItem } from "./DefinitionListItem";
import { ContractDataItems } from "./ContractDataItems";
import { XIcon } from "./XIcon";
import { AppButton } from "./AppButton";

export const RenderRequest = ({
  indx,
  transaction,
  defaultCollapsed = false,
}: {
  transaction: Transaction;
  defaultCollapsed?: boolean;
  indx: number;
}) => {
  const { removeTransactionAtIndex } = useTransactionsStore();
  const removeTxnClick = useCallback(() => {
    if (confirm("Are you sure you wish to remove this transaction?")) {
      removeTransactionAtIndex(indx);
      toast("Transaction removed from queue");
    }
  }, [indx]);

  const { data: contractData, error: contractError } = useSWR(
    `https://${CHAIN_ID === 5 ? "goerli." : ""}ether.actor/${
      transaction.data.to
    }.json`,
    fetcher
  );

  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const { data: decodeData, error: decodeError } = useSWR(
    contractError || contractData?.guessFromInterface
      ? `https://${CHAIN_ID === 5 ? "goerli." : ""}ether.actor/decode/${
          transaction.data.to
        }/${transaction.data.calldata}`
      : undefined,
    fetcher
  );

  const { data: contractName } = useSWR(
    !contractError
      ? `https://${CHAIN_ID === 5 ? "goerli." : ""}ether.actor/${
          transaction.data.to
        }/name`
      : undefined,
    textFetcher
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
          <div className="flex-grow font-sm text-left text-lg">
            <span className="font-bold capitalize">
              {parsedResponse?.name || "Custom Data"}
            </span>{" "}
            on{" "}
            <span className="font-bold">
              <PrettyAddress
                address={transaction.data.to as any}
                prettyName={contractName || contractData?.info?.ContractName}
              />
              {!BigNumber.from("0").eq(transaction.data.value) ? (
                <span className="font-normal">
                  {" "}
                  for{" "}
                  <span className="font-bold">
                    {formatEther(transaction.data.value)}
                  </span>{" "}
                  ETH
                </span>
              ) : undefined}
            </span>
          </div>
          <div className="">
            {collapsed ? (
              <button
                className="text-right"
                onClick={() => setCollapsed(false)}
              >
                …
              </button>
            ) : (
              !defaultCollapsed && (
                <button className="text-right" onClick={removeTxnClick}>
                  <XIcon />
                </button>
              )
            )}
          </div>
        </div>
        {!collapsed && (
          <div className="mt-4">
            {parsedResponse && (
              <ContractDataItems
                args={parsedResponse?.args}
                functionFragmentInputs={
                  parsedResponse?.functionFragment?.inputs
                }
              />
            )}
            <dl>
              <DefinitionListItem name="ETH Value">
                {BigNumber.from("0").eq(transaction.data.value)
                  ? "No ETH value"
                  : formatEther(transaction.data.value)}
              </DefinitionListItem>
            </dl>
            {defaultCollapsed && (
              <div className="mt-4">
                <AppButton inverted onClick={removeTxnClick}>
                  Remove Transaction
                </AppButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
