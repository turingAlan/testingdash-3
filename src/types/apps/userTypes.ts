// Type Imports
import type { ThemeColor } from '@core/types'

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
  billing: string
}

type Organization = {
  id: string
  name: string
  logo: string
  plan_name: string
  user_limit: number
  shop_limit: number
  domain: string
  org_type: string
  is_tsp: boolean
  is_whitelabled: boolean
  org_id: string
}

export type UserData = {
  id: string
  profile_complete_percent: number
  username: string
  first_name: string
  last_name: string
  is_active: boolean
  phone: string
  email: string
  chatbot_uri: string
  auth_id: string | null
  dob: string
  gender: string
  annual_income: string
  aadhar_number: string
  pan_number: string
  pan_data: string | null
  kyc_data: string | null
  is_aadhar_verified: boolean
  is_pan_verified: boolean
  referred_by: string | null
  organization: Organization
  payment_detail: any[] // Modify this if you have a more specific type for payment details
}
