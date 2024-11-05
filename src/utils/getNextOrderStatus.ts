import type { OrderStatus } from '@/types/apps/orderTypes'

export const getNextOrderStatus = (currentOrderStatus: OrderStatus): OrderStatus => {
  switch (currentOrderStatus) {
    case 'Pending':
      return 'Packed'
    case 'Packed':
      return 'Processing'
    case 'Processing':
      return 'Completed'
    default:
      return 'Completed'
  }
}

export const getNextFulfillmentStatus = (currentFulfillmentStatus: OrderStatus): OrderStatus => {
  switch (currentFulfillmentStatus) {
    case 'Pending':
      return 'Packed'
    case 'Packed':
      return 'Out-for-delivery'
    case 'Out-for-delivery':
      return 'Order-delivered'
    default:
      return 'Order-delivered'
  }
}
