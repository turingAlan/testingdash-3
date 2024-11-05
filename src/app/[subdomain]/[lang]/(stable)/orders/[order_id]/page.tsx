'use client'

import { useEffect, useState } from 'react'

import useGetOrderDetails from '@/@core/hooks/query/useOrderDetails'
import type { OrderDetailResponse } from '@/types/apps/orderTypes'
import Preview from '@/views/apps/invoice/preview'
import CustomOrderDetailHeader from '@/views/apps/invoice/preview/CustomOrderDetailHeader'

export default function OrderId({ params }: { params: { order_id: string | number } }) {
  const { order_id } = params

  // Hooks
  const { getOrderDetails, generateInvoice } = useGetOrderDetails(order_id.toString())

  // State
  const [orderData, setOrderData] = useState<OrderDetailResponse | null>(null)

  const { data: orderDataResponse } = getOrderDetails

  useEffect(() => {
    if (orderDataResponse) {
      setOrderData(orderDataResponse)
    }
  }, [orderDataResponse])

  if (orderData === null) {
    return <div>Loading...</div>
  }

  return (
    <>
      <CustomOrderDetailHeader orderData={orderData} generateInvoice={generateInvoice} />
      <br />
      <Preview orderData={orderData} />
    </>
  )
}
