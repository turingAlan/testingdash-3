import { useSearchParams } from 'next/navigation'

import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import type { LoginApiPayload, LoginPayload } from '@/types/apps/loginTypes'

// Custom hook for login mutation
const useLogin = () => {
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get('redirectTo')
    ? decodeURIComponent(searchParams.get('redirectTo') as string)
    : null

  // Define the login handler function
  const handleLogin = async (loginDetails: LoginPayload): Promise<any> => {
    const { accessToken, method, ...restDetails } = loginDetails

    const apiPayload: LoginApiPayload = {
      ...restDetails,
      method
    }

    if (method === 'google_login' && accessToken) {
      apiPayload['access_token'] = accessToken
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/ironcore/users-api/v0/user/login/`,
      apiPayload
    )

    return response.data
  }

  //
  const handleSuccess = (userData: any) => {
    if (!userData?.data?.access_token) {
      toast.error('Error while logging in please try again')

      return
    }

    if (!redirectTo) {
      toast.error('Error parsing url please try again')

      return
    }

    const seperator = redirectTo.includes('?') ? '&' : '?'

    const redirectToUrl = redirectTo + `${seperator}accessToken=${userData.data.access_token}`

    window.location.replace(redirectToUrl)
  }

  const handleError = (error: any) => {
    toast.error('Error while logging in please try again')
    console.error('login error', error)
  }

  // Use useMutation and pass handleLogin as the first argument
  const mutation = useMutation({
    mutationFn: handleLogin,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.login] // Options object goes as second argument
  })

  return mutation
}

export default useLogin
