'use client'

import type { ReactNode } from 'react'

import { GoogleOAuthProvider } from '@react-oauth/google'

type Props = {
  children: ReactNode
  clientId: string
}

export const GoogleAuthProvider = ({ children, clientId, ...rest }: Props) => {
  return (
    <GoogleOAuthProvider clientId={clientId} {...rest}>
      {children}
    </GoogleOAuthProvider>
  )
}
