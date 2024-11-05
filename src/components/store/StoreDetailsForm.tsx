import Link from 'next/link'

import { useParams, useSearchParams } from 'next/navigation'

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'

import { Controller } from 'react-hook-form'

import useEssentialData from '@/@core/hooks/query/useEssentialData'

import CustomTextField from '@/@core/components/mui/TextField'
import CustomFileUploader from '@/@core/components/custom-fill-uploader/CustomFileUploader'
import MapComponent from '@/components/MapComponent'
import CustomCheckboxImageSelect from '@/@core/components/custom-checkbox-image-select/CustomCheckboxImageSelect'
import CustomMultiAutoCompleteInput from '@/@core/components/custom-multi-autocomplete/CustomMultiAutoCompleteInput'
import CustomMainDeliveryTypeSelectRadio from '@/@core/components/custom-delivery-type-select-radio/CustomDeliveryTypeSelectRadio'
import { deliveryTypes, qualityCheckList, storeTypes } from '@/data/storeFlowConstants'
import { timeUnits } from '@/data/constants'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'
import type { CustomInputImgData } from '@/@core/components/custom-inputs/types'
import { useEssentialDataStore } from '@/@core/stores'

interface StoreFormProps {
  handleFormSubmit: () => (e: React.FormEvent<HTMLFormElement>) => void
  handleImageUpload: (files: CustomInputImgData[]) => void
  handleRemoveImage: (index: string) => void
  handleChangeThumbnail: (index: string) => void
  storeImageObjects: CustomInputImgData[]
  storeForm: any
}

