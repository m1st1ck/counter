import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import sqliteKvStore from "expo-sqlite/kv-store";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  counters: {
    name: string;
    count: string[];
  }[];
};

type Actions = {
  increment: (index: number) => void;
  decrement: (index: number) => void;
  addCounter: (name: string) => void;
  deleteCounter: (index: number) => void;
  renameCounter: (index: number, name: string) => void;
};

type Store = State & Actions;

export const useCountersStore = create<Store>()(
  persist(
    immer((set) => ({
      counters: [],
      count: [],
      increment: (index) =>
        set((state) => {
          state.counters.at(index)?.count.push(new Date().toISOString());
        }),
      decrement: (index) =>
        set((state) => {
          state.counters.at(index)?.count.pop();
        }),
      addCounter: (name) =>
        set((state) => {
          state.counters.push({ name, count: [] });
        }),
      deleteCounter: (index) =>
        set((state) => {
          state.counters.splice(index, 1);
        }),
      renameCounter: (index, name) =>
        set((state) => {
          if (state.counters.at(index)) {
            state.counters.at(index)!.name = name;
          }
        }),
    })),
    // Persistance options
    {
      name: "@COUNTERS",
      storage: createJSONStorage(() => sqliteKvStore),
      version: 1,
    }
  )
);
