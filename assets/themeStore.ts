// assets/themeStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 0 | 1 | 2;

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 0, // default fallback if nothing is saved yet
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-theme-storage',           // unique key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Optional: only persist the theme number (cleaner)
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);