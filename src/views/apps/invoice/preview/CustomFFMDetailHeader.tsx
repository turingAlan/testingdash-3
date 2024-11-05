import { useParams, useRouter } from 'next/navigation'

import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import ClickToGetCopied from '@/@core/components/custom-click-to-get-copied/CustomClickToGetCopied'
import type { FulfillmentDetails, OrderDetailResponse } from '@/types/apps/orderTypes'
import CustomChip from '@/@core/components/mui/Chip'
import { orderSatusColor } from '@/utils/colorsInfo'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'

interface CustomFFMDetailHeaderProps {
  orderDetails: OrderDetailResponse
  fulfillmentData: FulfillmentDetails
}

const CustomFFMDetailHeader = ({ orderDetails, fulfillmentData }: CustomFFMDetailHeaderProps) => {
  const params = useParams()
  const router = useRouter()

  const { lang: locale } = params

  const fulfillmentStatusBgColor = orderSatusColor(fulfillmentData?.delivery_status ?? '')

  const handleGoToPayment = () => {
    router.push(getLocalizedUrl(`/payment${orderDetails?.payment_id}`, locale as Locale))
  }

  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  return (
    <div className='flex flex-wrap justify-between items-center gap-y-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <CustomChip
            variant='tonal'
            label={fulfillmentData?.delivery_status}
            style={{ backgroundColor: fulfillmentStatusBgColor, color: '#fafafa' }}
            size='small'
          />
          <Typography variant='h5'>
            {`Fullfillment #`}
            <ClickToGetCopied dataType='Fulfillment Id'>{fulfillmentData?.id}</ClickToGetCopied>
          </Typography>
        </div>
      </div>
      <Button onClick={handleGoToPayment} {...buttonProps('See Payment Details', 'primary', 'outlined')} />
    </div>
  )
}

export default CustomFFMDetailHeader
