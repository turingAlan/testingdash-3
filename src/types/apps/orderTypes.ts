export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Cancelled'
  | 'Completed'
  | 'Processing'
  | 'Delivered'
  | 'Return'
  | 'Out-for-delivery'
  | 'Order'
  | 'Order-delivered'

export type PaymentType = 'ON-FULFILLMENT' | 'PREPAID'

export type OrdersResponse = {
  count: number
  page_size: number
  stats: object
  results: OrderType[]
}

export type OrderType = {
  id: string
  store: string
  amount: number
  order_status: OrderStatus
  state_status: string
  ondc_order_num: string
  created_at: string // ISO 8601 timestamp
  updated_at: string // ISO 8601 timestamp
  return_status: string | null
  payment_type: PaymentType
  buyer_name: string
  total_items: number
  is_resolution_pending: boolean
  payment_amount: number | null
  payment_status: string | null
}

export type Address = {
  city: string
  name: string
  state: string
  country: string
  building: string
  locality: string
  area_code: string
}

export type CustomerDetails = {
  name: string
  phone: string
  address: Address
  email: string
}

export type Instructions = {
  code: string
  name: string
  long_desc: string
  short_desc: string
  image?: string[]
}

export type ProductVariant = {
  id: string
  selling_price: number
  cost_price: number
  mrp: number
  quantity: {
    uom: string
    uom_value: string
  }
  variant_no?: string | number
}

export type ProductImage = {
  id: string
  deleted_at: string | null
  image: string
  is_thumbnail: boolean
  product: string
}

export type Product = {
  id: string
  name: string
  variants: ProductVariant
  image: ProductImage[]
}

export type OrderItem = {
  id: string
  status: string
  quantity: number
  cancellation_reason_id: string
  cancellation_description: string
  product_original_price: number
  tax: number
  product: Product
}

export type ReturnOrderItem = {
  id: string
  status: string
  quantity: number
  cancellation_reason_id: string
  cancellation_description: string
  product_original_price: number
  tax: number
  product: Product
  return_status: string
  return_quantity: number
  reason_id: string
}

export type FulfillmentDetails = {
  id: string
  delivery_status: OrderStatus
  order_status?: string
  pickup_instructions: Instructions
  delivery_instructions: Instructions
  billing_address: Address
  delivery_address: Address
  delivery_partner: string
  weight_difference: number
  otp: string | null
  tracking_url: string | null
  pickup_agent_details: any | null
  expected_pickup_time: string | null
  cost_weight_difference: number
  extra_charges: number
  is_rto: boolean
  order_items: OrderItem[]
  order_cancel_items: any[]
  order_return_items: ReturnOrderItem[]
  order_liquidated_items: any[]
  awb_no?: string
}

export type QuoteBreakupItem = {
  item?: {
    price?: {
      value: string
      currency: string
    }
    tags?: Array<{
      code: string
      list: Array<{
        code: string
        value: string
      }>
    }>
  }
  price: {
    value: string
    currency: string
  }
  title: string
  '@ondc/org/item_id': string
  '@ondc/org/title_type': string
  '@ondc/org/item_quantity'?: {
    count: number
  }
}

export type Quote = {
  ttl: string
  price: {
    value: string
    currency: string
  }
  breakup: QuoteBreakupItem[]
}

export type PaymentSettlementDetail = {
  bank_name: string
  branch_name: string
  upi_address: string
  settlement_type: string
  beneficiary_name: string
  settlement_phase: string
  settlement_ifsc_code: string
  settlement_counterparty: string
  settlement_bank_account_no: string
}

export type PaymentJson = {
  type: string
  params: {
    amount: string
    currency: string
  }
  status: string
  collected_by: string
  '@ondc/org/settlement_details': PaymentSettlementDetail[]
  '@ondc/org/buyer_app_finder_fee_type': string
  '@ondc/org/buyer_app_finder_fee_amount': string
}

export type ReturnResolution = {
  is_resolution_pending: boolean
  resolution_items: any[]
}

export type OrderDetailResponse = {
  id: string
  customer_details: CustomerDetails
  fulfillment: FulfillmentDetails[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  ondc_order_num: string
  order_status: OrderStatus
  amount: number
  net_amount: number
  state_status: string
  return_status: string | null
  invoice_number: string | null
  invoice: string
  quote: Quote
  payment_type: PaymentType
  bap_order_id: string
  retail_transaction_id: string
  payment_status: string | null
  bap_created_at: string
  bap_updated_at: string
  payment_json: PaymentJson
  city_code: string
  all_saved: boolean
  all_cancelled_items_saved: boolean
  all_return_items_saved: boolean
  is_cancelled: boolean
  cancelled_by: string | null
  platform_commission_json: {
    type: string
    amount: number
  }
  packed_at: string | null
  picked_at: string | null
  delivered_at: string | null
  logistics_fee: number
  seller_logistics_fee_percentage: number
  store: string
  customer: string
  buyer_app: string
  return_resolution: ReturnResolution
  payment_id: string
}

export type OrderItemCancel = {
  item_id: string
  quantity: number
}
