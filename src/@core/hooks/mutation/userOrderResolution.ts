import { useParams } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import axiosInstance from '@/@core/api/interceptor'
import { useEssentialDataStore } from '@/@core/stores'

interface ResolutionPayload {
  method: {
    action: string
    id: string
  }
}

// Custom hook for resolving order item resolution
const useOrderResolution = () => {
  const params = useParams()
  const { order_id: orderId } = params

  const { currentShopData } = useEssentialDataStore()

  const queryClient = useQueryClient()

  // Define the resolve order item return handler function
  const handleResolution = async ({ method }: ResolutionPayload): Promise<any> => {
    if (!orderId || !currentShopData.id) {
      throw new Error('Order ID or Store ID is empty')
    }

    const apiPayload = {
      resolution_method: method.action,
      items: [method.id]
    }

    const response = await axiosInstance.post(
      `ironcore/orders-api/v0/orders/${orderId}/resolve_order_item_return/?store_id=${currentShopData.id}`,
      apiPayload
    )

    return response.data
  }

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKey.getOrderDetails, orderId]
    })
    toast.success('Order item resolved successfully!')
  }

  const handleError = (error: any) => {
    toast.error('Error while resolving order item return, please try again!')
    console.error('Error resolving order item return', error)
  }

  const mutation = useMutation({
    mutationFn: handleResolution,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.orderResolution, orderId] // Adjust the query key as needed
  })

  return mutation
}

export default useOrderResolution
