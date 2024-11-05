'use client'

import CustomTextField from '@/@core/components/mui/TextField'
import PaymentListTable from '@/views/apps/payment/PaymentListTable'

export default function payment() {
  const dummyData = [
    {
      id: 'a3152ec2-86a2-4223-b174-38ea3260809e',
      bap_order_id: '2024-10-18-990898',
      order_status: 'Pending',
      payment_amount: null,
      net_amount: 3498,
      payment_status: 'PENDING',
      payment_type: 'ON-FULFILLMENT',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: 'c085b5b0-59b4-4898-93d2-a0c6a5a33456'
    },
    {
      id: '1cfec9bf-aa3e-4b85-a6bf-9b2e512ad648',
      bap_order_id: '2024-10-18-611653',
      order_status: 'Pending',
      payment_amount: null,
      net_amount: 3508,
      payment_status: 'PENDING',
      payment_type: 'ON-FULFILLMENT',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: 'dd6e172e-a454-4919-bf1c-4e5faabfb9da'
    },
    {
      id: '1efab5a0-980a-41eb-81c2-cc8b849ce949',
      bap_order_id: '2024-10-18-224133',
      order_status: 'Completed',
      payment_amount: null,
      net_amount: 1950,
      payment_status: 'PENDING',
      payment_type: 'ON-ORDER',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: '09166700-70bd-48f8-903d-0c329d2f35b7'
    },
    {
      id: '6abcc288-c494-4fe3-a514-11a064932e72',
      bap_order_id: '2024-10-18-591542',
      order_status: 'Completed',
      payment_amount: null,
      net_amount: 2798,
      payment_status: 'PENDING',
      payment_type: 'ON-ORDER',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: 'ce295ba3-b2c5-4a77-aa67-c3bc9f0651d2'
    },
    {
      id: 'd23ffa02-b077-4d55-bcf1-48d332099d12',
      bap_order_id: '2024-10-18-934611',
      order_status: 'Pending',
      payment_amount: null,
      net_amount: 3331.42,
      payment_status: 'PENDING',
      payment_type: 'ON-ORDER',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: '230d9acf-c566-44f3-af08-0044a3d3d58b'
    },
    {
      id: 'd8b42afa-6f9e-48eb-aa45-6f04c20de277',
      bap_order_id: '2024-10-18-143240',
      order_status: 'Pending',
      payment_amount: null,
      net_amount: 3331.42,
      payment_status: 'PENDING',
      payment_type: 'ON-ORDER',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: '81d02397-13f3-4471-9f1b-3e2759003d73'
    },
    {
      id: '9b777c2b-2d1e-4e61-afe5-cf5240bb58a4',
      bap_order_id: '2024-10-18-598216',
      order_status: 'Pending',
      payment_amount: null,
      net_amount: 457.14,
      payment_status: 'PENDING',
      payment_type: 'ON-FULFILLMENT',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: '72c3dc5d-7ca4-4cb4-b14a-06be3dabe259'
    },
    {
      id: '318eb8ef-c018-4087-8109-a11aa8059c15',
      bap_order_id: '2024-10-18-914950',
      order_status: 'Pending',
      payment_amount: null,
      net_amount: 457.14,
      payment_status: 'PENDING',
      payment_type: 'ON-FULFILLMENT',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: 'a0961b57-e83e-458d-918d-52e8c73be96b'
    },
    {
      id: '99687a20-0be6-43ee-a337-72036722f86d',
      bap_order_id: '2024-10-18-766012',
      order_status: 'Processing',
      payment_amount: null,
      net_amount: 595.48,
      payment_status: 'PENDING',
      payment_type: 'ON-ORDER',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: '1ca27cf8-8f71-4ae1-86e1-42742c36cf0e'
    },
    {
      id: '413b2d1f-3a33-4038-977f-2a47ac8c5645',
      bap_order_id: '2024-10-17-208195',
      order_status: 'Cancelled',
      payment_amount: null,
      net_amount: 0,
      payment_status: 'PENDING',
      payment_type: 'ON-ORDER',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: 'af621235-9c73-4ad4-afd5-eaac54be0d7b'
    },
    {
      id: '9ab584bb-03a1-4399-8b1a-be9b8cb81118',
      bap_order_id: '2024-10-16-260902',
      order_status: 'Pending',
      payment_amount: null,
      net_amount: 1625,
      payment_status: 'PENDING',
      payment_type: 'ON-FULFILLMENT',
      payment_received_on: null,
      tax_deduction_json: {
        tcs: 0.005,
        tds: 0.001
      },
      order: '9aa63657-2e7b-4027-872f-5e9f7547eab1'
    }
  ]

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between'>
        <div className='flex gap-2 items-center'>
          <h2>Payments</h2>
        </div>
        <div>
          <CustomTextField placeholder='Search by order id' />
        </div>
      </div>
      <PaymentListTable paymentData={dummyData} />
    </div>
  )
}
