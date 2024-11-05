'use client'

// Type Imports
import type { ReactElement } from 'react'

// React Imports
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import type { SystemMode } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useLayoutInit from '@core/hooks/useLayoutInit'

import useEssentialData from '@core/hooks/query/useEssentialData'

type LayoutWrapperProps = {
  systemMode: SystemMode
  verticalLayout: ReactElement
}

const LayoutWrapper = (props: LayoutWrapperProps) => {
  // Props
  const { systemMode, verticalLayout } = props

  // Hooks
  const { settings } = useSettings()

  useLayoutInit(systemMode)

  const router = useRouter()

  const { isError, isLoading } = useEssentialData()

  // Delete the access token when on login
  useEffect(() => {
    const url = new URL(window.location.href)

    url.searchParams.delete('accessToken')
    router.replace(url.toString(), undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Return the layout based on the layout context
  return (
    <div className='flex flex-col flex-auto' data-skin={settings.skin}>
      {isLoading || isError ? (
        <div className='flex flex-col flex-auto items-center justify-center'>
          <div className='loader' />
        </div>
      ) : (
        verticalLayout
      )}
    </div>
  )
}

export default LayoutWrapper
