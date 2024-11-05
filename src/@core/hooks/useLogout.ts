import { useParams, useRouter } from 'next/navigation' // or 'react-router-dom' based on your routing library

import { useQueryClient } from '@tanstack/react-query'

import Cookies from 'js-cookie'

import { toast } from 'react-toastify'

import { useEssentialDataStore } from '../stores'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'

const useLogout = () => {
  const queryClient = useQueryClient()
  const params = useParams()
  const router = useRouter()

  const { resetEssentialData } = useEssentialDataStore()
  const { lang: locale } = params

  const logout = () => {
    // Invalidate all queries
    queryClient.clear() // Clear all cached data
    queryClient.invalidateQueries() // Optional, use if you want to mark them as stale

    // Reset Zustand store to initial state
    resetEssentialData()

    // Navigate to login page
    router.push(getLocalizedUrl('/login', locale as Locale)) // Adjust the route as necessary

    Cookies.remove('accessToken') // Remove the access token from cookies
    toast.success('Logged out successfully')
  }

  return { logout }
}

export default useLogout
