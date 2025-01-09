import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  count: string[];
};

type Actions = {
  increment: () => void;
  decrement: () => void;
};

type Store = State & Actions;

export const useCountStore = create<Store>()(
  persist(
    immer((set) => ({
      count: [],
      increment: () =>
        set((state) => {
          state.count.push(new Date().toISOString());
        }),
      decrement: () =>
        set((state) => {
          state.count.pop();
        }),
    })),
    // Persistance options
    {
      name: "@STORE",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
