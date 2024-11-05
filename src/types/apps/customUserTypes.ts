// Type Imports
import type { ThemeColor } from '@core/types'

export type customUsersType = {
  id: number
  role?: string
  email?: string
  status?: string
  avatar?: string
  company?: string
  city?: string
  country?: string
  contact?: string
  fullName?: string
  username?: string
  currentPlan?: string
  avatarColor?: ThemeColor
  billing?: string
  created_at?: string
}
