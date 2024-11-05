import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import type { ProfileApiPayload, ProfilePayload } from '@/types/apps/profileTypes'
import axiosInstance from '@/@core/api/interceptor'

// Custom hook for profile mutation
const useProfile = (userId: string) => {
  const queryClient = useQueryClient()

  // Define the profile handler function
  const handleProfile = async (profileDetails: ProfilePayload): Promise<any> => {
    const { firstName, lastName } = profileDetails

    const apiPayload: ProfileApiPayload = {
      first_name: firstName,
      last_name: lastName
    }

    const response = await axiosInstance.patch(`/ironcore/users-api/v0/user/${userId}/`, apiPayload)

    return response.data
  }

  const handleSuccess = () => {
    // Invalidate the profile data query for refetching the updated profile data
    queryClient.invalidateQueries({ queryKey: [queryKey.getProfileData] })
    toast.success('Profile updated successfully')
  }

  const handleError = (error: any) => {
    toast.error('Error while updating profile')
    console.error('error profile change', error)
  }

  // Use useMutation and pass handleLogin as the first argument
  const mutation = useMutation({
    mutationFn: handleProfile,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.profile] // Options object goes as second argument
  })

  return mutation
}

export default useProfile
