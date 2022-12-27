import { BigNumber, ethers } from "ethers";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { Transaction, useTransactionsStore } from "../stores/interactions";
import { CHAIN_ID } from "../utils/constants";
import { RequestDataDecoder } from "./RequestDataDecoder";

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

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 flex">
        <div className="flex-grow">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Transaction #{indx + 1} Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Proposal Transaction Information
          </p>
        </div>
        <div className="flex-1">
          <button className="p-2 text-m border-none" onClick={removeTxnClick}>
            Remove
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Value</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {ethers.utils.formatEther(BigNumber.from(transaction.value))}{" "}
              ether
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Recipient</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {transaction.to}{" "}
              <a
                title="View on Etherscan"
                target="_blank"
                href={`https://${
                  CHAIN_ID === 5 ? "goerli." : ""
                }etherscan.io/address/${transaction.to}`}
              >
                ↗
              </a>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Data</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <RequestDataDecoder
                to={transaction.to}
                calldata={transaction.calldata}
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
