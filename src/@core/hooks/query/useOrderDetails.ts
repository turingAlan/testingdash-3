import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { queryKey } from '@/@core/querykey'
import axiosInstance from '@/@core/api/interceptor'
import type { OrderDetailResponse } from '@/types/apps/orderTypes'
import { useEssentialDataStore } from '@/@core/stores'

// Custom hook for getorderDetails query
const useGetOrderDetails = (orderId: string) => {
  const { currentShopData } = useEssentialDataStore()

  const [invoiceCreationTried, setInvoiceCreationTried] = useState<boolean>(false)

  const handleGetOrderDetails = async (): Promise<OrderDetailResponse> => {
    if (!orderId) {
      throw new Error('Please add a store')
    }

    const response = await axiosInstance.get(
      `/ironcore/orders-api/v0/orders/${orderId}/?store_id=${currentShopData.id}`
    )

    return response.data
  }

  const getOrderDetails = useQuery({
    queryFn: handleGetOrderDetails,
    enabled: !!orderId,
    queryKey: [queryKey.getOrderDetails, orderId],
    staleTime: 12000 // 2 minute invalidation time
  })

  const handleGetInvoice = async (): Promise<any> => {
    const response = await axiosInstance.get(
      `/ironcore/orders-api/v0/orders/${orderId}/create_invoice/?store_id=${currentShopData.id}`
    )

    return response.data
  }

  const generateInvoice = useQuery({
    queryFn: handleGetInvoice,
    queryKey: [queryKey.getInvoice, orderId],
    staleTime: 20000, // 2 minute invalid
    refetchOnWindowFocus: false,
    enabled: false
  })

  // If there is no invoice data and the invoice creation has not been tried yet, try to create the invoice
  if (getOrderDetails.data && getOrderDetails.isSuccess) {
    const orderData = getOrderDetails.data

    // If the order has no invoice, try to create one
    if (generateInvoice.isSuccess && !orderData.invoice) {
      getOrderDetails.refetch()
    }

    if (!orderData.invoice && !invoiceCreationTried) {
      generateInvoice.refetch()
      setInvoiceCreationTried(true)
    }
  }

  return { getOrderDetails, generateInvoice }
}

export default useGetOrderDetails
