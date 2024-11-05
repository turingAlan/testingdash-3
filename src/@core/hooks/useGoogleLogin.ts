import { useEffect, useState } from 'react'

import type { CodeResponse } from '@react-oauth/google'
import { useGoogleLogin } from '@react-oauth/google'

import useLogin from './mutation/useLogin'

const useGoogleLoginPopup = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { mutate: loginMutate, isError, isSuccess, isPending, error } = useLogin()

  const handleGoogleLoginSuccess = (data: any) => {
    const token = data?.access_token as string

    loginMutate({
      method: 'google_login',
      accessToken: token
    })
  }

  const handleError = (error: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    setIsProcessing(false)
    console.error('login error', error)
  }

  const handleSuccess = () => {
    setIsProcessing(false)
  }

  const processGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleError,
    ux_mode: 'popup'
  })

  const handleGoogleLogin = () => {
    setIsProcessing(true)
    processGoogleLogin()
  }

  useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        handleSuccess()
      } else if (isError) {
        handleError(error)
      }
    }
  }, [isPending, isSuccess, isError, error])

  return {
    handleGoogleLogin,
    isLoading: isPending || isProcessing
  }
}

export default useGoogleLoginPopup
