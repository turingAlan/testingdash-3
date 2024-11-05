import type { UserData } from './userTypes'

import type { categoryMetaData, PaymentDetail, StoreDetails, VariantData } from '@/types/apps/storeTypes'

type EssentialData = {
  profileData: UserData | null
  allShops: StoreDetails[]
  paymentDetails: PaymentDetail[]
  allCategories: string[]
  categoryMetaData: categoryMetaData | null
  organizationData: any | null
  variantData: VariantData | null
  variantDataId: string | null
  currentShopData: any
}

type EssentialDataStore = {
  profileData: UserData | null
  allShops: StoreDetails[]
  paymentDetails: PaymentDetail[]
  allCategories: string[]
  categoryMetaData: any | null
  organizationData: any | null
  variantData: VariantData | null
  variantDataId: string | null
  currentShopData: StoreDetails
  setProfileData: (data: UserData) => void
  setAllShops: (data: StoreDetails[]) => void
  setVariantData: (data: VariantData | null) => void
  setVariantDataId: (data: string | null) => void
  setPaymentDetails: (data: PaymentDetail[]) => void
  setCategoryMetaData: (data: categoryMetaData) => void
  setEssentialData: (data: EssentialData) => void
  setOrgainzationData: (data: any) => void
  setCurrentShopData: (data: any) => void
  resetEssentialData: () => void
}

export type { EssentialDataStore, EssentialData }
