export const orderStatus = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  PROCESSING: 'Processing',
  DELIVERED: 'Delivered',
  RETURN: 'Return',
  RETURN_DELIVERED: 'Return_Delivered',
  OUT_FOR_DELIVERY: 'Out-for-delivery',
  ORDER: 'Order',
  ORDER_DELIVERED: 'Order-delivered',
  AGENT_ASSIGNED: 'Agent Assigned'
}

export const resolutionStatus = {
  LIQUIDATION: 'LIQUIDATION',
  REVERSEQC: 'REVERSEQC',
  REJECT: 'REJECT'
}

export const readOnlyOrderStatus = ['Packed', 'Processing', 'Cancelled']

export const orderPaymentStatusMap = {
  'ON-FULFILLMENT': 'Cash on Delivery',
  PREPAID: 'Prepaid'
}

export const cancelReasons = [
  {
    label: 'Logistics partner has not arrived yet',
    id: '007'
  },
  {
    label: 'You, as the seller, wish to cancel the order due to inventory issues',
    id: '002'
  }
]

export const cancelReasonsMap = {
  '001': 'Price of one or more items have changed due to which buyer was asked to make additional payment',
  '002': 'One or more items in the Order not available',
  '003': 'Product available at lower than order price',
  '004': 'Store is not accepting order',
  '005': 'Merchant rejected the order',
  '006': 'Order / fulfillment not received as per buyer app TAT SLA',
  '007': 'Order / fulfillment not received as per buyer app TAT SLA',
  '008': 'Order / fulfillment not ready for pickup',
  '009': 'Wrong product delivered',
  '010': 'Buyer wants to modify address / other order details',
  '011': 'Buyer not found or cannot be contacted',
  '012': 'Buyer does not want product any more',
  '013': 'Buyer refused to accept delivery',
  '014': 'Address not found',
  '015': 'Buyer not available at location',
  '016': 'Accident / rain / strike / vehicle issues',
  '017': 'Order delivery delayed or not possible',
  '018': 'Delivery pin code not serviceable',
  '019': 'Pickup pin code not serviceable',
  '020': 'Order lost in transit',
  '021': 'Packed order not complete'
}
