import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DAOInfo {
  dao: any;
  setDao: (dao: any) => void;
  clear: () => void;
}

export const useDAOStore = create<DAOInfo>()(
  devtools(
    persist(
      (set) => ({
        dao: undefined,
        setDao: (dao: any) =>
          set(() => ({
            dao,
          })),
        clear: () => set(() => ({ dao: undefined })),
      }),
      {
        name: "dao-storage-v2",
      }
    )
  )
);
