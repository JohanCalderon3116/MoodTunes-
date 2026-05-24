import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { darkTheme, lightTheme, themes } from '../styles/themes'

const getThemeByMode = (themeMode) => {
  return themeMode === 'light' ? lightTheme : darkTheme
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      themeMode: 'dark',
      theme: darkTheme,
      currentTheme: darkTheme,
      setThemeMode: (themeMode) => {
        const nextTheme = getThemeByMode(themeMode)

        set({
          themeMode,
          theme: nextTheme,
          currentTheme: nextTheme,
        })
      },
      toggleTheme: () => {
        get().setThemeMode(get().themeMode === 'dark' ? 'light' : 'dark')
      },
      isDarkMode: () => get().themeMode === 'dark',
      getTheme: () => themes[get().themeMode],
    }),
    {
      name: 'moodtunes-theme',
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
      merge: (persistedState, currentState) => {
        const themeMode = persistedState?.themeMode ?? currentState.themeMode
        const theme = getThemeByMode(themeMode)

        return {
          ...currentState,
          ...persistedState,
          theme,
          currentTheme: theme,
        }
      },
    },
  ),
)
