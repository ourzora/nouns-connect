import create from "zustand";
import { combine } from "zustand/middleware";

export const useDescription = create(
  combine(
    {
      description: "",
      title: "",
      editing: true,
    },
    (set) => ({
      updateDescription: (description: string) =>
        set((state) => ({ ...state, description })),
      updateTitle: (title: string) => set((state) => ({ ...state, title })),
      edit: () => set((state) => ({ ...state, editing: true })),
      save: () => set((state) => ({ ...state, editing: false })),
    })
  )
);
