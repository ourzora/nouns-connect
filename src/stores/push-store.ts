import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface PushNotificationInterface {
  permissionGranted?: string;
  setPermissionGranted: (granted: string) => void;
}

export const usePushStore = create<PushNotificationInterface>()(
  devtools(
    persist(
      (set) => ({
        permissionGranted: undefined,
        setPermissionGranted: (permissionGranted: string) =>
          set((state) => ({ ...state, permissionGranted })),
      }),
      {
        name: "push-permission-store-v2",
      }
    )
  )
);
