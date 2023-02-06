import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { formatEther } from "ethers/lib/utils.js";

import { Transaction, useTransactionsStore } from "../stores/interactions";
import { CHAIN_ID } from "../utils/constants";
import {
  fetcher,
  textFetcher,
} from "../utils/fetcher";
import { PrettyAddress } from "./PrettyAddress";
import { DefinitionListItem } from "./DefinitionListItem";
import { ContractDataItems } from "./ContractDataItems";
import { XIcon } from "./XIcon";
import { AppButton } from "./AppButton";

export const RenderRequest = ({
  indx,
  transaction,
  defaultCollapsed = false,
  floatingDisplay = true,
  showDeleteButtonInline = true,
}: {
  transaction: Transaction;
  defaultCollapsed?: boolean;
  indx: number;
  floatingDisplay?: boolean;
  showDeleteButtonInline?: boolean;
}) => {
  const { removeTransactionAtIndex, setSignature } = useTransactionsStore();
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

  const { data: contractName} = useSWR(
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

      const txn = iface.parseTransaction({
        data: transaction.data.calldata,
        value: transaction.data.value,
      });

      setSignature(indx, txn.signature);

      return txn;
    } catch {
      return undefined;
    }
  }, [contractData?.abi, setSignature]);

  useEffect(() => {
    if (decodeData?.name) {
      setSignature(indx, decodeData.name);
    }
  }, [decodeData, setSignature]);

  return (
    <div className="flex w-full">
      {transaction.wallet?.icon && (
        <div
          className="w-6 h-6 mr-4 bg-contain shrink-0 bg-no-repeat"
          style={{ backgroundImage: `url(${transaction.wallet.icon})` }}
        />
      )}
      <div style={{ width: !floatingDisplay ? "100%" : "calc(100% - 40px)" }}>
        <div className="flex w-full">
          <div className="flex-grow font-sm text-left text-lg">
            <span className="font-bold capitalize">
              {parsedResponse?.name ||
                (transaction.data.calldata === "0x"
                  ? "transfer"
                  : "Custom Data")}
            </span>{" "}
            {BigNumber.from("0").eq(transaction.data.value) ? "on" : "to"}{" "}
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
            {defaultCollapsed ? (
              <button
                className="text-right"
                onClick={() => setCollapsed(!collapsed)}
              >
                …
              </button>
            ) : (
              <button className="text-right" onClick={removeTxnClick}>
                <XIcon />
              </button>
            )}
          </div>
        </div>
        {!collapsed && (
          <div className="mt-4">
            {parsedResponse ? (
              <ContractDataItems
                args={parsedResponse?.args}
                functionFragmentInputs={
                  parsedResponse?.functionFragment?.inputs
                }
              />
            ) : decodeData ? (
              <>{JSON.stringify(decodeData, null, 2)}</>
            ) : (
              <DefinitionListItem
                name="Bytecode data"
                title="Raw data being sent in the transaction"
              >
                <div className="border-gray-200 border-2 font-mono p-2 rounded-lg">
                  {transaction.data.calldata}
                </div>
              </DefinitionListItem>
            )}
            <dl>
              <DefinitionListItem name="ETH Value">
                {BigNumber.from("0").eq(transaction.data.value)
                  ? "No ETH value"
                  : formatEther(transaction.data.value)}
              </DefinitionListItem>
            </dl>
            {defaultCollapsed && showDeleteButtonInline && (
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
