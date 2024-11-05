import { useParams, useRouter } from 'next/navigation'

import axios from 'axios'

import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import type { RegisterPayload } from '@/types/apps/loginTypes'

import { queryKey } from '@/@core/querykey'

import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'

// Custom hook for register mutation
const useRegister = () => {
  const { lang: locale } = useParams()
  const router = useRouter()

  // Define the register handler function
  const handleRegister = async (registerDetails: RegisterPayload): Promise<any> => {
    const { firstName, lastName, confirmPassword, ...restDetails } = registerDetails

    const apiPayload = {
      first_name: firstName,
      last_name: lastName,
      ...restDetails
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/ironcore/users-api/v0/user/register/`,
      apiPayload
    )

    return response.data
  }

  const handleSuccess = (userData: any) => {
    toast.info('Signin to continue!')
    console.log(userData, 'user data')
    router.push(getLocalizedUrl('/register', locale as Locale))
  }

  const handleError = (error: any) => {
    toast.error('Error while regisetring please try again')
    console.error('register error', error)
  }

  // Use useMutation and pass handleRegister as the first argument
  const mutation = useMutation({
    mutationFn: handleRegister,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.register] // Options object goes as second argument
  })

  return mutation
}

export default useRegister
