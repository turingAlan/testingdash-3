'use client'

import { Button, Card, CardContent, Grid, Tooltip, Typography } from '@mui/material'

import CustomPaymentDetailsCard from '@/views/apps/invoice/preview/CustomPaymentDetailsCard'

export default function PaymentId({ params }: { params: { payment_id: number } }) {
  const { payment_id } = params

  const dummydata = {
    id: '1efab5a0-980a-41eb-81c2-cc8b849ce949',
    bap_order_id: '2024-10-18-224133',
    order_status: 'Completed',
    payment_amount: null,
    net_amount: 1950,
    payment_status: 'PENDING',
    payment_type: 'ON-ORDER',
    quote: {
      breakup: [
        {
          type: 'item',
          title: 'Sofa',
          item_id: 'bb8d0b70-6ca1-4672-be7b-ec29613799a1',
          quantity: 0,
          tax_type: null,
          net_price: '0.0',
          item_price: '570.48'
        },
        {
          type: 'item',
          title: 'Armchairs',
          item_id: '70376ba5-8c98-4b3e-853a-5a1b2924b757',
          quantity: 2,
          tax_type: null,
          net_price: '1523.8',
          item_price: '761.9'
        },
        {
          type: 'tax',
          title: 'Tax',
          item_id: '70376ba5-8c98-4b3e-853a-5a1b2924b757',
          quantity: null,
          tax_type: 'item',
          net_price: '76.2',
          item_price: null
        },
        {
          type: 'item',
          title: 'Coffee Table',
          item_id: '3ebc73aa-574a-4dc6-a3a2-08d96fcdd1f8',
          quantity: 1,
          tax_type: null,
          net_price: '333.33',
          item_price: '333.33'
        },
        {
          type: 'tax',
          title: 'Tax',
          item_id: '3ebc73aa-574a-4dc6-a3a2-08d96fcdd1f8',
          quantity: null,
          tax_type: 'item',
          net_price: '16.67',
          item_price: null
        }
      ]
    },
    payment_received_on: null,
    tax_deduction_json: {
      tcs: 0.005,
      tds: 0.001
    },
    order: '09166700-70bd-48f8-903d-0c329d2f35b7',
    platform_commission_percent: 3,
    platform_commission: {
      meta: {
        type: 'percent',
        amount: 3
      },
      amount: 58.5,
      gst: 0.54
    },
    buyer_app_commission: {
      meta: {
        type: 'percent',
        amount: '3.0'
      },
      amount: 58.5,
      gst: 10.53
    },
    order_items: [
      {
        id: '70376ba5-8c98-4b3e-853a-5a1b2924b757',
        product_name: 'Armchairs',
        quantity: 2,
        price: '761.9',
        net_price: '1523.8'
      },
      {
        id: '3ebc73aa-574a-4dc6-a3a2-08d96fcdd1f8',
        product_name: 'Coffee Table',
        quantity: 1,
        price: '333.33',
        net_price: '333.33'
      }
    ],
    order_cancel_items: [
      {
        cancel_quantity: 1,
        cancellation_reason_id: '002',
        initiated_by: 'bridge.sellersetu.in',
        id: '9cea7130-849a-4509-8c74-ef4ccfa4085b',
        product_name: 'Coffee Table',
        price: 350,
        net_price: 350
      }
    ],
    order_return_items: [
      {
        return_quantity: 2,
        reason_id: '002',
        reason_image:
          'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/2024-10-18-224133/01bcdb9a-7f24-41ee-9b55-8e5445e9c738.png',
        reason_description: 'detailed description for return',
        initiated_by: 'buyer-app-preprod-v2.ondc.org',
        resolution_method: 'liquidation',
        id: '1bbc46ec-7188-4125-b2a8-d0648fcf91ce',
        product_name: 'Sofa',
        price: 599,
        net_price: 1198
      }
    ],
    subtotal: 1857.13,
    charges: [
      {
        type: 'tax',
        title: 'Tax',
        id: '70376ba5-8c98-4b3e-853a-5a1b2924b757',
        amount: '76.2',
        tax_type: 'item'
      },
      {
        type: 'tax',
        title: 'Tax',
        id: '3ebc73aa-574a-4dc6-a3a2-08d96fcdd1f8',
        amount: '16.67',
        tax_type: 'item'
      }
    ],
    charges_total: 92.87,
    extra_charges: {
      cancellation_charge: 0,
      return_charge: 0,
      cost_weight_difference: 0
    },
    ERROR: {
      difference: -92.86999999999989,
      subtotal: 1857.13,
      net_amount: 1950,
      original_order_amount: 3498,
      cancel_return_items_cost: 1548,
      charges_total: 92.87
    }
  }

  if (!payment_id) {
    return <div>Loading...</div>
  }

  // const status: string = 'Completed'

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomPaymentDetailsCard paymentNumber={dummydata.bap_order_id} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent className='flex justify-start'>
              <div>
                <Typography variant='h5' className='mb-2'>
                  Payment Details
                </Typography>
                <div className='flex gap-1'>
                  <Typography color='text.primary' className='min-is-[100px]'>
                    Payment Type
                  </Typography>
                  {' : '}
                  <Typography color='text.primary' className='font-medium'>
                    Prepaid
                  </Typography>
                </div>
                <div className='flex gap-1'>
                  <Typography color='text.primary' className='min-is-[100px]'>
                    Expected Settlement Time
                  </Typography>
                  {' : '}
                  <Typography color='text.primary' className='font-medium'>
                    Return Window + 4 days
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
          <br />
          <Button variant='outlined' color='primary'>
            Go to order Details
          </Button>
        </Grid>
        <Grid item xs={12} sm={3} style={{ marginLeft: 'auto' }}>
          <Card>
            <CardContent className='flex justify-end'>
              <div>
                <div className='flex items-center gap-12'>
                  <Typography color='text.primary' className='min-is-[100px]'>
                    Subtotal:
                  </Typography>
                  <Typography color='text.primary' className='font-medium'>
                    ₹{dummydata.subtotal}
                  </Typography>
                </div>
                <div className='flex items-center gap-12'>
                  <Typography color='text.primary' className='min-is-[100px] flex gap-1 items-center'>
                    Commision
                    <Tooltip title={`This is ${dummydata.platform_commission_percent}% of the total amount`}>
                      <i className='tabler-info-circle text-[16px]' />
                    </Tooltip>
                  </Typography>
                  <Typography color='text.primary' className='font-medium'>
                    ₹{dummydata.platform_commission.amount}
                  </Typography>
                </div>
                {dummydata.charges.map((charge, index) => (
                  <div key={index} className='flex items-center gap-12'>
                    <Typography color='text.primary' className='min-is-[100px]'>
                      {charge.title}:
                    </Typography>
                    <Typography color='text.primary' className='font-medium'>
                      ₹{charge.amount}
                    </Typography>
                  </div>
                ))}
                <div className='flex items-center gap-12'>
                  <Typography color='text.primary' className='font-medium min-is-[100px]'>
                    Total:
                  </Typography>
                  <Typography color='text.primary' className='font-medium'>
                    ₹{dummydata.net_amount}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
