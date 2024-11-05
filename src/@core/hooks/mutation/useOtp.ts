import { useState } from 'react'

import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import useLogin from './useLogin'
import type { LoginApiPayload } from '@/types/apps/loginTypes'

// Custom hook for login mutation
const useOtp = (setOtpPopup: React.Dispatch<React.SetStateAction<boolean>>) => {
  const { mutate: loginMutate } = useLogin()

  const [otpData, setOtpData] = useState<any>(null)
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false)

  // Disable OTP for dev environment
  const isDev = process.env.NEXT_PUBLIC_ENV === 'dev'

  const handleOtpStateReset = () => {
    setOtpPopup(false)
    setOtpData(null)
  }

  // Define the login handler function
  const handleGetOtp = async (phoneNumber: string): Promise<any> => {
    // Disable OTP for dev environment
    if (isDev) {
      setOtpData({
        reference_key: null,
        phone: phoneNumber
      })

      return 'success'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ironcore/users-api/v0/user/sendotp/`, {
      phone: phoneNumber
    })

    setOtpData({
      reference_key: response.data.reference_key,
      phone: phoneNumber
    })

    return response.data
  }

  const handleGetOtpSuccess = () => {
    setOtpPopup(true)
    toast.success('We have sent the OTP!')
  }

  const handleGetOtpError = (error: any) => {
    toast.error('Error getting OTP please try again')
    console.error('login error', error)
  }

  // Use useMutation and pass handleLogin as the first argument
  const getOtp = useMutation({
    mutationFn: handleGetOtp,
    onSuccess: handleGetOtpSuccess,
    onError: handleGetOtpError,
    mutationKey: [queryKey.getOtp] // Options object goes as second argument
  })

  const handleVerifyOtp = async (otp: string): Promise<any> => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid OTP')
      throw new Error('Invalid OTP')
    }

    if (isDev) {
      return null
    }

    const apiPayload = {
      otp,
      reference_key: otpData.reference_key
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/ironcore/users-api/v0/user/verifyotp/`,
      apiPayload
    )

    return response.data
  }

  const handleVerifyOtpLoginSuccess = () => {
    setIsPhoneVerified(true)
    toast.success('Phone verified! successfully logged in')

    // after verify otp login with the same phone numb
    const loginPayload: LoginApiPayload = {
      phone: otpData.phone,
      method: 'phone_login'
    }

    loginMutate(loginPayload)
    handleOtpStateReset()
  }

  const handleVerifyOtpLoginError = (error: any) => {
    toast.error('Error veryfing Phone please try again')
    console.error('login error', error)
  }

  const verifyOtpLogin = useMutation({
    mutationFn: handleVerifyOtp,
    onSuccess: handleVerifyOtpLoginSuccess,
    onError: handleVerifyOtpLoginError,
    mutationKey: [queryKey.verifyOtp, queryKey.login] // Options object goes as second argument
  })

  const handleVerifyOtpRegisterSuccess = () => {
    setIsPhoneVerified(true)
    toast.success('Phone verified! successfully')
    handleOtpStateReset()
  }

  const handleVerifyOtpRegisterError = (error: any) => {
    toast.error('Error veryfing Phone please try again')
    console.error('register error', error)
  }

  const verifyOtpRegister = useMutation({
    mutationFn: handleVerifyOtp,
    onSuccess: handleVerifyOtpRegisterSuccess,
    onError: handleVerifyOtpRegisterError,
    mutationKey: [queryKey.verifyOtp, queryKey.register] // Options object goes as second argument
  })

  return { getOtp, verifyOtpLogin, verifyOtpRegister, isPhoneVerified, setIsPhoneVerified }
}

export default useOtp
