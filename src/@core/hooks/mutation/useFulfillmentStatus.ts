import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import { useEssentialDataStore } from '@/@core/stores'
import axiosInstance from '@/@core/api/interceptor'

// Custom hook for update fulfillment status mutation
const useFulfillmentStatus = (orderId: string) => {
  const { currentShopData } = useEssentialDataStore()

  const queryClient = useQueryClient()

  // Define the update order handler function
  const handleUpdateFulfillment = async ({
    status,
    fulfillmentId
  }: {
    status: string
    fulfillmentId: string
  }): Promise<any> => {
    if (!orderId || !fulfillmentId) {
      throw new Error('Data is invalid')
    }

    const apiPayload = {
      fulfillment_id: fulfillmentId,
      delivery_status: status
    }

    const response = await axiosInstance.post(
      `/ironcore/orders-api/v0/orders/${orderId}/self_fulfillment_status_change/`,
      apiPayload
    )

    return response.data
  }

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKey.getOrderDetails, orderId]
    })
    toast.success('order updated!')
  }

  const handleError = (error: any) => {
    toast.error('Error while updating please try again!')
    console.error('login error', error)
  }

  const mutation = useMutation({
    mutationFn: handleUpdateFulfillment,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.updateFulfillmentStatus, orderId] // Options object goes as second argument
  })

  return mutation
}

export default useFulfillmentStatus
