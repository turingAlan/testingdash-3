'use client'

// React Imports

import { useEffect, useState } from 'react'

import Link from 'next/link'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

interface HandleOtpVerifyEvent extends React.FormEvent<HTMLFormElement> {}
interface ResendOtpEvent extends React.MouseEvent<HTMLAnchorElement, MouseEvent> {}

type TwoFactorAuthProps = {
  open: boolean
  setOpen: (open: boolean) => void
  handleVerify: (otp: string) => void
  handleResendOtp?: (sendTo: string) => void
  sendTo: string
}

const TwoFactorOtpAuth = ({ open, setOpen, handleVerify, sendTo, handleResendOtp }: TwoFactorAuthProps) => {
  const handleClose = () => {
    setOpen(false)
  }

  const resendOtp = (e: ResendOtpEvent) => {
    e.preventDefault()

    if (handleResendOtp) {
      handleResendOtp(sendTo)
    }
  }

  const handleOtpSubmit = (e: HandleOtpVerifyEvent) => {
    e.preventDefault()
    const otpString = otp.join('')

    handleVerify(otpString)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp]

      newOtp[index] = value
      setOtp(newOtp)

      // Move to the next input field if a digit is entered
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`)

        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement

    if (e.key === 'Backspace' && !target.value && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`)

      prevInput?.focus()
    }
  }

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))

  // Reset the OTP input fields when the dialog is reopened
  useEffect(() => {
    if (open) {
      setOtp(Array(6).fill(''))
    }
  }, [open])

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='sm'
        scroll='body'
        open={open}
        onClose={() => setOpen(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          Two Step Verification 💬
          <Typography component='span' className='flex flex-col text-center'>
            We sent a verification code to your mobile {sendTo || ''}. Enter the code in the field below.
          </Typography>
        </DialogTitle>
        <DialogContent className='pbs-0 sm:pli-16'>
          <div className='flex justify-center mbe-6'></div>
          <form noValidate autoComplete='off' onSubmit={handleOtpSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <Typography>Type your 6 digit security code</Typography>
              <div className='flex items-center justify-between gap-4'>
                {otp.map((digit, index) => (
                  <CustomTextField
                    id={`otp-input-${index}`}
                    key={index}
                    size='medium'
                    autoFocus={index === 0} // Auto-focus on the first input
                    className='[&_input]:text-center'
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)} // Handle input change
                    onKeyDown={e => handleKeyDown(index, e)} // Handle backspace
                    inputProps={{ maxLength: 1 }} // Ensure only one character per field
                  />
                ))}
              </div>
            </div>
            <Button fullWidth variant='contained' type='submit'>
              Verify Code
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Didn&#39;t get the code?</Typography>
              <Typography color='primary' component={Link} href='#' onClick={e => resendOtp(e)}>
                Resend
              </Typography>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TwoFactorOtpAuth
