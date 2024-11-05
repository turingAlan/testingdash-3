import type { OrderType } from './orderTypes'

export type InvoiceStatus = 'Paid' | string

export type InvoiceLayoutProps = {
  id: string | undefined
}

export type InvoiceClientType = {
  name: string
  address: string
  company: string
  country: string
  contact: string
  companyEmail: string
}

export type InvoiceType = {
  id: string
  name: string
  total: number
  avatar: string
  service: string
  dueDate: string
  address: string
  company: string
  country: string
  contact: string
  avatarColor?: string
  issuedDate: string
  companyEmail: string
  balance: string | number
  invoiceStatus: InvoiceStatus
}

export type StatsType = {
  Completed?: number
  Cancelled?: number
  Pending?: number
  Packed?: number
  Processing?: number
  Return?: number
}

type TaxDeduction = {
  tcs: number
  tds: number
}

export type PaymentType = {
  id: string
  bap_order_id: string
  order_status: string
  payment_amount: number | null
  net_amount: number
  payment_status: string
  payment_type: string
  payment_received_on: string | null
  tax_deduction_json: TaxDeduction
  order: string
}

export type ResponseOrderType = {
  count: number
  page_size: number
  results: OrderType[]
  stats: StatsType
}
export type InvoicePaymentType = {
  iban: string
  totalDue: string
  bankName: string
  country: string
  swiftCode: string
}

export type SingleInvoiceType = {
  invoice: InvoiceType
  paymentDetails: InvoicePaymentType
}
