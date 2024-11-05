import React from 'react'

import { useForm, Controller } from 'react-hook-form'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField' // Assuming CustomTextField is a component you have created
import usePaymentMethod from '@/@core/hooks/mutation/usePaymentMethod'
import type { AddPaymentMethodForm } from '@/types/apps/profileTypes'

interface PaymentDialogProps {
  open: boolean
  setOpen: any
}

const AddPaymentDialog: React.FC<PaymentDialogProps> = ({ open, setOpen }) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<AddPaymentMethodForm>({
    defaultValues: {
      accountHolderName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      bankName: '',
      branch: '',
      IFSCCode: '',
      UPIId: ''
    }
  })

  const { mutate: paymentMethodMutate } = usePaymentMethod()

  const accountNumber = watch('accountNumber')

  const onSubmit = (formData: AddPaymentMethodForm) => {
    paymentMethodMutate(formData)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflowX: 'visible', overflowY: 'auto' } }}
    >
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add New Payment Method
        <Typography component='span' className='flex flex-col text-center'>
          Add payment details for future billings
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 p-6 sm:pli-16'>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Controller
                name='accountHolderName'
                control={control}
                rules={{ required: 'Account Holder Name is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Account Holder Name'
                    placeholder='First Name Last Name'
                    error={!!errors.accountHolderName}
                    helperText={errors.accountHolderName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='accountNumber'
                control={control}
                rules={{
                  required: 'Account Number is required',
                  pattern: {
                    value: /^\d{16}$/,
                    message: 'Account Number must be 16 digits'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Account Number'
                    placeholder='0000 0000 0000 0000'
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='confirmAccountNumber'
                control={control}
                rules={{
                  required: 'Please confirm your account number',
                  validate: value => value === accountNumber || 'Account numbers do not match'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Confirm Account Number'
                    placeholder='0000 0000 0000 0000'
                    error={!!errors.confirmAccountNumber}
                    helperText={errors.confirmAccountNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='bankName'
                control={control}
                rules={{ required: 'Bank Name is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Bank Name'
                    placeholder='SBI'
                    error={!!errors.bankName}
                    helperText={errors.bankName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='branch'
                control={control}
                rules={{ required: 'Branch is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Branch'
                    placeholder='Connaught Place'
                    error={!!errors.branch}
                    helperText={errors.branch?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Controller
                name='IFSCCode'
                control={control}
                rules={{
                  required: 'IFSC Code is required',
                  pattern: {
                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: 'Invalid IFSC Code format'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='IFSC Code'
                    placeholder='SBI0000000'
                    error={!!errors.IFSCCode}
                    helperText={errors.IFSCCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Controller
                name='UPIId'
                control={control}
                rules={{
                  pattern: {
                    value: /^[\w.-]+@[a-zA-Z]+$/,
                    message: 'Invalid UPI ID format'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='UPI ID'
                    placeholder='name@sbiyono'
                    error={!!errors.UPIId}
                    helperText={errors.UPIId?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 p-6 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button
            variant='tonal'
            type='reset'
            color='secondary'
            onClick={() => {
              reset()
              handleClose()
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddPaymentDialog
