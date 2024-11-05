import React from 'react'

import { Box, Typography, Paper } from '@mui/material'

import type { PaymentDetail } from '@/types/apps/storeTypes'

interface PaymentMethodCardProps {
  paymentDetail: PaymentDetail
}

const PaymentMethodCard = ({ paymentDetail }: PaymentMethodCardProps) => {
  return (
    <Paper elevation={3} className='px-2 py-3 border-dashed border-2 border-blue-300 rounded-md max-w-xs shadow-md'>
      <div className='flex gap-3 items-center'>
        <Box className='mb-3'>
          <Typography variant='body2' className='text-sm text-gray-500 font-medium'>
            Account Number
          </Typography>
          <Typography variant='h6' className='text-base font-semibold'>
            {paymentDetail.account_number ?? ''}
          </Typography>
        </Box>

        <Box className='mb-3'>
          <Typography variant='body2' className='text-sm text-gray-500 font-medium'>
            Account Holder Name
          </Typography>
          <Typography variant='h6' className='text-base font-semibold'>
            {paymentDetail.account_holder_name ? paymentDetail.account_holder_name : ''}
          </Typography>
        </Box>
      </div>

      {paymentDetail.upi && (
        <Box>
          <Typography variant='body2' className='text-sm text-gray-500 font-medium'>
            UPI Id
          </Typography>
          <Typography variant='h6' className='text-base font-semibold'>
            {paymentDetail.upi ? paymentDetail.upi : 'No UPI Id'}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default PaymentMethodCard
