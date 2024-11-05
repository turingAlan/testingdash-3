import { useEffect } from 'react'

import { useQueries } from '@tanstack/react-query'

import { queryKey } from '@/@core/querykey'
import { useEssentialDataStore } from '@/@core/stores'
import type { EssentialData } from '@/types/apps/stateStoreTypes'
import axiosInstance from '@/@core/api/interceptor'
import type { PaymentDetail, StoreDetails } from '@/types/apps/storeTypes'

const getAllStores = async (): Promise<StoreDetails[]> => {
  const res = await axiosInstance.get(`/ironcore/store-api/v0/storefront/`)

  return res.data
}

const getPaymentDetails = async (): Promise<PaymentDetail[]> => {
  const res = await axiosInstance.get(`/ironcore/users-api/v0/payment-detail/`)

  return res.data
}

const getCategoryMetaData = async () => {
  const res = await axiosInstance.get('/ironcore/product-api/v0/category/taxonomy')

  return res.data
}

const getOrganizationData = async (): Promise<any> => {
  const res = await axiosInstance.get('/ironcore/organisation/')

  return res.data
}

const getProfileData = async (): Promise<any> => {
  const res = await axiosInstance.get('/ironcore/users-api/v0/user/')

  return res.data
}

const useEssentialData = () => {
  const { setEssentialData } = useEssentialDataStore()

  const { currentShopData, allShops } = useEssentialDataStore()

  const handleDataSuccess = (data: EssentialData) => {
    setEssentialData(data)
  }

  const combinedQueries = useQueries({
    queries: [
      {
        queryKey: [queryKey.getProfileData],
        queryFn: getProfileData,
        staleTime: Infinity
      },
      {
        queryKey: [queryKey.getAllStore],
        queryFn: getAllStores,
        staleTime: Infinity
      },
      {
        queryKey: [queryKey.getPaymentDetails],
        queryFn: getPaymentDetails,
        staleTime: Infinity
      },
      {
        queryKey: [queryKey.getCategoryMetaData],
        queryFn: getCategoryMetaData,
        staleTime: Infinity
      },
      {
        queryKey: [queryKey.getOrganizationData],
        queryFn: getOrganizationData,
        staleTime: Infinity
      }
    ],
    combine: results => {
      const allCategories = results[3]?.data?.data
        ? Object.entries(results[3].data?.data as Record<string, { is_active?: boolean }>)
            .map(([key, value]: [string, { is_active?: boolean }]) => {
              if (value?.is_active) return key

              return ''
            })
            .filter(Boolean)
        : []

      const profileData = results[0]?.data?.[0]

      // If the currentShopData is not set, set it to the first shop data
      const shopData = results?.[1]?.data?.[0]

      return {
        data: {
          profileData: profileData,
          allShops: results[1]?.data ?? [],
          paymentDetails: results[2]?.data ?? [],
          categoryMetaData: results[3]?.data?.data,
          organizationData: results[4]?.data,
          allCategories: allCategories,
          currentShopData: shopData,
          variantData: null,
          variantDataId: null
        },
        isLoading: results.some(result => result.isLoading),
        isError: results.some(result => result.isError),
        error: {
          profileData: results[0]?.error,
          allShops: results[1]?.error,
          paymentDetails: results[2]?.error,
          categoryMetaData: results[3]?.error,
          organizationData: results[4]?.error
        }
      }
    }
  })

  // Set the essential data in the store
  useEffect(() => {
    if (combinedQueries.data && !combinedQueries.isLoading) {
      handleDataSuccess(combinedQueries.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinedQueries.isLoading, combinedQueries.isError, combinedQueries.data])

  return combinedQueries
}

export default useEssentialData
