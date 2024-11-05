// React Imports
import type { ChangeEvent } from 'react'
import { forwardRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Import
import type { CustomInputImgDataDelivery, CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Components Imports
import CustomInputVerticalDelivery from '../custom-inputs/CustomVertical'
import { deliveryTypes } from '@/data/storeFlowConstants'

type Data = Omit<CustomInputVerticalData, 'asset'>

const assetData: CustomInputImgDataDelivery[] = [
  {
    value: deliveryTypes.MANAGED,
    isSelected: true,
    img: '/images/managed.svg',
    deliverType: 'Delivery By SellerSetu'
  },
  {
    value: deliveryTypes.SELF,
    img: '/images/self_fulfillment.svg',
    deliverType: 'Self Fulfillment'
  }
]

const data: Data[] = [
  {
    value: deliveryTypes.MANAGED,
    title: 'Delivery By SellerSetu',
    isSelected: true
  },
  {
    value: deliveryTypes.SELF,
    title: 'Self Fulfillment'
  }
]

interface CustomMainDeliveryTypeSelectRadioProps {
  onChange: (value: string) => void
  value: string
  disabled?: boolean
}

const CustomMainDeliveryTypeSelectRadio = forwardRef<HTMLDivElement, CustomMainDeliveryTypeSelectRadioProps>(
  ({ onChange, value, ...rest }, ref) => {
    const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof prop === 'string') {
        onChange(prop)
      } else {
        onChange((prop.target as HTMLInputElement).value)
      }
    }

    return (
      <Grid container spacing={4} ref={ref}>
        {data.map((item, index) => {
          return (
            <CustomInputVerticalDelivery
              type='radio'
              key={index}
              data={{ ...item, asset: assetData[index].img }}
              selected={value}
              name='custom-radio-icons'
              handleChange={handleChange}
              gridProps={{ sm: 6, xs: 12 }}
              {...rest}
            />
          )
        })}
      </Grid>
    )
  }
)

export default CustomMainDeliveryTypeSelectRadio
