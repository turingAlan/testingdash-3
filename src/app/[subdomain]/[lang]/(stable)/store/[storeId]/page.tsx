'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'

import type { InferInput } from 'valibot'
import {
  object,
  string,
  boolean,
  array,
  optional,
  minLength,
  maxLength,
  email,
  pipe,
  nonEmpty,
  forward,
  partialCheck,
  picklist,
  regex
} from 'valibot'

import { toast } from 'react-toastify'

import { deliveryTypes, qualityCheckList, storeTypes } from '@/data/storeFlowConstants'
import { timeUnits } from '@/data/constants'
import type { CustomInputImgData } from '@/@core/components/custom-inputs/types'
import StoreForm from '@/components/store/StoreDetailsForm'
import useGetStoreDetails from '@/@core/hooks/query/useGetStoreDetails'
import StoreTimings from '@/components/store/StoreTimingsForm'
import { convertIsoToDuration } from '@/@core/utils/timeFormatHelpers'
import type { StoreDetails } from '@/types/apps/storeTypes'
import useEditStore from '@/@core/hooks/mutation/useEditStore'
import useComparePrevObj from '@/@core/hooks/useComparePrevObj'

const initialData = {
  name: '',
  description: '',
  BEmail: '',
  BPhone: '',
  refferedBy: '',
  address: {
    locality: '',
    building: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    gps: ''
  },
  industryType: '',
  GSTIN: '',
  FSSAI: '',
  pan: '',
  deliveryType: deliveryTypes.MANAGED,
  selfFulfillment: { price: '', deliveryTime: { value: '', unit: 'days' } },
  returnAllowed: false,
  returnWindow: { value: '', unit: 'days' },
  packingTime: { value: '', unit: 'days' },
  storeType: storeTypes.ECOMMERCE,
  qualityChecklist: [],
  deliveryRadius: '',
  maxBapCommission: '',
  isCod: false,
  isCancellable: false
}

export type EditStoreFormData = InferInput<typeof editStoreSchema>

const integerRegex = /^\d*$/

export type AddStoreData = {
  storeDetails: EditStoreFormData
  images: CustomInputImgData[]
}

const timeValues = [timeUnits.DAY, timeUnits.HOUR, timeUnits.MINUTE] as const
const storeTypeValues = [storeTypes.ECOMMERCE, storeTypes.QCOMMERCE] as const
const deliveryTypeValues = [deliveryTypes.MANAGED, deliveryTypes.SELF] as const

