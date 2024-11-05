'use client'

import { Typography } from '@mui/material'

import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'

import ClickToGetCopied from '@/@core/components/custom-click-to-get-copied/CustomClickToGetCopied'
import { transfromOrderAddressToString } from '@/@core/utils/orderHelper'
import { orderPaymentStatusMap } from '@/data/orderFlowConstants'
import type { OrderDetailResponse } from '@/types/apps/orderTypes'
import { formatDateIso } from '@/utils/string'

// MUI Imports

interface CustomOrderDetailProps {
  orderData: OrderDetailResponse
}

const CustomOrderDetailsCard = ({ orderData }: CustomOrderDetailProps) => {
  const useDetails = {
    ...orderData.customer_details,
    address: transfromOrderAddressToString(orderData.customer_details.address)
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <Typography variant='h5' color='text.primary'>
            Customer Details
          </Typography>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Full Name:
            </Typography>
            <Typography>{useDetails.name}</Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Phone Number:
            </Typography>
            <Typography>{useDetails.phone}</Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Email:
            </Typography>
            <Typography>{useDetails.email}</Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Address:
            </Typography>
            <Typography>
              <ClickToGetCopied dataType='Address'>{useDetails.address ?? ''}</ClickToGetCopied>
            </Typography>
          </div>
        </CardContent>
      </Card>
      <br />
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <Typography variant='h5' color='text.primary'>
            ONDC Details
          </Typography>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              ONDC Order Number
            </Typography>
            <Typography>
              <ClickToGetCopied dataType='Order Id'>{orderData?.ondc_order_num ?? ''}</ClickToGetCopied>
            </Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Payment
            </Typography>
            <Typography>₹{orderData.amount ?? 0}</Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Payment Type
            </Typography>
            <Typography>{orderPaymentStatusMap?.[orderData.payment_type] ?? ''}</Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Date And Time
            </Typography>
            <Typography>{orderData?.created_at ? formatDateIso(orderData?.created_at) : ''}</Typography>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default CustomOrderDetailsCard
