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

  const callAggregate = useCallback(
    async (contract, transactions) => {
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

        const result = await contract.callStatic.aggregate3Value(
          txns,

          {
            from: daoTreasuryAddress,
            value: totalValue,
          }
        );

        console.log({ result });

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
          setGasEstimate(
            BigNumber.from(gasEstimate)
              .mul(feeData.maxFeePerGas)
              .mul(BigNumber.from("125").div("100"))
          );
        }
      }
    },
    [setGasEstimate]
  );

  useEffect(() => {
    callAggregate(contract, transactions);
  }, [transactions, contract]);

  if (gasEstimate) {
    return <div>Estimated proposal execution gas: {formatEther(gasEstimate)}</div>;
  }

  return <div>Simulating...</div>;
};