// ToDo: Abstract these scema into a storeSchema.ts file
const editStoreSchema = pipe(
  object({
    // Basic Details
    name: pipe(string(), nonEmpty('Shop name is required')),
    description: pipe(string(), nonEmpty('Description is required')),
    BEmail: pipe(string(), nonEmpty('Email is required'), email('Please enter a valid email')),
    BPhone: pipe(
      string(),
      nonEmpty('Phone number must be at least 10 digits'),
      minLength(10, 'Phone number should be 10 digits'),
      maxLength(10, 'Phone number should be 10 digits')
    ),
    refferedBy: string(),

    // Address
    address: object({
      locality: pipe(string(), nonEmpty('Locality is required')),
      building: pipe(string(), nonEmpty('Building is required')),
      street: pipe(string(), nonEmpty('Street is required')),
      city: pipe(string(), nonEmpty('City is required')),
      state: pipe(string(), nonEmpty('State is required')),
      pincode: pipe(
        string(),
        nonEmpty('Pincode must be 6 digits'),
        minLength(6, 'Pincode must be 6 digits'),
        maxLength(6, 'Pincode must be 6 digits')
      ),
      gps: pipe(string(), nonEmpty('GPS is required'))
    }),

    // Industry
    industryType: pipe(string(), nonEmpty('Industry type is required')),
    GSTIN: pipe(string(), nonEmpty('GSTIN is required')),
    FSSAI: string(),
    pan: pipe(string(), nonEmpty('PAN is required')),
    isPanVerified: optional(boolean()),
    isGstinVerified: optional(boolean()),

    deliveryType: pipe(
      string(),
      nonEmpty('Delivery type is required'),
      picklist(deliveryTypeValues, 'Store type must be E-Commerce or Q-Commerce')
    ),

    // Self Fulfillment
    selfFulfillment: object({
      price: pipe(string(), regex(integerRegex, 'Price must be a number')),
      deliveryTime: object({
        value: pipe(string(), regex(integerRegex, 'Delivery time must be a number')),
        unit: picklist(timeValues)
      })
    }),

    // Return details
    returnAllowed: boolean(),
    returnWindow: object({
      value: pipe(string(), regex(integerRegex, 'Return window must be a number')),
      unit: picklist(timeValues)
    }),

    // Packing Time
    packingTime: object({
      value: pipe(string(), nonEmpty('Packing time is required'), regex(integerRegex, 'Packing time must be a number')),
      unit: picklist(timeValues)
    }),

    // Store Type
    storeType: pipe(string(), picklist(storeTypeValues, 'Store type must be E-Commerce or Q-Commerce')),

    // Reverse Delivery Details
    qualityChecklist: array(
      object({
        key: string(),
        label: string()
      })
    ),
    deliveryRadius: pipe(string(), regex(integerRegex, 'Radius must be a number')),
    isCod: optional(boolean()),
    isCancellable: optional(boolean()),
    maxBapCommission: optional(string())
  }),
  forward(
    partialCheck(
      [['industryType'], ['FSSAI']],
      input => {
        if (input.industryType === 'F&B') {
          if (!input.FSSAI) {
            return false
          }
        }

        return true
      },
      'FSSAI is required'
    ),
    ['FSSAI']
  ),
  forward(
    partialCheck(
      [['deliveryType'], ['selfFulfillment', 'price']],
      input => {
        if (input.deliveryType === deliveryTypes.SELF) {
          if (!input.selfFulfillment.price) {
            return false
          }
        }

        return true
      },
      'Delivery Price is required'
    ),
    ['selfFulfillment', 'price']
  ),
  forward(
    partialCheck(
      [['deliveryType'], ['selfFulfillment', 'deliveryTime', 'value']],
      input => {
        if (input.deliveryType === deliveryTypes.SELF) {
          if (!input.selfFulfillment.deliveryTime.value) {
            return false
          }
        }

        return true
      },
      'Delivery time is required'
    ),
    ['selfFulfillment', 'deliveryTime', 'value']
  ),
  forward(
    partialCheck(
      [['storeType'], ['deliveryRadius']],
      input => {
        if (input.storeType === storeTypes.QCOMMERCE) {
          if (!input.deliveryRadius) {
            return false
          }
        }

        return true
      },
      'Delivery Radius is required'
    ),
    ['deliveryRadius']
  ),
  forward(
    partialCheck(
      [['returnAllowed'], ['returnWindow', 'value']],
      input => {
        if (input.returnAllowed) {
          if (!input.returnAllowed) {
            return false
          }
        }

        return true
      },
      'Return Window is required'
    ),
    ['returnWindow', 'value']
  ),
  forward(
    partialCheck(
      [['returnAllowed'], ['qualityChecklist']],
      input => {
        if (input.returnAllowed) {
          if (!input.qualityChecklist || input.qualityChecklist.length === 0) {
            return false
          }
        }

        return true
      },
      'Quality Checklist is required'
    ),
    ['qualityChecklist']
  )
)

const transformApiDataToEditSchema = (data: StoreDetails): EditStoreFormData => {
  const { value: deliveryTimeValue, unit: deliveryTimeUnit } = convertIsoToDuration(data.expected_delivery_time || '')
  const { value: returnWindowValue, unit: returnWindowUnit } = convertIsoToDuration(data.category?.return_window || '')
  const { value: packingTimeValue, unit: packingTimeUnit } = convertIsoToDuration(data.category.time_to_ship || '')

  const qualityChecks: any[] = []

  qualityCheckList.forEach(({ key, label }) => {
    if (data?.quality_checks?.[label]) {
      qualityChecks.push({
        key,
        label
      })
    }
  })

  return {
    name: data.name,
    description: data.description,
    BEmail: data.business_email,
    BPhone: data.business_mobile_number,

    refferedBy: data.reffered_by || '',
    address: data.address,
    industryType: data.category?.category_detail?.name,
    GSTIN: data.gstin,
    FSSAI: data.fssai,
    pan: data.pan_number,
    isPanVerified: data.is_pan_verified || false,
    isGstinVerified: data.is_gst_verified || false,
    deliveryType: data.fulfillment,
    selfFulfillment: {
      price: data.delivery_charge?.toString() || '',
      deliveryTime: {
        value: deliveryTimeValue?.toString() || '',
        unit: deliveryTimeUnit?.toString() || timeUnits.DAY
      }
    },
    returnAllowed: data.category.is_returnable,
    returnWindow: {
      value: returnWindowValue || '',
      unit: returnWindowUnit?.toString() || timeUnits.DAY
    },
    packingTime: {
      value: packingTimeValue?.toString() || '',
      unit: packingTimeUnit?.toString() || timeUnits.DAY
    },
    storeType: data.mode,
    qualityChecklist: qualityChecks,
    deliveryRadius: data.delivery_location?.radius ? data.delivery_location?.radius : '',
    isCod: data.category?.is_cod || false,
    isCancellable: data.category?.is_cancellable || false,
    maxBapCommission: data.bap_commission_threshold?.toString() || ''
  }
}

