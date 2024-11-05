import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import { useEssentialDataStore } from '@/@core/stores'
import axiosInstance from '@/@core/api/interceptor'

// Custom hook for handle order return mutation
const useOrderReturn = (orderId: string) => {
  const { currentShopData } = useEssentialDataStore()

  const queryClient = useQueryClient()

  // Define the update order handler function
  const handleUpdateOrderReturn = async ({
    action,
    fulfillmentId
  }: {
    action: 'GenerateRefund' | 'AcceptReturn'
    fulfillmentId: string
  }): Promise<any> => {
    if (!orderId || !fulfillmentId) {
      throw new Error('Order data is empty')
    }

    const apiPayload = {
      fulfillment_id: fulfillmentId,
      action: action
    }

    const response = await axiosInstance.post(`/ironcore/orders-api/v0/orders/${fulfillmentId}/return/`, apiPayload)

    return response.data
  }

  const handleSuccess = () => {
    // Invalidate the order details query
    queryClient.invalidateQueries({
      queryKey: [queryKey.getOrderDetails, orderId]
    })

    // Invalidate the orders query
    queryClient.invalidateQueries({
      queryKey: [queryKey.getOrders, currentShopData.id]
    })
    toast.success('return updated!')
  }

  const handleError = (error: any) => {
    toast.error('Error while updating please try again!')
    console.error('login error', error)
  }

  const mutation = useMutation({
    mutationFn: handleUpdateOrderReturn,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.updateOrder, orderId] // Options object goes as second argument
  })

  return mutation
}

export default useOrderReturn
