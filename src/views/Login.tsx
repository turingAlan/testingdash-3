'use client'

// React Imports
import type { SyntheticEvent } from 'react'
import { useState } from 'react'

// Next Imports
import { useParams, useSearchParams } from 'next/navigation'

import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// MUI Imports
import Button from '@mui/material/Button'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'

import Divider from '@mui/material/Divider'

// Third-party Imports
import classnames from 'classnames'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'
import { email, maxLength, minLength, nonEmpty, object, pipe, regex, string } from 'valibot'

// Type Imports
import type { SystemMode } from '@core/types'

import type { Locale } from '@configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import useGoogleLoginPopup from '@core/hooks/useGoogleLogin'
import { useSettings } from '@core/hooks/useSettings'
import Link from '@/components/Link'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import useLogin from '@core/hooks/mutation/useLogin'
import type { LoginMethodType } from '@/types/apps/loginTypes'
import TwoFactorOtpAuth from '@/components/dialogs/two-factor-otp-auth'
import useOtp from '@core/hooks/mutation/useOtp'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
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
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type ErrorType = {
  message: string[]
}

type EmailFormData = InferInput<typeof emailSchema>
type PhoneFormData = InferInput<typeof phoneSchema>

// Regular expressions for validation
const phoneRegex = /^[0-9]{10}$/
const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/

const emailSchema = object({
  email: pipe(string('Email is required'), nonEmpty('Email is required'), email("Email isn't valid")),
  password: pipe(
    string('password is required'),
    nonEmpty('password is required'),
    minLength(6, "Password isn't valid"),
    regex(passwordRegex, "password isn't valid")
  )
})

const phoneSchema = object({
  phone: pipe(
    string('Phone number is required'),
    nonEmpty('Phone number is required'),
    minLength(10, 'Phone number must be 10 digits long'),
    maxLength(10, 'Phone number must be 10 digits long'),
    regex(phoneRegex, 'Phone number whould only contain numbers')
  )
})

const Login = ({ mode }: { mode: SystemMode }) => {
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get('redirectTo')
    ? decodeURIComponent(searchParams.get('redirectTo') as string)
    : null

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Set this error state to something other than null to show the error message
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [loginMethod, setLoginMethod] = useState<LoginMethodType>('phone_login')
  const [isPhoneVerifying, setIsPhoneVerifying] = useState<boolean>(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const { handleGoogleLogin, isLoading: isGoogleLoginLoading } = useGoogleLoginPopup()

  // mutation hooks
  const { mutate: loginMutate, isPending: isPhoneEmailLoading } = useLogin()
  const { getOtp, verifyOtpLogin } = useOtp(setIsPhoneVerifying)
  const { mutate: getOtpMutate } = getOtp
  const { mutate: verifyOtpMutate } = verifyOtpLogin

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailFormErrors }
  } = useForm<EmailFormData>({
    resolver: valibotResolver(emailSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneFormErrors },
    getValues
  } = useForm<PhoneFormData>({
    resolver: valibotResolver(phoneSchema),
    defaultValues: {
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

  const handleExpandChange = (method: LoginMethodType) => (event: SyntheticEvent, isExpanded: boolean) => {
    setLoginMethod(isExpanded ? method : method === 'email_login' ? 'phone_login' : 'email_login')
  }

  const onSubmitEmail: SubmitHandler<EmailFormData> = async (data: EmailFormData) => {
    loginMutate({
      method: loginMethod,
      email: data.email,
      password: data.password
    })
  }

  const onSubmitPhone: SubmitHandler<PhoneFormData> = async (data: PhoneFormData) => {
    getOtpMutate(data.phone)
  }

  const handleFormSubmit = () => {
    if (loginMethod === 'phone_login') {
      return handlePhoneSubmit(onSubmitPhone)
    }

    return handleEmailSubmit(onSubmitEmail)
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
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1 text-center'>
            <Typography variant='h3'>
              {`Your`} <span className='text-primary'>Guide</span> {`In India's Biggest E-Commerce Revolution`}
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleFormSubmit()} className='flex flex-col gap-6'>
            {/* phone login */}
            <Accordion expanded={loginMethod === 'phone_login'} onChange={handleExpandChange('phone_login')}>
              <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
                <Typography>Login with phone</Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails className='flex flex-col gap-6 !px-3 !py-4'>
                <Controller
                  name='phone'
                  control={phoneControl}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      autoFocus
                      fullWidth
                      type='tel'
                      label='Phone'
                      placeholder='Enter your phone'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((phoneFormErrors.phone || errorState !== null) && {
                        error: true,
                        helperText: phoneFormErrors?.phone?.message || errorState?.message[0]
                      })}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>+91</InputAdornment>
                      }}
                    />
                  )}
                />
              </AccordionDetails>
            </Accordion>

            {/* email login */}
            <Accordion expanded={loginMethod === 'email_login'} onChange={handleExpandChange('email_login')}>
              <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
                <Typography>Login with email</Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails className='flex flex-col gap-6 !px-3 !py-4'>
                <Controller
                  name='email'
                  control={emailControl}
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
                      {...((emailFormErrors.email || errorState !== null) && {
                        error: true,
                        helperText: emailFormErrors?.email?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
                <Controller
                  name='password'
                  control={emailControl}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Password'
                      placeholder='············'
                      id='login-password'
                      type={isPasswordShown ? 'text' : 'password'}
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowPassword}
                              onMouseDown={e => e.preventDefault()}
                            >
                              <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      {...(emailFormErrors.password && { error: true, helperText: emailFormErrors.password.message })}
                    />
                  )}
                />
                <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                  <Typography
                    className='text-end'
                    color='primary'
                    component={Link}
                    href={getLocalizedUrl('/forgot-password', locale as Locale)}
                  >
                    Forgot password?
                  </Typography>
                </div>
              </AccordionDetails>
            </Accordion>
            <Button fullWidth variant='contained' type='submit' disabled={isPhoneEmailLoading}>
              Login
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/register', locale as Locale)} color='primary'>
                Create an account
              </Typography>
            </div>
            <Divider className='gap-2'>or</Divider>
            <Button
              color='secondary'
              className='self-center text-textPrimary'
              startIcon={<img src='/images/logos/google.png' alt='Google' width={22} />}
              sx={{ '& .MuiButton-startIcon': { marginInlineEnd: 3 } }}
              disabled={isGoogleLoginLoading}
              onClick={() => handleGoogleLogin()}
            >
              Sign in with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
