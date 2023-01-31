import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useContract, useProvider } from "wagmi";
import multicallAbi from "../config/multicall-abi.json";
import { Transaction, useTransactionsStore } from "../stores/interactions";

const MULTICALL_CONTRACT = "0xcA11bde05977b3631167028862bE2a173976CA11";

export const ProposalSimulation = ({
  daoTreasuryAddress,
}: {
  daoTreasuryAddress: `0x${string}`;
}) => {
  const { transactions } = useTransactionsStore();
  const provider = useProvider();
  const contract = useContract({
    abi: multicallAbi,
    // Address same on multiple chains
    address: MULTICALL_CONTRACT,
    signerOrProvider: provider,
  });

  const [gasEstimate, setGasEstimate] = useState<any>();
  const [gasPrice, setGasPrice] = useState<any>();
  const [transactionError, setTransactionError] = useState<any>();

  const callAggregate = useCallback(
    async (contract, transactions) => {
      try {
        setTransactionError(undefined);
        if (contract && transactions?.length > 0) {
          const totalValue = transactions.reduce(
            (last: typeof BigNumber, txn: Transaction) =>
              BigNumber.from(last).add(BigNumber.from(txn.data.value)),
            BigNumber.from("0")
          );
          const txns = transactions.map((transaction: Transaction) => ({
            target: transaction.data.to,
            allowFailure: true,
            value: BigNumber.from(transaction.data.value).toString(),
            callData: transaction.data.calldata,
          }));

          const result = await contract.callStatic.aggregate3Value(txns, {
            from: daoTreasuryAddress,
            value: totalValue,
          });

          if (result.every((result) => result.success)) {
            const gasEstimate = await provider.estimateGas({
              to: MULTICALL_CONTRACT,
              from: daoTreasuryAddress,
              data: contract.interface.encodeFunctionData("aggregate3Value", [
                txns,
              ]),
              value: totalValue,
            });
            const feeData = await provider.getFeeData();
            console.log({
              estimate: gasEstimate.toString(),
              fee: feeData.maxFeePerGas.toString(),
              price: feeData.gasPrice.toString(),
            });
            setGasPrice(
              feeData.maxFeePerGas.div(BigNumber.from("10").pow(9)).toString()
            );
            setGasEstimate(
              BigNumber.from(gasEstimate)
                .mul(feeData.maxFeePerGas)
                .mul(BigNumber.from("125").div("100"))
            );
          }
        }
      } catch (error: any) {
        setTransactionError(error.toString().slice(0, 100));
      }
    },
    [setGasEstimate, setGasPrice, setTransactionError]
  );

  useEffect(() => {
    callAggregate(contract, transactions);
  }, [transactions, contract]);

  if (gasEstimate) {
    return (
      <div className="flex justify-between text-lg w-full">
        <div title="Estimated gas for proposal execution">
          Estimated proposal execution gas:
        </div>
        <div className="font-light">
          <span>{formatEther(gasEstimate).slice(0, 10)}</span>
          <span className="text-gray-800"> ETH at {gasPrice} GWEI</span>
        </div>
      </div>
    );
  }

  if (transactionError) {
    <div className="text-lg">
      Transaction simulation error: {transactionError}
    </div>;
  }

  return <div>Simulating...</div>;
};
