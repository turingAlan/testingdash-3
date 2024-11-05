'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import useProfile from '@/@core/hooks/mutation/useProfile'
import { useEssentialDataStore } from '@/@core/stores'
import useLogout from '@/@core/hooks/useLogout'

const CustomAccountDetails = () => {
  // Hooks
  const { profileData } = useEssentialDataStore()
  const { logout } = useLogout()

  // States
  const [nameData, setNameData] = useState({
    firstName: profileData?.first_name || '',
    lastName: profileData?.last_name || '',
    email: profileData?.email || '',
    phoneNumber: profileData?.phone || ''
  })

  const [isEditable, setIsEditable] = useState(false)

  const { mutate: profileMutate, isError, isSuccess } = useProfile(profileData?.id ?? '')

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNameData({ ...nameData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    profileMutate({ firstName: nameData.firstName, lastName: nameData.lastName })
  }

  useEffect(() => {
    if (isError || isSuccess) {
      setIsEditable(false)
      setNameData({
        firstName: profileData?.first_name || '',
        lastName: profileData?.last_name || '',
        email: profileData?.email || '',
        phoneNumber: profileData?.phone || ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.first_name, profileData?.last_name, profileData?.email, profileData?.phone])

  return (
    <Card>
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='First Name'
                value={nameData.firstName}
                placeholder='John'
                name='firstName'
                onChange={handleChangeInput}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Last Name'
                value={nameData.lastName}
                placeholder='Doe'
                name='lastName'
                onChange={handleChangeInput}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                value={nameData.email}
                placeholder='john.doe@gmail.com'
                name='email'
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Phone Number'
                disabled
                value={nameData.phoneNumber}
                placeholder='9119044444'
                name='phoneNumber'
              />
            </Grid>
            <Grid item xs={12} className='flex flex-wrap justify-between'>
              <div className='flex gap-4'>
                {isEditable ? (
                  <Button color='primary' variant='contained' onClick={handleSave} className='is-full sm:is-auto'>
                    Save
                  </Button>
                ) : (
                  <Button
                    color='primary'
                    variant='contained'
                    onClick={() => setIsEditable(true)}
                    className='sm:is-auto'
                  >
                    Edit
                  </Button>
                )}
              </div>
              <Button
                color='error'
                variant='contained'
                startIcon={<i className='tabler-logout' />}
                onClick={logout}
                className='sm:is-auto'
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CustomAccountDetails
