// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import InvoiceListTable from './InvoiceListTable'
import InvoiceCard from './InvoiceCard'
import type { OrdersResponse } from '@/types/apps/orderTypes'

interface InvoiceListProps {
  invoiceData: OrdersResponse
  isLoading: boolean
}

const InvoiceList = ({ invoiceData, isLoading }: InvoiceListProps) => {
  return (
    <Grid container spacing={6}>
      <InvoiceCard stats={invoiceData.stats} />

      <Grid item xs={12}>
        <InvoiceListTable invoiceData={invoiceData} isLoading={isLoading} />
      </Grid>
    </Grid>
  )
}

export default InvoiceList
