type VariantData = {
  id?: string
  productName: string
  brand: string
  subcategory: string
  description: string
  sellingPrice: string
  mrp: string
  costPrice: string
  code: string
  codeValue: string
  taxSlab: string
  uom_value: string
  uom: string
  sku_count: string
  packing_details: {
    weight: string
    length: string
    width: string
    height: string
  }
  allowCancellations: boolean
  allowReturns: boolean
  returnPeriod: string
  attributes: {
    [key: string]: string
  }
}

type StoreDetails = {
  id: string
  store_images: StoreImage[]
  name: string
  icon: string
  description: string
  is_active: boolean
  fssai: string
  gstin: string
  is_gst_verified: boolean
  pan_number: string
  is_pan_verified: boolean
  drug_license: string | null
  business_mobile_number: string
  business_email: string
  fulfillment: string
  delivery_charge: number
  is_timing_updated: boolean
  time: StoreTiming
  quality_checks: QualityChecks
  payment_details: PaymentDetail
  mode: StoreType
  delivery_location: { radius: string } | null
  expected_delivery_time: string | null
  is_dark_store: boolean
  bpp_commission_charge: number
  bap_commission_threshold: number
  category: StoreCategory
  parent_store?: string
  address: StoreAddress
  acl_properties: ACLProperties
  reffered_by?: string
}

type StoreType = 'QCommerce' | 'ECommerce' | string

type StoreImage = {
  id: string
  image: string
}

type StoreTiming = {
  // TODO: Fix this type
  days: any[]
  range: {
    start: string
    end: string
  }
}

type QualityChecks = {
  [key: string]: boolean | string
}
type PaymentDetail = {
  id: string
  account_type: string | null
  pan: string | null
  gst: string | null
  account_number: string
  ifsc_code: string
  bank_name: string
  branch: string
  account_holder_name: string
  upi: string
  is_default: boolean
  user: string
}

type StoreCategory = {
  return_window: string
  is_returnable: boolean
  is_cancellable: boolean
  is_cod: boolean
  time_to_ship: string
  category_detail: CategoryDetail
}

type CategoryDetail = {
  id: string
  name: string
}

type StoreAddress = {
  id: string
  locality: string
  street: string
  building: string
  city: string
  pincode: string
  state: string
  gps: string
}

type ACLProperties = {
  state: boolean
  invite_options: {
    email_invite: boolean
    phone_invite: boolean
  }
  metadata: {
    user_type: string
    permisssion: string
  }
}

type categoryMetaData = {
  data: any
}

type AddStorePayload = {
  name: string
  description: string
  business_email: string
  business_mobile_number: string
  bap_commission_threshold?: number
  address: {
    locality: string
    street: string
    city: string
    state: string
    pincode: string
    building: string
    gps: string
  }
  payment_details: string
  category: string
  fssai: string
  fulfillment: string
  is_returnable: boolean
  is_cancellable: boolean
  is_cod: boolean
  return_window: string
  gstin: string
  pan_number: string
  time_to_ship: string
  quality_checks: QualityChecks
  mode: StoreType
  delivery_location: {
    radius?: string
  } | null
}

type EditStorePayload = {
  id: string
  name: string
  fssai: string
  fulfillment: string
  business_email: string
  business_mobile_number: string
  mode: StoreType
  bap_commission_threshold: string | number
  delivery_location: {
    radius: string
  } | null
  quality_checks: QualityChecks
  category: {
    return_window: string
    is_cancellable: boolean
    is_returnable: boolean
    is_cod: boolean
    time_to_ship: string
  }
  expected_delivery_time?: string
  delivery_charge?: string
}

export type {
  StoreDetails,
  VariantData,
  StoreImage,
  StoreTiming,
  QualityChecks,
  PaymentDetail,
  StoreCategory,
  CategoryDetail,
  StoreAddress,
  ACLProperties,
  categoryMetaData,
  AddStorePayload,
  EditStorePayload
}
