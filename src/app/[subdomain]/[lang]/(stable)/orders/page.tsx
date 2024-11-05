'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import { toast } from 'react-toastify'

import InvoiceList from '@views/apps/invoice/list'
import { useEssentialDataStore } from '@/@core/stores'
import useGetOrders from '@/@core/hooks/query/useOrders'

const InvoiceApp = () => {
  // Hooks
  const { currentShopData } = useEssentialDataStore()

  const { data, error, isLoading, isFetching } = useGetOrders(currentShopData?.id || '')

  if (error) {
    toast.error('Error while fetching orders')
  }

  return (
    <Grid container>
      <Grid item xs={12} key={`${data?.results?.length}-${isFetching}`}>
        <InvoiceList invoiceData={data || { count: 0, page_size: 0, stats: {}, results: [] }} isLoading={isLoading} />
      </Grid>
    </Grid>
  )
}

export default InvoiceApp
