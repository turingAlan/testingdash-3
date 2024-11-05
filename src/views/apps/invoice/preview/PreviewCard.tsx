'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Type Imports
// import type { InvoiceType } from '@/types/apps/invoiceTypes'
// import type { InvoiceType } from '@/types/apps/invoiceTypes'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { formatDateIso } from '@/utils/string'
import CustomChip from '@/@core/components/mui/Chip'
import { orderSatusColor } from '@/utils/colorsInfo'

// Vars
const itemdata = [
  {
    Item: 'Premium Branding Package',
    Description: 'Branding & Promotion',
    Hours: 48,
    Qty: 1,
    Total: '$32'
  },
  {
    Item: 'Social Media',
    Description: 'Social media templates',
    Hours: 42,
    Qty: 1,
    Total: '$28'
  },
  {
    Item: 'Web Design',
    Description: 'Web designing package',
    Hours: 46,
    Qty: 1,
    Total: '$24'
  },
  {
    Item: 'SEO',
    Description: 'Search engine optimization',
    Hours: 40,
    Qty: 1,
    Total: '$22'
  }
]

const PreviewCard = ({ id }: { id: string }) => {
  console.log(id)

  const data = {
    id: 'c53248f5-cfef-4d89-af8e-87e22ce26aea',
    customer_details: {
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
    },
    fulfillment: [
      {
        id: '40cae7b3-92e1-421a-8f56-d7dd44c1e3c2',
        delivery_status: 'Pending',
        pickup_instructions: null,
        delivery_instructions: {
          code: '3',
          name: '',
          long_desc: 'No additional delivery instructions',
          short_desc: 'No delivery code'
        },
        billing_address: {
          city: 'New Delhi',
          name: 'sarthak jain',
          state: 'Delhi',
          country: 'IND',
          building: 'no1',
          locality: 'Gali Number 4',
          area_code: '110041'
        },
        delivery_address: {
          city: 'New Delhi',
          name: 'sarthak jain',
          state: 'Delhi',
          country: 'IND',
          building: 'no1',
          locality: 'Gali Number 4',
          area_code: '110041'
        },
        delivery_partner: 'SellerSetu Self-Fulfillment',
        weight_difference: 0,
        otp: null,
        tracking_url: null,
        pickup_agent_details: null,
        expected_pickup_time: null,
        cost_weight_difference: 0,
        extra_charges: 0,
        is_rto: false,
        order_items: [
          {
            id: '91c0092c-cd3c-4982-a984-095ffe0b775b',
            status: 'NA',
            quantity: 1,
            cancellation_reason_id: '',
            cancellation_description: '',
            product_original_price: 1199,
            product: {
              id: '85788c36-16a4-48ca-878e-4dbb22e41895',
              name: 'Bed',
              variants: {
                id: '85788c36-16a4-48ca-878e-4dbb22e41895',
                selling_price: 1199,
                cost_price: 1199,
                mrp: 1199,
                quantity: {
                  uom: 'unit',
                  uom_value: '1'
                }
              },
              image: []
            }
          }
        ],
        order_cancel_items: [],
        order_return_items: [],
        order_liquidated_items: []
      }
    ],
    created_at: '2024-10-07T16:32:12.472361+05:30',
    updated_at: '2024-10-07T16:34:50.671908+05:30',
    deleted_at: null,
    ondc_order_num: '2024-10-07-188857',
    order_status: 'Pending',
    amount: 1238,
    net_amount: 1199,
    state_status: 'Accepted',
    return_status: null,
    invoice_number: null,
    invoice:
      'https://development-ironcore.s3.amazonaws.com/invoice_path/2024-10-07-188857-Kiraana_Dukaan_SellerSetu-2024-10-07_163449.567272.pdf',
    quote: {
      ttl: 'P1D',
      price: {
        value: '1238.0',
        currency: 'INR'
      },
      breakup: [
        {
          item: {
            price: {
              value: '1199.0',
              currency: 'INR'
            },
            quantity: {
              maximum: {
                count: '99'
              },
              available: {
                count: '99'
              }
            }
          },
          price: {
            value: '1199.0',
            currency: 'INR'
          },
          title: 'Bed',
          '@ondc/org/item_id': '85788c36-16a4-48ca-878e-4dbb22e41895',
          '@ondc/org/title_type': 'item',
          '@ondc/org/item_quantity': {
            count: 1
          }
        },
        {
          price: {
            value: '39.00',
            currency: 'INR'
          },
          title: 'Delivery charges',
          '@ondc/org/item_id': 'ss_standard_f',
          '@ondc/org/title_type': 'delivery'
        }
      ]
    },
    payment_type: 'ON-FULFILLMENT',
    bap_order_id: '2024-10-07-188857',
    retail_transaction_id: 'dc060427-3818-4b55-9c31-ba55344e0539',
    payment_status: null,
    bap_created_at: '2024-10-07T11:02:12.329Z',
    bap_updated_at: '2024-10-07T11:02:12.329Z',
    payment_json: {
      type: 'ON-FULFILLMENT',
      params: {
        amount: '1238.00',
        currency: 'INR'
      },
      status: 'NOT-PAID',
      collected_by: 'BPP',
      '@ondc/org/settlement_details': [
        {
          bank_name: 'Test Bank',
          branch_name: 'Test Bank',
          upi_address: 'myupi@upi',
          settlement_type: 'neft',
          beneficiary_name: 'Sellersetu',
          settlement_phase: 'sale-amount',
          settlement_ifsc_code: '123654789',
          settlement_counterparty: 'seller-app',
          settlement_bank_account_no: '123654789'
        }
      ],
      '@ondc/org/buyer_app_finder_fee_type': 'percent',
      '@ondc/org/buyer_app_finder_fee_amount': '3.0'
    },
    city_code: 'std:011',
    all_saved: true,
    all_cancelled_items_saved: false,
    all_return_items_saved: false,
    is_cancelled: false,
    cancelled_by: null,
    platform_commission_json: {
      type: 'percent',
      amount: 3
    },
    packed_at: null,
    picked_at: null,
    delivered_at: null,
    store: 'ff221647-8cca-444c-ba7a-ab71222615d5',
    customer: '5c28a103-ef8a-42a7-8b35-05035c4f4ef6',
    buyer_app: 'a84df2a5-af1d-4d5e-8e5e-a1957dccbc4b',
    return_resolution: {
      is_resolution_pending: false,
      resolution_items: []
    },
    payment_id: '7f809a98-fef1-4eca-baf9-7591ff0ab887'
  }

  return (
    <Card>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5'>
                    <Logo />
                  </div>
                  <div>
                    <Typography color='text.primary'>Office 149, 450 South Brand Brooklyn</Typography>
                    <Typography color='text.primary'>San Diego County, CA 91905, USA</Typography>
                    <Typography color='text.primary'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                  </div>
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5' color={'#3881e6'}>{`Invoice #${data.bap_order_id}`}</Typography>
                  <Typography variant='h5' color={'#3881e6'}>{`Invoice #${data.bap_order_id}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    {/* <Typography color='text.primary'>{`Date Issued: ${invoiceData.issuedDate}`}</Typography>
                    <Typography color='text.primary'>{`Date Due: ${invoiceData.dueDate}`}</Typography> */}
                    <Typography color='text.primary'>{`Order date: ${formatDateIso(data.created_at)}`}</Typography>
                    <Typography color='text.primary'>
                      Order status:
                      <span>
                        <CustomChip
                          round='true'
                          size='small'
                          label={data.order_status}
                          style={{
                            backgroundColor: orderSatusColor(data.order_status),
                            color: '#fafafa',
                            fontWeight: 100
                          }}
                        />
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice To:
                  </Typography>
                  <div>
                    {/* <Typography>{invoiceData.name}</Typography>
                    {/* <Typography>{invoiceData.name}</Typography>
                    <Typography>{invoiceData.company}</Typography>
                    <Typography>{invoiceData.address}</Typography>
                    <Typography>{invoiceData.contact}</Typography>
                    <Typography>{invoiceData.companyEmail}</Typography> */}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Bill To:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Total Due:</Typography>
                      <Typography>$12,110.55</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Bank name:</Typography>
                      <Typography>American Bank</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Country:</Typography>
                      <Typography>United States</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>IBAN:</Typography>
                      <Typography>ETD95476213874685</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>SWIFT code:</Typography>
                      <Typography>BR91905</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className='overflow-x-auto border rounded'>
              <table className={tableStyles.table}>
                <thead className='border-bs-0'>
                  <tr>
                    <th className='!bg-transparent'>Item</th>
                    <th className='!bg-transparent'>Description</th>
                    <th className='!bg-transparent'>Hours</th>
                    <th className='!bg-transparent'>Qty</th>
                    <th className='!bg-transparent'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {itemdata.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Typography color='text.primary'>{item.Item}</Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>{item.Description}</Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>{item.Hours}</Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>{item.Qty}</Typography>
                      </td>
                      <td>
                        <Typography color='text.primary'>{item.Total}</Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
              <div className='flex flex-col gap-1 order-2 sm:order-[unset]'>
                <div className='flex items-center gap-2'>
                  <Typography className='font-medium' color='text.primary'>
                    Salesperson:
                  </Typography>
                  <Typography>Tommy Shelby</Typography>
                </div>
                <Typography>Thanks for your business</Typography>
              </div>
              <div className='min-is-[200px]'>
                <div className='flex items-center justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $1800
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Discount:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $28
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Tax:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    21%
                  </Typography>
                </div>
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $1690
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider className='border-dashed' />
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Note:
              </Typography>{' '}
              It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance
              projects. Thank You!
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
