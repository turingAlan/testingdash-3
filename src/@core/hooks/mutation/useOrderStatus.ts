import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import { useEssentialDataStore } from '@/@core/stores'
import axiosInstance from '@/@core/api/interceptor'

// Custom hook for update order query
const useOrderStatus = () => {
  // States
  const [queryOrderId, setQueryOrderId] = useState<string>('')

  const { currentShopData } = useEssentialDataStore()

  const queryClient = useQueryClient()

  // Define the update order handler function
  const handleUpdateOrder = async ({ status, id: orderId }: { status: string; id: string }): Promise<any> => {
    if (!orderId) {
      throw new Error('Order Id is empty')
    }

    setQueryOrderId(orderId)

    const apiPayload = {
      order_status: status
    }

    const response = await axiosInstance.patch(
      `/ironcore/orders-api/v0/orders/${orderId}/?store_id=${currentShopData.id}`,
      apiPayload
    )

    return response.data
  }

  const handleSuccess = () => {
    // Invalidate the order details query
    queryClient.invalidateQueries({
      queryKey: [queryKey.getOrderDetails, queryOrderId]
    })

    // Invalidate the orders query
    queryClient.invalidateQueries({
      queryKey: [queryKey.getOrders, currentShopData.id]
    })
    toast.success('order updated!')
  }

  const handleError = (error: any) => {
    toast.error('Error while updating please try again!')
    console.error('login error', error)
  }

  const mutation = useMutation({
    mutationFn: handleUpdateOrder,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.updateOrder, queryOrderId] // Options object goes as second argument
  })

  return mutation
}

export default useOrderStatus
