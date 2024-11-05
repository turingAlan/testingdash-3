'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { InferInput } from 'valibot'
import {
  boolean,
  custom,
  email,
  forward,
  maxLength,
  minLength,
  nonEmpty,
  object,
  partialCheck,
  pipe,
  regex,
  string
} from 'valibot'

import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import type { SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

import TwoFactorOtpAuth from '@/components/dialogs/two-factor-otp-auth'
import useOtp from '@/@core/hooks/mutation/useOtp'
import useRegister from '@/@core/hooks/mutation/useRegister'

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 345,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

interface PhoneVerifyEvent extends React.MouseEvent<HTMLButtonElement> {}
type ErrorType = {
  message: string[]
}

type RegisterFormData = InferInput<typeof registrationSchema>

// Regular expressions for validation
const phoneRegex = /^[0-9]{10}$/
const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/
const nameRegex = /^[a-zA-Z ]+$/

const registrationSchema = pipe(
  object({
    firstName: pipe(
      string(),
      nonEmpty('First name is required'),
      regex(nameRegex, 'First name should only contain letters')
    ),

    lastName: pipe(
      string(),
      nonEmpty('Last name is required'),
      regex(nameRegex, 'Last name should only contain letters')
    ),

    email: pipe(string(), nonEmpty('Email is required'), email('Email is invalid')),

    password: pipe(
      string(),
      nonEmpty('Please enter your password.'),
      minLength(6, 'Password must be at least 6 characters long'),
      regex(
        passwordRegex,
        'Password must contain at least 6 characters, one special character, one number, and one letter'
      )
    ),

    confirmPassword: pipe(string(), nonEmpty('Please confirm your password.')),

    phone: pipe(
      string(),
      nonEmpty('Phone number is required'),
      minLength(10, 'Phone number must be 10 digits long'),
      maxLength(10, 'Phone number must be 10 digits long'),
      regex(phoneRegex, 'Phone number should only contain numbers')
    ),

    privacy: pipe(
      boolean(),
      custom(value => value === true, 'Please agree to the privacy policy and terms')
    )
  }),
  forward(
    partialCheck(
      [['password'], ['confirmPassword']],
      input => input.password === input.confirmPassword,
      'The two passwords do not match.'
    ),
    ['confirmPassword']
  )
)

const Register = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isPhoneVerifying, setIsPhoneVerifying] = useState<boolean>(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  // Hooks
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  /// mutation hooks
  const { getOtp, verifyOtpRegister, isPhoneVerified, setIsPhoneVerified } = useOtp(setIsPhoneVerifying)
  const { mutate: getOtpMutate } = getOtp
  const { mutate: verifyOtpMutate } = verifyOtpRegister
  const { mutate: registerMutate } = useRegister()

  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    trigger: registerTrigger,
    getValues,
    formState: { errors: registerFormErrors }
  } = useForm<RegisterFormData>({
    resolver: valibotResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    }
  })

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const onSubmitRegister: SubmitHandler<RegisterFormData> = async (data: RegisterFormData) => {
    const { privacy, ...restPayload } = data

    if (!privacy) return

    registerMutate(restPayload)
  }

  const handleOnClickPhoneVerify = async (e: PhoneVerifyEvent): Promise<any> => {
    e.preventDefault()

    const isPhoneValid = await registerTrigger('phone')

    if (isPhoneValid) {
      const phoneNumber = getValues('phone')

      getOtpMutate(phoneNumber)
    }
  }

  const handleFormSubmit = () => {
    return (e: any) => {
      e.preventDefault()

      if (!getValues().privacy) {
        toast.error('Please agree to the privacy policy and terms')

        return
      }

      handleRegisterSubmit(onSubmitRegister)(e)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <TwoFactorOtpAuth
        open={isPhoneVerifying}
        setOpen={setIsPhoneVerifying}
        handleVerify={verifyOtpMutate}
        handleResendOtp={getOtpMutate}
        sendTo={getValues('phone')}
      />
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <RegisterIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Adventure starts here 🚀</Typography>
            <Typography>Make your app management easy and fun!</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleFormSubmit()} className='flex flex-col gap-6'>
            <div className='flex gap-4'>
              <Controller
                name='firstName'
                control={registerControl}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='First Name'
                    placeholder='Enter first name'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((registerFormErrors.firstName || errorState !== null) && {
                      error: true,
                      helperText: registerFormErrors?.firstName?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
              <Controller
                name='lastName'
                control={registerControl}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='Last Name'
                    placeholder='Enter last name'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((registerFormErrors.lastName || errorState !== null) && {
                      error: true,
                      helperText: registerFormErrors?.lastName?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </div>
            <Controller
              name='email'
              control={registerControl}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='Enter your email'
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((registerFormErrors.email || errorState !== null) && {
                    error: true,
                    helperText: registerFormErrors?.email?.message || errorState?.message[0]
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={registerControl}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='register-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(registerFormErrors.password && { error: true, helperText: registerFormErrors.password.message })}
                />
              )}
            />
            <Controller
              name='confirmPassword'
              control={registerControl}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Confirm Password'
                  placeholder='············'
                  id='register-confirm-password'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(registerFormErrors.confirmPassword && {
                    error: true,
                    helperText: registerFormErrors.confirmPassword.message
                  })}
                />
              )}
            />
            <Controller
              name='phone'
              control={registerControl}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type='tel'
                  label='Phone'
                  placeholder='Enter your phone'
                  className='!rounded-s-none'
                  onChange={e => {
                    field.onChange(e.target.value)
                    setIsPhoneVerified(false)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((registerFormErrors.phone || errorState !== null) && {
                    error: true,
                    helperText: registerFormErrors?.phone?.message || errorState?.message[0]
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>+91</InputAdornment>,
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          color={isPhoneVerified ? 'success' : 'warning'}
                        >
                          <i className={isPhoneVerified ? 'tabler-lock-check' : 'tabler-lock-x '} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <Controller
              name='privacy'
              control={registerControl}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={e => {
                        field.onChange(e.target.checked)
                      }}
                    />
                  }
                  label={
                    <>
                      <span>I agree to </span>
                      <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                        privacy policy & terms
                      </Link>
                    </>
                  }
                />
              )}
            />

            {isPhoneVerified ? (
              <Button fullWidth variant='contained' type='submit'>
                Sign Up
              </Button>
            ) : (
              <Button fullWidth variant='contained' onClick={handleOnClickPhoneVerify} disabled={isPhoneVerifying}>
                Verify Phone
              </Button>
            )}
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/login', locale as Locale)} color='primary'>
                Sign in instead
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
