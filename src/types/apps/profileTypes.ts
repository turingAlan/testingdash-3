export type ProfileApiPayload = {
  first_name: string
  last_name: string
}

export type ProfilePayload = {
  firstName: string
  lastName: string
}

export type AddPaymentMethodForm = {
  accountHolderName: string
  accountNumber: string
  confirmAccountNumber: string
  bankName: string
  branch: string
  IFSCCode: string
  UPIId: string
}

export type AddPaymentMethodPayload = {
  account_number: string
  ifsc_code: string
  bank_name: string
  branch: string
  account_holder_name: string
  upi?: string
}
