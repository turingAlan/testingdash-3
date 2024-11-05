import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import axiosInstance from '@/@core/api/interceptor'

interface OrderCancelPayload {
  reasonId: string
  orderItems: any[]
  type: 'order' | 'item'
  orderItem?: any
  maxQuantity?: number
}

// Custom hook for update order query
const useOrderCancel = (orderId: string) => {
  const queryClient = useQueryClient()

  // Define the update order handler function
  const handleUpdateOrder = async ({
    reasonId,
    orderItems,
    type,
    orderItem,
    maxQuantity
  }: OrderCancelPayload): Promise<any> => {
    if (!orderId) {
      throw new Error('Order Id is empty')
    }

    let apiPayload = {
      reason_id: reasonId,
      job: 'order_cancel',
      items: orderItems
    }

    if (type === 'item') {
      apiPayload = {
        ...apiPayload,
        job:
          orderItems.length === 1 && orderItem.quantity === maxQuantity ? 'order_cancel' : 'partial_order_item_cancel',
        items: [orderItem]
      }
    }

    const response = await axiosInstance.post(`/ironcore/orders-api/v0/orders/${orderId}/cancel/`, apiPayload)

    return response.data
  }

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKey.getOrderDetails, orderId]
    })
    toast.success('order cancelled!')
  }

  const handleError = (error: any) => {
    toast.error('Error while updating please try again!')
    console.error('error updating orrder', error)
  }

  const mutation = useMutation({
    mutationFn: handleUpdateOrder,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.updateOrder, orderId] // Options object goes as second argument
  })

  return mutation
}

export default useOrderCancel
