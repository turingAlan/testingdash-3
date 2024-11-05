'use client'

import { Typography } from '@mui/material'

// React Imports
// import { useState } from 'react'

// Next Imports
// import Link from 'next/link'
// import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// import Button from '@mui/material/Button'

// Type Imports
// import type { Locale } from '@configs/i18n'

// Component Imports
// import AddPaymentDrawer from '@views/apps/invoice/shared/AddPaymentDrawer'
// import SendInvoiceDrawer from '@views/apps/invoice/shared/SendInvoiceDrawer'

// Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'

const PreviewActions = ({ id }: { id: string }) => {
  // States
  // const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false)
  // const [sendDrawerOpen, setSendDrawerOpen] = useState(false)
  console.log(id)

  // Hooks
  // const { lang: locale } = useParams()

  const data = {
    name: 'sarthak jain',
    phone: '9119065994',
    address: {
      city: 'New Delhi',
      name: 'sarthak jain',
      state: 'Delhi',
      country: 'IND',
      building: 'no1',
      locality: 'Gali Number 4',
      area_code: '110041'
    },
    email: 'sarthak0jain@gmail.com'
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
            <Typography>{data.name}</Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Phone Number:
            </Typography>
            <Typography>{data.phone}</Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Email:
            </Typography>
            <Typography>{data.email}</Typography>
          </div>
          <div className='flex flex-col gap-1 mb-1'>
            <Typography className='font-medium' color='text.primary'>
              Address:
            </Typography>
            <Typography>
              {data.address.building +
                ', ' +
                data.address.locality +
                ', ' +
                data.address.city +
                ', ' +
                data.address.state +
                ', ' +
                data.address.country +
                ', ' +
                data.address.area_code}
            </Typography>
          </div>
          {/* <Button
            fullWidth
            variant='contained'
            className='capitalize'
            startIcon={<i className='tabler-send' />}
            onClick={() => setSendDrawerOpen(true)}
          >
            Send Invoice
          </Button>
          <Button fullWidth color='secondary' variant='tonal' className='capitalize'>
            Download
          </Button>
          <div className='flex items-center gap-4'>
            <Button
              fullWidth
              target='_blank'
              component={Link}
              color='secondary'
              variant='tonal'
              className='capitalize'
              href={`/apps/invoice/print/${id}`}
            >
              Print
            </Button>
            <Button
              fullWidth
              component={Link}
              color='secondary'
              variant='tonal'
              className='capitalize'
              href={getLocalizedUrl(`apps/invoice/edit/${id}`, locale as Locale)}
            >
              Edit
            </Button>
          </div>
          <Button
            fullWidth
            color='success'
            variant='contained'
            className='capitalize'
            onClick={() => setPaymentDrawerOpen(true)}
            startIcon={<i className='tabler-currency-dollar' />}
          >
            Add Payment
          </Button> */}
        </CardContent>
      </Card>
      {/* <AddPaymentDrawer open={paymentDrawerOpen} handleClose={() => setPaymentDrawerOpen(false)} /> */}
      {/* <SendInvoiceDrawer open={sendDrawerOpen} handleClose={() => setSendDrawerOpen(false)} /> */}
    </>
  )
}

export default PreviewActions
