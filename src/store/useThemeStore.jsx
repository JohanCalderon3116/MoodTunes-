import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      themeMode: 'dark',
      setThemeMode: (themeMode) => {
        set({ themeMode })
      },
      toggleTheme: () => {
        set({ themeMode: get().themeMode === 'dark' ? 'light' : 'dark' })
      },
      isDarkMode: () => get().themeMode === 'dark',
    }),
    {
      name: 'moodtunes-theme',
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    },
  ),
)
