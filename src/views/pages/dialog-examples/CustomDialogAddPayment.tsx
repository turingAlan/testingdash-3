// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { ButtonProps } from '@mui/material/Button'

// Component Imports
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import AddPaymentCard from '@/components/dialogs/add-payment-card'
import PaymentMethodCard from '@/components/payment-method-card'
import { useEssentialDataStore } from '@/@core/stores'

const CustomDialogAddPayment = () => {
  // Hooks
  const { paymentDetails } = useEssentialDataStore()

  const currentPaymentMethod = paymentDetails?.find(payment => payment.is_default)

  // Vars
  const buttonProps: ButtonProps = {
    variant: 'contained',
    children: 'Add Payment Method'
  }

  return (
    <>
      <Card id='addPayment'>
        <CardContent className='flex flex-col items-center text-center gap-4'>
          <i className='tabler-credit-card text-[34px] text-textPrimary' />
          {currentPaymentMethod ? (
            <>
              <Typography variant='h5'>Current Payment Method</Typography>
              <PaymentMethodCard paymentDetail={currentPaymentMethod} />
              <Typography color='text.primary'>
                This payment method will be used in all stores created by user!
              </Typography>
            </>
          ) : (
            <Typography variant='h5'>No Payment Method Added</Typography>
          )}
          <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={AddPaymentCard} />
        </CardContent>
      </Card>
    </>
  )
}

export default CustomDialogAddPayment
