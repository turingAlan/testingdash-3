import { useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { queryKey } from '@/@core/querykey'
import axiosInstance from '@/@core/api/interceptor'
import type { OrdersResponse } from '@/types/apps/orderTypes'

// Custom hook for getorders query
const useGetOrders = (storeId: string) => {
  const searchParams = useSearchParams()

  // Get all the api params from the search params of the url
  const searchQuery = searchParams.get('search') || ''
  const orderFilter = searchParams.get('order_sort') || ''
  const timeFilter = searchParams.get('date_range') || ''
  const statusFilter = searchParams.get('order_status') || ''
  const phone = searchParams.get('phone') || ''
  const currentPage = searchParams.get('page') || 1

  const handleGetOrders = async (): Promise<OrdersResponse> => {
    if (!storeId) {
      throw new Error('Please add a store')
    }

    const response = await axiosInstance.get(`ironcore/orders-api/v0/orders/`, {
      params: {
        store_id: storeId,
        search: searchQuery,
        order_sort: orderFilter,
        date_range: timeFilter,
        order_status: statusFilter,
        page: currentPage,
        phone: phone
      }
    })

    return response.data
  }

  const getOrders = useQuery({
    queryFn: handleGetOrders,
    enabled: !!storeId,
    queryKey: [queryKey.getOrders, storeId, searchQuery, orderFilter, timeFilter, statusFilter, phone, currentPage],
    staleTime: 6000 // 1 minute invalidation time
  })

  return getOrders
}

export default useGetOrders
