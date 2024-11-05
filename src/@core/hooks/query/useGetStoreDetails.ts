import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import axiosInstance from '@/@core/api/interceptor'
import type { StoreDetails } from '@/types/apps/storeTypes'
import { useEssentialDataStore } from '@/@core/stores'

// Custom hook for getstore query
const useGetStoreDetails = (storeId: string) => {
  const { allShops, setAllShops } = useEssentialDataStore()

  const handleGetStore = async (): Promise<any> => {
    const response = await axiosInstance.get(`/ironcore/store-api/v0/storefront/${storeId}/`)

    return response.data
  }

  // Use useMutation and pass storeId as the first argument
  const getStoreDetails = useQuery({
    queryFn: handleGetStore,
    enabled: !!storeId,
    queryKey: [queryKey.getStoreDetails, storeId],
    staleTime: 12000 // 2 minute invalidation time
  })

  // Update the allShops store with the updated store details from the api
  const handleSetStoreDetails = async (storeDetails: StoreDetails) => {
    if (allShops?.length && storeDetails) {
      const allShopsCopy = [...allShops]
      const shopIndex = allShopsCopy.findIndex(shop => shop.id === storeDetails.id)

      if (shopIndex) {
        allShopsCopy[shopIndex] = storeDetails
        setAllShops(allShopsCopy)
      }
    }
  }

  // Handle the success, error
  useEffect(() => {
    if (getStoreDetails.isError) {
      toast.error('Error while fetching store details')
    } else if (getStoreDetails.isSuccess) {
      handleSetStoreDetails(getStoreDetails.data)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStoreDetails.isError, getStoreDetails.isPending, getStoreDetails.isSuccess])

  return getStoreDetails
}

export default useGetStoreDetails
