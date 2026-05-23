import { ThemeProvider } from 'styled-components'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import {
  AuthContextProvider,
  GlobalStyles,
  Myroutes,
  darkTheme,
  lightTheme,
  useThemeStore,
} from './index'

const App = () => {
  const themeMode = useThemeStore((state) => state.themeMode)
  const activeTheme = themeMode === 'light' ? lightTheme : darkTheme

  return (
    <ThemeProvider theme={activeTheme}>
      <AuthContextProvider>
        <GlobalStyles />
        <Myroutes />
        <Toaster richColors position="top-right" />
      </AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  )
}

export default App
