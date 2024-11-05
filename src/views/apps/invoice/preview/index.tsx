// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CustomOrderDetailsCard from './CustomOrderDetailsCard'
import CustomOrderItemCard from './CustomOrderItemCard'
import type { OrderDetailResponse } from '@/types/apps/orderTypes'

interface OrderPreviewProps {
  orderData: OrderDetailResponse
}

const Preview = ({ orderData }: OrderPreviewProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={9}>
        <CustomOrderItemCard orderData={orderData} />
      </Grid>
      <Grid item xs={12} md={3}>
        <CustomOrderDetailsCard orderData={orderData} />
      </Grid>
    </Grid>
  )
}

export default Preview