const StoreForm = (props: StoreFormProps) => {
  const {
    handleFormSubmit,
    handleImageUpload,
    handleRemoveImage,
    handleChangeThumbnail,
    storeImageObjects,
    storeForm
  } = props

  // Hooks
  const { allCategories, organizationData } = useEssentialDataStore()

  const searchParams = useSearchParams()
  const { storeId, lang: locale } = useParams()

  // Parent store id of the warehouse
  const wareHouseStoreId = searchParams?.get('warehouseStoreId')

  // Check if the store details is being edited
  const isStoreEdit = !!storeId

  // Check if adding warehouse to the store
  const isStoreWareHouse = !!wareHouseStoreId

  return (
    <form onSubmit={handleFormSubmit()}>
      <div className='flex flex-wrap items-center justify-between gap-6'>
        <div>
          <Typography variant='h4' className='mbe-1'>
            {isStoreEdit ? 'Edit Details' : isStoreWareHouse ? 'Add Warehouse' : 'Add Store'}
          </Typography>
        </div>
        <Button variant='contained' type='submit' startIcon={<i className='tabler-arrow-big-up-filled' />}>
          {isStoreEdit ? 'Save Details' : 'Publish Store'}
        </Button>
      </div>
      <br />
      <Card>
        <CardContent>
          <Typography variant='h4'>Basic Details</Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='name'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus={!isStoreEdit}
                    fullWidth
                    label='Shop Name'
                    placeholder='Diamond Store'
                    disabled={isStoreWareHouse}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.name && {
                      error: true,
                      helperText: storeForm.storeErrors?.name?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='description'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Shop Description'
                    placeholder='We sell jewels here'
                    disabled={isStoreEdit}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.description && {
                      error: true,
                      helperText: storeForm.storeErrors?.description?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='BEmail'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Business Email'
                    placeholder='jewel@jewel.com'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.BEmail && {
                      error: true,
                      helperText: storeForm.storeErrors?.BEmail?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='BPhone'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='tel'
                    label='Business Phone'
                    placeholder='2121212121'
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>+91</InputAdornment>
                    }}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.BPhone && {
                      error: true,
                      helperText: storeForm.storeErrors?.BPhone?.message
                    })}
                  />
                )}
              />
            </Grid>

            {/* only shown if the user is tsp */}
            <Grid item xs={12} sm={12} className={`${organizationData?.is_tsp ? 'block' : 'hidden'}`}>
              <Controller
                name='refferedBy'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='Reffered By'
                    placeholder='Ruby Store'
                    disabled={isStoreEdit}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.refferedBy && {
                      error: true,
                      helperText: storeForm.storeErrors?.refferedBy?.message
                    })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <br />
      <Card>
        <CardContent>
          <Typography variant='h4'>Images</Typography>
          <br />
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
              <CustomFileUploader
                maxFiles={6}
                maxSize={2000000}
                acceptedTypes={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
                onUpload={handleImageUpload}
                disabled={isStoreWareHouse}
              />
            </Grid>
            <br />
            <Grid item xs={12} sm={12}>
              <CustomCheckboxImageSelect
                imageObjects={storeImageObjects}
                handleRemoveImage={handleRemoveImage}
                handleChangeThumbnail={handleChangeThumbnail}
                disabled={isStoreWareHouse}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <br />
      {/* 4km > immediate else same day */}

      <Card>
        <CardContent>
          <Grid container>
            <Typography variant='h4'>Address</Typography>
            {isStoreEdit && !!storeId && (
              <Link
                href={getLocalizedUrl(`/addstore?warehouseStoreId=${storeId}`, locale as Locale)}
                className='ms-auto'
              >
                <Button endIcon={<i className='tabler-building-warehouse' />}>Create WareHouse</Button>
              </Link>
            )}
          </Grid>
          <br />
          <Grid container>
            <Grid item xs={12} sm={12}>
              <MapComponent
                setMapSelectedOnce={() => {}}
                setValue={storeForm.setStoreValue}
                disabled={isStoreEdit}
                containerStyle={{ height: '250px', width: '100%' }}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container>
            <Grid item xs={12} sm={12}>
              <Controller
                name='address.locality'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isStoreEdit}
                    label='Locality'
                    placeholder='Tilak Nagar, 97, Connaught Place'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.address?.locality && {
                      error: true,
                      helperText: storeForm.storeErrors?.address?.locality?.message
                    })}
                  />
                )}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Controller
                name='address.building'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isStoreEdit}
                    label='Building'
                    placeholder='135 A Block'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.address?.building && {
                      error: true,
                      helperText: storeForm.storeErrors?.address?.building?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='address.street'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isStoreEdit}
                    label='Street'
                    placeholder='Purana Qila Road Area'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.address?.street && {
                      error: true,
                      helperText: storeForm.storeErrors?.address?.street?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='address.city'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isStoreEdit}
                    label='City'
                    placeholder='New Delhi'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.address?.city && {
                      error: true,
                      helperText: storeForm.storeErrors?.address?.city?.message
                    })}
                  />
                )}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='address.state'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isStoreEdit}
                    label='State'
                    placeholder='Delhi'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.address?.state && {
                      error: true,
                      helperText: storeForm.storeErrors?.address?.state?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='address.pincode'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isStoreEdit}
                    label='Pincode'
                    placeholder='110001'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.address?.pincode && {
                      error: true,
                      helperText: storeForm.storeErrors?.address?.pincode?.message
                    })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <br />
      <Card>
        <CardContent>
          <Typography variant='h4'>Industry</Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='industryType'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    disabled={isStoreEdit}
                    label='Industry Type'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.industryType && {
                      error: true,
                      helperText: storeForm.storeErrors?.industryType?.message
                    })}
                  >
                    <MenuItem value=''>Select Category</MenuItem>
                    {allCategories.map(category => (
                      <MenuItem value={category} key={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='GSTIN'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Enter GSTIN Number'
                    placeholder='234234ASDR2344'
                    disabled={isStoreEdit}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position='end'
                          className={storeForm.getStoreValues().isGstinVerified ? 'text-green-600' : 'text-red-600'}
                        >
                          {isStoreEdit ? (storeForm.getStoreValues().isGstinVerified ? 'Verified' : 'Verifying') : ''}
                        </InputAdornment>
                      )
                    }}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.GSTIN && {
                      error: true,
                      helperText: storeForm.storeErrors?.GSTIN?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='FSSAI'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Enter FSSAI Number'
                    placeholder='FSSAI Number'
                    key={storeForm.getStoreValues().industryType}
                    disabled={
                      (storeForm.watchStore('industryType') !== 'Grocery' &&
                        storeForm.watchStore('industryType') !== 'F&B') ||
                      isStoreEdit
                    }
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.FSSAI && {
                      error: true,
                      helperText: storeForm.storeErrors?.FSSAI?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='pan'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={isStoreEdit}
                    label='Enter PAN Number'
                    placeholder='ACDER2343WE'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position='end'
                          className={storeForm.getStoreValues().isPanVerified ? 'text-green-600' : 'text-red-600'}
                        >
                          {isStoreEdit ? (storeForm.getStoreValues().isPanVerified ? 'Verified' : 'Verifying') : ''}
                        </InputAdornment>
                      )
                    }}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.pan && {
                      error: true,
                      helperText: storeForm.storeErrors?.pan?.message
                    })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <br />
      <Card>
        <CardContent>
          <Typography variant='h4'>Shiping and Returns</Typography>
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12}>
              <Controller
                name='deliveryType'
                control={storeForm.storeController}
                render={({ field }) => <CustomMainDeliveryTypeSelectRadio {...field} />}
              />
            </Grid>
            <Grid item container xs={12} sm={6} direction={'column'} spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  label='Allow Returns'
                  control={
                    <Controller
                      name='returnAllowed'
                      control={storeForm.storeController}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          onChange={e => {
                            field.onChange(e.target.checked)
                          }}
                        />
                      )}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='selfFulfillment.price'
                  control={storeForm.storeController}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Delivery Price'
                      disabled={storeForm.watchStore('deliveryType') === deliveryTypes.MANAGED}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>₹</InputAdornment>
                      }}
                      onChange={e => {
                        field.onChange(e)
                      }}
                      {...(storeForm.storeErrors.selfFulfillment?.price && {
                        error: true,
                        helperText: storeForm.storeErrors.selfFulfillment?.price?.message
                      })}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='h6'>Store Type</Typography>
              <Controller
                name='storeType'
                control={storeForm.storeController}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    name='radio-buttons-group-delivery'
                    aria-labelledby='global-delivery-radio-buttons-group-label'
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    <FormControlLabel
                      value={storeTypes.ECOMMERCE}
                      label='E-Commerce'
                      control={<Radio className='self-start' />}
                    />
                    <FormControlLabel
                      value={storeTypes.QCOMMERCE}
                      label='Q-Commerce'
                      control={<Radio className='self-start' />}
                    />
                  </RadioGroup>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='packingTime.value'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Expected Packing Time (Value)'
                    placeholder=''
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.packingTime?.value && {
                      error: true,
                      helperText: storeForm.storeErrors?.packingTime.value?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='packingTime.unit'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Expected Packing Time (Unit)'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                  >
                    <MenuItem value={timeUnits.DAY}>Days</MenuItem>
                    <MenuItem value={timeUnits.HOUR}>Hours</MenuItem>
                    <MenuItem value={timeUnits.MINUTE}>Minutes</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='returnWindow.value'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Return Window (Value)'
                    placeholder=''
                    disabled={!storeForm.watchStore('returnAllowed')}
                    onChange={e => {
                      field.onChange(e)
                    }}
                    {...(storeForm.storeErrors.returnWindow?.value && {
                      error: true,
                      helperText: storeForm.storeErrors?.returnWindow?.value?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='returnWindow.unit'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Return Window (Unit)'
                    disabled
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                  >
                    <MenuItem value={timeUnits.DAY}>Days</MenuItem>
                    <MenuItem value={timeUnits.HOUR}>Hours</MenuItem>
                    <MenuItem value={timeUnits.MINUTE}>Minutes</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='selfFulfillment.deliveryTime.value'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Delivery Time (Value)'
                    placeholder=''
                    disabled={storeForm.watchStore('deliveryType') === deliveryTypes.MANAGED}
                    onChange={e => {
                      field.onChange(e)
                    }}
                    {...(storeForm.storeErrors.selfFulfillment?.deliveryTime?.value && {
                      error: true,
                      helperText: storeForm.storeErrors?.selfFulfillment.deliveryTime?.value?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='selfFulfillment.deliveryTime.unit'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Delivery Time (Unit)'
                    disabled={storeForm.watchStore('deliveryType') === deliveryTypes.MANAGED}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                  >
                    <MenuItem value={timeUnits.DAY}>Days</MenuItem>
                    <MenuItem value={timeUnits.HOUR}>Hours</MenuItem>
                    <MenuItem value={timeUnits.MINUTE}>Minutes</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h4'>Reverse Delivery Details</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='qualityChecklist'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomMultiAutoCompleteInput
                    options={qualityCheckList}
                    disabled={!storeForm.watchStore('returnAllowed')}
                    {...field}
                    {...(storeForm.storeErrors.qualityChecklist && {
                      error: true,
                      helperText: storeForm.storeErrors?.qualityChecklist?.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='deliveryRadius'
                control={storeForm.storeController}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Delivery Radius'
                    placeholder='In KM'
                    disabled={storeForm.watchStore('storeType') === storeTypes.ECOMMERCE}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    {...(storeForm.storeErrors.deliveryRadius && {
                      error: true,
                      helperText: storeForm.storeErrors?.deliveryRadius?.message
                    })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container justifyContent='flex-start' className='mt-2 ms-2'>
        <Button variant='contained' type='submit' startIcon={<i className='tabler-arrow-big-up-filled' />}>
          {isStoreEdit ? 'Save Details' : 'Publish Store'}
        </Button>
      </Grid>
    </form>
  )
}

export default StoreForm
