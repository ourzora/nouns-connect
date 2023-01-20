import create from "zustand";
import { combine } from "zustand/middleware";

export const useWCConnectionStore = create(
  combine({ connected: false, connectedTo: "", icon: "" }, (set) => ({
    connectTo: (name: string, icon: string) =>
      set(() => ({ connectedTo: name, connected: true, icon })),
    disconnect: () =>
      set(() => ({ connected: false, connectedTo: "", icon: "" })),
  }))
);
