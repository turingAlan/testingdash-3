import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { queryKey } from '@/@core/querykey'
import axiosInstance from '@/@core/api/interceptor'
import type { AddPaymentMethodPayload, AddPaymentMethodForm } from '@/types/apps/profileTypes'

// Custom hook for handle order return mutation
const usePaymentMethod = () => {
  const queryClient = useQueryClient()

  // Define the update order handler function
  const handleAddPaymentMethod = async (paymentData: AddPaymentMethodForm): Promise<any> => {
    const apiPayload: AddPaymentMethodPayload = {
      account_holder_name: paymentData.accountHolderName,
      account_number: paymentData.accountNumber,
      bank_name: paymentData.bankName,
      branch: paymentData.branch,
      ifsc_code: paymentData.IFSCCode,
      upi: paymentData.UPIId ?? ''
    }

    const response = await axiosInstance.post(`/ironcore/users-api/v0/payment-detail/`, apiPayload)

    return response.data
  }

  const handleSuccess = () => {
    // Invalidate the get paymentdetails query
    queryClient.invalidateQueries({
      queryKey: [queryKey.getPaymentDetails]
    })

    toast.success('Payment method added')
  }

  const handleError = (error: any) => {
    toast.error('Error while updating please try again!')
    console.error('login error', error)
  }

  const mutation = useMutation({
    mutationFn: handleAddPaymentMethod,
    onSuccess: handleSuccess,
    onError: handleError,
    mutationKey: [queryKey.addPayment] // Options object goes as second argument
  })

  return mutation
}

export default usePaymentMethod