export default function EditStore() {
  const {
    control: editStoreController,
    getValues: getEditStoreValues,
    watch: watchEditStore,
    setValue: setEditStoreValue,
    handleSubmit: handleEditStoreSubmit,
    reset: resetEditStore,
    formState: { errors: editStoreErrors }
  } = useForm<EditStoreFormData>({
    resolver: valibotResolver(editStoreSchema),
    defaultValues: initialData
  })

  const { storeId } = useParams()

  const { data: storeData, isSuccess } = useGetStoreDetails(Array.isArray(storeId) ? storeId[0] : storeId)

  const { hasChanged: isDataFresh } = useComparePrevObj(storeData ?? {})

  // states
  const [storeImageObjects, setStoreImageObjects] = useState<CustomInputImgData[]>([])

  // Used for comparing the initial store data with the updated store data
  const [initialStoreData, setInitialStoreData] = useState<EditStoreFormData | null>(null)

  const {
    addStoreImageMutation,
    deleteStoreImageMutation,
    changeThumbnailStoreImageMutation,
    editStoreDetailMutation,
    changeStoreTimingMutation
  } = useEditStore(Array.isArray(storeId) ? storeId[0] : storeId, setStoreImageObjects)

  const { mutate: editStoreMutate } = editStoreDetailMutation
  const { mutate: addImageMutate } = addStoreImageMutation
  const { mutate: deleteImageMutate } = deleteStoreImageMutation
  const { mutate: changeThumbnailMutate } = changeThumbnailStoreImageMutation

  const handleImageUpload = (uploadedImages: CustomInputImgData[]) => {
    const imageData = uploadedImages.map(img => ({
      value: `${img.value}`,
      isSelected: storeImageObjects.length === 0,
      img: img.img
    }))

    addImageMutate(imageData)
  }

  const onSubmitEditStore: SubmitHandler<EditStoreFormData> = async (data: EditStoreFormData) => {
    editStoreMutate({ storeData: data, initialStoreData })
  }

  const handleEditFormSubmit = () => {
    return (e: any) => {
      e.preventDefault()

      if (storeImageObjects.length === 0) {
        toast.error('Please upload images')

        return
      } else if (getEditStoreValues().address.gps === '') {
        toast.error('Please select the address on the map')

        return
      }

      handleEditStoreSubmit(onSubmitEditStore)(e)
    }
  }

  // Update the form with the updated store details from the api
  useEffect(() => {
    if (isDataFresh && storeData && isSuccess) {
      const transofmedData = transformApiDataToEditSchema(storeData)

      const imageData = storeData.store_images?.map((img: any) => {
        return {
          value: `${img.id}`,
          isSelected: img?.image === storeData?.icon,
          img: img.image
        }
      })

      setStoreImageObjects(imageData)

      setInitialStoreData(transofmedData)
      resetEditStore(transofmedData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataFresh, storeData])

  return (
    <>
      <StoreForm
        handleFormSubmit={handleEditFormSubmit}
        storeImageObjects={storeImageObjects}
        handleRemoveImage={deleteImageMutate}
        handleChangeThumbnail={changeThumbnailMutate}
        handleImageUpload={handleImageUpload}
        storeForm={{
          storeController: editStoreController,
          getStoreValues: getEditStoreValues,
          watchStore: watchEditStore,
          setStoreValue: setEditStoreValue,
          storeErrors: editStoreErrors
        }}
      />
      <br />
      {/* Store Timings */}
      <StoreTimings
        key={storeData?.time?.days}
        days={storeData?.time?.days || []}
        range={storeData?.time?.range || { start: '0000', end: '2359' }}
        changeStoreTimingMutation={changeStoreTimingMutation}
      />
    </>
  )
}
