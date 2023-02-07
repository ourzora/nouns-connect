import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Transaction = {
  data: {
    id: number;
    gas: string;
    to: string;
    calldata: string;
    value: string;
  };
  wallet: {
    icon: string;
    name: string;
  };
  signature?: string;
};

interface TransactionsState {
  transactions: Transaction[];
  addTransactions: (transactions: Transaction[]) => void;
  setSignature: (index: number, signature: string) => void;
  removeTransactionAtIndex: (index: number) => void;
  clear: () => void;
}

export const useTransactionsStore = create<TransactionsState>()(
  devtools(
    persist(
      (set) => ({
        transactions: [],
        setSignature: (index: number, signature: string) =>
          set((state) => ({
            transactions: state.transactions.map((txn, indx) =>
              indx === index ? { ...txn, signature } : txn
            ),
          })),
        addTransactions: (transactions: Transaction[]) =>
          set((state) => ({
            transactions: [...state.transactions, ...transactions],
          })),
        clear: () => set(() => ({ transactions: [] })),
        removeTransactionAtIndex: (removeIndex: number) =>
          set((state) => ({
            transactions: state.transactions.filter(
              (_: Transaction, index: number) => index !== removeIndex
            ),
          })),
      }),
      {
        name: "transactions-storage-v2",
      }
    )
  )
);
