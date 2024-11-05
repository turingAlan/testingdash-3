'use client'

import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

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
import useAddStore from '@/@core/hooks/mutation/useAddStore'
import StoreForm from '@/components/store/StoreDetailsForm'
import { useEssentialDataStore } from '@/@core/stores'
import type { StoreDetails } from '@/types/apps/storeTypes'
import { convertIsoToDuration } from '@/@core/utils/timeFormatHelpers'

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
  packingTime: { value: '10', unit: 'days' },
  storeType: storeTypes.ECOMMERCE,
  qualityChecklist: [],
  deliveryRadius: '',
  isWareHouse: false,
  warehouseStoreId: ''
}

export type AddStoreFormData = InferInput<typeof addStoreSchema>

const integerRegex = /^\d*$/

export type AddStoreData = {
  storeDetails: AddStoreFormData
  images: CustomInputImgData[]
}

const timeValues = [timeUnits.DAY, timeUnits.HOUR, timeUnits.MINUTE] as const
const storeTypeValues = [storeTypes.ECOMMERCE, storeTypes.QCOMMERCE] as const
const deliveryTypeValues = [deliveryTypes.MANAGED, deliveryTypes.SELF] as const

// ToDo: Abstract these scema into a storeSchema.ts file
const addStoreSchema = pipe(
  object({
    // Basic Details
    name: pipe(string(), nonEmpty('Store name is required')),
    description: pipe(string(), nonEmpty('Description is required')),
    BEmail: pipe(string(), nonEmpty('Email is required'), email('Please enter a valid email')),
    BPhone: pipe(
      string(),
      nonEmpty('Phone number must be at least 10 digits'),
      minLength(10, 'Phone number should be 10 digits'),
      maxLength(10, 'Phone number should be 10 digits')
    ),
    refferedBy: optional(string()),

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

    deliveryType: pipe(
      string(),
      nonEmpty('Delivery type is required'),
      picklist(deliveryTypeValues, 'Store type must be E-Commerce or Q-Commerce')
    ),

    // Self Fulfillment
    selfFulfillment: object({
      price: pipe(string(), regex(integerRegex, 'Price must be a number')),
      deliveryTime: object({
        value: pipe(string(), regex(integerRegex, 'Delivery Time must be a number')),
        unit: picklist(timeValues)
      })
    }),

    // Return details
    returnAllowed: boolean(),
    returnWindow: object({
      value: pipe(string(), regex(integerRegex, 'Return Window must be a number')),
      unit: picklist(timeValues)
    }),

    // Packing Time
    packingTime: object({
      value: pipe(string(), regex(integerRegex, 'Packing Time must be a number')),
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

    // Warehouse Details
    isWareHouse: optional(boolean()),
    warehouseStoreId: optional(string())
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

export default function AddStore() {
  const {
    control: addStoreController,
    getValues: getAddStoreValues,
    watch: watchAddStore,
    setValue: setAddStoreValue,
    reset: resetAddStore,
    handleSubmit: handleAddStoreSubmit,
    formState: { errors: addStoreErrors }
  } = useForm<AddStoreFormData>({
    resolver: valibotResolver(addStoreSchema),
    defaultValues: initialData
  })

  // hooks

  const searchParams = useSearchParams()
  const { addStoreMutation, isLoading } = useAddStore()
  const { allShops } = useEssentialDataStore()

  const { mutate: addStoreMutate } = addStoreMutation

  // states
  const [storeImageObjects, setStoreImageObjects] = useState<CustomInputImgData[]>([])

  const wareHouseStoreId = searchParams.get('warehouseStoreId')
  const isAddingWareHouse = !!wareHouseStoreId

  const handleAddImage = (uploadedImages: CustomInputImgData[]) => {
    const imageData = uploadedImages.map(img => ({
      value: `imageData${img.value}`,
      isSelected: storeImageObjects.length === 0,
      img: img.img
    }))

    setStoreImageObjects(prev => [...prev, ...imageData])
  }

  const thumbnailImage: string =
    storeImageObjects.filter(item => item.isSelected)[0]?.value ?? storeImageObjects[0]?.value

  const handleRemoveImage = (image: string) => {
    if (image === thumbnailImage) {
      setStoreImageObjects(prevImages => {
        return prevImages.map(item => {
          return {
            ...item,
            isSelected: false
          }
        })
      })

      return
    }

    setStoreImageObjects(prevImages => {
      const updatedImages = prevImages.filter(item => item.value !== image)

      if (image === thumbnailImage && updatedImages.length > 0) {
        updatedImages[0].isSelected = true
      }

      return updatedImages
    })
  }

  const handleChangeThumbnail = (image: string) => {
    setStoreImageObjects(prevImages =>
      prevImages.map(item => ({
        ...item,
        isSelected: item.value === image
      }))
    )
  }

  const onSubmitAddStore: SubmitHandler<AddStoreFormData> = async (data: AddStoreFormData) => {
    addStoreMutate({
      storeDetails: data,
      images: storeImageObjects
    })
  }

  const handleAddFormSubmit = () => {
    return (e: any) => {
      e.preventDefault()

      if (storeImageObjects.length === 0) {
        toast.error('Please upload images')

        return
      } else if (getAddStoreValues().address.gps === '') {
        toast.error('Please select the address on the map')

        return
      }

      handleAddStoreSubmit(onSubmitAddStore)(e)
    }
  }

  const transformApiDataToWarehouseSchema = (defaultWareHouseDetails: StoreDetails): AddStoreFormData => {
    const { value: deliveryTimeValue, unit: deliveryTimeUnit } = convertIsoToDuration(
      defaultWareHouseDetails.expected_delivery_time || ''
    )

    const { value: returnWindowValue, unit: returnWindowUnit } = convertIsoToDuration(
      defaultWareHouseDetails.category?.return_window || ''
    )

    const { value: packingTimeValue, unit: packingTimeUnit } = convertIsoToDuration(
      defaultWareHouseDetails.category.time_to_ship || ''
    )

    const qualityChecks: any[] = []

    qualityCheckList.forEach(({ key, label }) => {
      if (defaultWareHouseDetails?.quality_checks?.[label]) {
        qualityChecks.push({
          key,
          label
        })
      }
    })

    return {
      name: defaultWareHouseDetails.name,
      description: defaultWareHouseDetails.description,
      BEmail: defaultWareHouseDetails.business_email,
      BPhone: defaultWareHouseDetails.business_mobile_number,

      refferedBy: defaultWareHouseDetails.reffered_by || '',
      address: {
        locality: '',
        building: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        gps: ''
      },
      industryType: defaultWareHouseDetails.category?.category_detail?.name,
      GSTIN: defaultWareHouseDetails.gstin,
      FSSAI: defaultWareHouseDetails.fssai,
      pan: '',
      deliveryType: defaultWareHouseDetails.fulfillment,
      selfFulfillment: {
        price: defaultWareHouseDetails.delivery_charge?.toString() || '',
        deliveryTime: {
          value: deliveryTimeValue?.toString() || '',
          unit: deliveryTimeUnit?.toString() || timeUnits.DAY
        }
      },
      returnAllowed: defaultWareHouseDetails.category.is_returnable,
      returnWindow: {
        value: returnWindowValue || '',
        unit: returnWindowUnit?.toString() || timeUnits.DAY
      },
      packingTime: {
        value: packingTimeValue?.toString() || '',
        unit: packingTimeUnit?.toString() || timeUnits.DAY
      },
      storeType: defaultWareHouseDetails.mode,
      qualityChecklist: qualityChecks,
      deliveryRadius: defaultWareHouseDetails.delivery_location?.radius
        ? defaultWareHouseDetails.delivery_location?.radius
        : ''
    }
  }

  // When adding warehouse for a store prefill the warehouse details with store details
  useEffect(() => {
    if (isAddingWareHouse && wareHouseStoreId && allShops?.length) {
      const warehouseStoreDetails = allShops.find(shop => shop.id === wareHouseStoreId)

      if (warehouseStoreDetails) {
        try {
          const tranformedData: AddStoreFormData = transformApiDataToWarehouseSchema(warehouseStoreDetails)

          const imageData = warehouseStoreDetails.store_images?.map((img: any) => {
            return {
              value: `${img.id}`,
              isSelected: img?.image === warehouseStoreDetails?.icon,
              img: img.image
            }
          })

          setStoreImageObjects(imageData)

          tranformedData.isWareHouse = isAddingWareHouse
          tranformedData.warehouseStoreId = wareHouseStoreId
          resetAddStore(tranformedData)
        } catch (error) {
          toast.error('Error fetching warehouse details')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StoreForm
      handleFormSubmit={handleAddFormSubmit}
      storeImageObjects={storeImageObjects}
      handleRemoveImage={handleRemoveImage}
      handleChangeThumbnail={handleChangeThumbnail}
      handleImageUpload={handleAddImage}
      storeForm={{
        storeController: addStoreController,
        getStoreValues: getAddStoreValues,
        watchStore: watchAddStore,
        setStoreValue: setAddStoreValue,
        storeErrors: addStoreErrors
      }}
    />
  )
}
