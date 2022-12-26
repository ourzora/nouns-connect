import create from "zustand";
import { combine } from "zustand/middleware";

export const useDescription = create(
  combine({ description: "", editing: true }, (set) => ({
    update: (description: string) =>
      set((state) => ({ ...state, description })),
    edit: () => set((state) => ({ ...state, editing: true })),
    save: () => set((state) => ({ ...state, editing: false })),
  }))
);
