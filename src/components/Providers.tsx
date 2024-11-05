// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Styled Component Imports
import AppReactToastify from '@/libs/styles/AppReactToastify'

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import QueryProvider from '@core/providers/queryProvider'
import { GoogleAuthProvider } from '@core/providers/googleauthProvider'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const demoName = getDemoName()
  const systemMode = getSystemMode()

  return (
    <QueryProvider>
      <GoogleAuthProvider clientId={process.env.GOOGLE_CLIENT_ID as string}>
        <VerticalNavProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              {children}
              <AppReactToastify position={themeConfig.toastPosition} hideProgressBar />
            </ThemeProvider>
          </SettingsProvider>
        </VerticalNavProvider>
      </GoogleAuthProvider>
    </QueryProvider>
  )
}

export default Providers
