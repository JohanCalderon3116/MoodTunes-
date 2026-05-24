import { ThemeProvider } from 'styled-components'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import {
  AuthContextProvider,
  GlobalStyles,
  Myroutes,
  useThemeStore,
} from './index'

const App = () => {
  const activeTheme = useThemeStore((state) => state.currentTheme)

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
