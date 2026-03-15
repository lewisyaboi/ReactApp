// assets/unitStore.ts   (or wherever you keep your Zustand stores)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UnitsState = {
  isMetric: boolean;          // true = kg (metric), false = lbs (imperial)
  setIsMetric: (value: boolean) => void;
  toggleUnit: () => void;
};

export const useUnitsStore = create<UnitsState>()(
  persist(
    (set) => ({
      isMetric: true,           // ← kg is the default for the whole app
      setIsMetric: (value) => set({ isMetric: value }),
      toggleUnit: () => set((state) => ({ isMetric: !state.isMetric })),
    }),
    {
      name: 'units-preference-storage',   // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);