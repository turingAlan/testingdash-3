// Type Imports

export type LoginPayload = {
  method: LoginMethodType
  email?: string
  phone?: string
  password?: string
  accessToken?: string
}

export type LoginApiPayload = {
  method: LoginMethodType
  email?: string
  phone?: string
  password?: string
  access_token?: string
}

export type LoginMethodType = 'google_login' | 'email_login' | 'phone_login'

export type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}
