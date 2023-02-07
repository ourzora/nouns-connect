import create from "zustand";
import { combine } from "zustand/middleware";
import { useDescription } from "./description";

export const useSubmitDescription = create(
  combine(
    {
      description: "",
      title: "",
    },
    (set) => ({
      updateSubmit: () => {
        const { description, title } = useDescription.getState();
        return set((state) => ({ ...state, title, description }));
      },
    })
  )
);
