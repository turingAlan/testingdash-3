'use client'

import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/pages/account-settings'

const AccountTab = dynamic(() => import('@views/pages/account-settings/account'))
const PrivacyPolicy = dynamic(() => import('@views/pages/account-settings/privacy-policy'))

const tabContentList = (): { [key: string]: ReactElement } => ({
  account: <AccountTab />,
  privacyPolicy: <PrivacyPolicy />
})

export default function Profile() {
  return (
    <>
      <AccountSettings tabContentList={tabContentList()} />
    </>
  )
}
