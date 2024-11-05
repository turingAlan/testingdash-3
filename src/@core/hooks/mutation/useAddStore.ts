import { useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import type { AxiosError, AxiosResponse } from 'axios'

import { queryKey } from '@/@core/querykey'
import type { AddStoreData } from '@/app/[subdomain]/[lang]/(stable)/addstore/page'
import type { CustomInputImgData } from '@/@core/components/custom-inputs/types'
import type { AddStorePayload, StoreDetails, StoreImage } from '@/types/apps/storeTypes'
import { convertDurationToIso } from '@/@core/utils/timeFormatHelpers'
import { deliveryTypes, qualityCheckList, storeTypes } from '@/data/storeFlowConstants'
import axiosInstance from '@/@core/api/interceptor'

import { blobUrlToFile } from '@/@core/utils/imageHelper'

import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'
import { useEssentialDataStore } from '@/@core/stores'

interface UploadImageMutationVariables {
  storeId: string
  file: CustomInputImgData
  isThumbnail: boolean
}

interface UploadWarehouseImageMutationVariables {
  warehouseStoreId: string
  storeImages: StoreImage[]
}

// Custom hook for addstore mutation
const useAddStore = () => {
  const [storeImages, setStoreImages] = useState<CustomInputImgData[]>([])
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false)

  // Hooks
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  const { organizationData, paymentDetails } = useEssentialDataStore()

  const handleAddStore = async (storeData: AddStoreData): Promise<any> => {
    const { images: storeImages, storeDetails } = storeData
    let paymentDetailsId = ''

    // Get the default payment details id
    const isPaymentIdPresent = paymentDetails?.some(paymentDetailItem => {
      if (paymentDetailItem.is_default) {
        paymentDetailsId = paymentDetailItem.id

        return true
      }
    })

    if (!isPaymentIdPresent || !paymentDetailsId) {
      throw new Error('Error Adding Store: Payment Details not found')
    }

    if (storeImages.length === 0) {
      toast.error('Please upload at least one image')

      return
    }

    // Set the store images for later add image mutation
    setStoreImages(storeImages)

    const returnWindowStandardString = convertDurationToIso(
      storeDetails.returnWindow.value || '',
      storeDetails.returnWindow.unit
    )

    const packingTimeStandardString = convertDurationToIso(
      storeDetails.packingTime.value || '',
      storeDetails.packingTime.unit
    )

    const qualityChecksMapPayload: { [key: string]: boolean | string } = {}

    qualityCheckList.forEach(check => {
      if (check.key !== 'special_instructions') {
        qualityChecksMapPayload[check.label] = false
      } else {
        qualityChecksMapPayload[check.label] = ''
      }
    })

    // Map over the selected quality checks and set there value for payload
    storeDetails.qualityChecklist.forEach(item => {
      if (item.key !== 'special_instructions') {
        qualityChecksMapPayload[item.label] = true
      } else {
        qualityChecksMapPayload[item.label] = ''
      }
    })

    const deliveryLocation =
      storeDetails.storeType === storeTypes.QCOMMERCE
        ? {
            radius: storeDetails.deliveryRadius
          }
        : null

    const apiPayload: AddStorePayload = {
      name: storeDetails.name,
      description: storeDetails.description,
      business_email: storeDetails.BEmail,
      business_mobile_number: storeDetails.BPhone,
      address: {
        ...storeDetails.address
      },
      payment_details: paymentDetailsId,
      category: storeDetails.industryType,
      fssai: storeDetails.FSSAI,
      fulfillment: storeDetails.deliveryType,
      is_returnable: storeDetails.returnAllowed,
      is_cancellable: false,
      is_cod: false,
      return_window: returnWindowStandardString,
      gstin: storeDetails.GSTIN,
      pan_number: storeDetails.pan,
      time_to_ship: packingTimeStandardString,
      quality_checks: qualityChecksMapPayload,
      mode: storeDetails.storeType,
      delivery_location: deliveryLocation,

      // self fulfillment details
      ...(storeDetails.deliveryType === deliveryTypes.SELF
        ? {
            delivery_charge: parseFloat(storeDetails.selfFulfillment.price || ''),
            expected_delivery_time: storeDetails.selfFulfillment.deliveryTime
          }
        : {}),
      ...(organizationData?.is_tsp
        ? {
            reffered_by: storeDetails.refferedBy
          }
        : {}),

      // Add parent store id if the store is a warehouse store
      ...(storeDetails.isWareHouse
        ? {
            parent_store: storeDetails.warehouseStoreId
          }
        : {})
    }

    const response = await axiosInstance.post(`/ironcore/store-api/v0/storefront/create_store/`, apiPayload)

    // Return the response data with the parent store id if the store is a warehouse store
    return {
      ...response.data?.data,
      ...(storeDetails.isWareHouse
        ? {
            parent_store: storeDetails.warehouseStoreId
          }
        : {})
    }
  }

  // Add store Image when store is created
  const handleAddStoreSuccess = async (storeData: StoreDetails) => {
    const storeId = storeData?.id

    // Check if the store added is a warehouse
    const warehouseStoreId = storeData?.parent_store
    const isStoreWareHouse = !!warehouseStoreId

    if (isStoreWareHouse) {
      queryClient.invalidateQueries({ queryKey: [queryKey.getAllStore] })
      toast.success('Warehouse store added successfully!')
      addWarehouseImageMutation.mutateAsync({ warehouseStoreId, storeImages: storeData.store_images ?? [] })

      return
    }

    // Start image upload of the store
    if (storeId) {
      setIsImageUploading(true)

      try {
        const uploadPromises = storeImages.map(async imageObj => {
          const file = imageObj

          return addStoreImageMutation.mutateAsync({
            file,
            storeId,
            isThumbnail: imageObj.isSelected || false
          })
        })

        await Promise.all(uploadPromises)

        toast.success('Store added successfully!')

        // Invalidate the store list query to refetch the data
        queryClient.invalidateQueries({ queryKey: [queryKey.getAllStore] })

        // Navigate back to the home screen
        return router.push(getLocalizedUrl('/dashboards/crm', locale as Locale))
      } catch (error) {
        console.error('Error uploading images:', error)
        toast.error('Error while adding store images')
      } finally {
        setIsImageUploading(false)
      }
    }
  }

  const handleError = (error: any) => {
    toast.error('Error while adding store please try again')
    console.error('image addition error', error)
  }

  const addStoreMutation = useMutation({
    mutationFn: handleAddStore,
    onSuccess: handleAddStoreSuccess,
    onError: handleError,
    mutationKey: [queryKey.addStore]
  })

  const handleAddStoreImage = async ({ storeId, file, isThumbnail }: UploadImageMutationVariables) => {
    const formData = new FormData()
    let imageObject: File | null = null

    if (file.img) {
      const blob = await fetch(file.img).then(r => r.blob())

      imageObject = await blobUrlToFile(URL.createObjectURL(blob), `${file.value}_store_${storeId}`)
    }

    formData.append('file', imageObject as File)

    const response: AxiosResponse<any> = await axiosInstance.post(
      `/ironcore/store-api/v0/storefront/${storeId}/add_image/`,
      formData
    )

    // Add store logo after uploading the image
    if (isThumbnail) {
      const imageId = response.data.data.store_images[response.data.data.store_images.length - 1].id

      await axiosInstance.post(
        `/ironcore/store-api/v0/storefront/${storeId}/add_logo/`,
        { image_id: imageId },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
    }

    return response.data
  }

  const handleAddStoreImageSuccess = () => {
    // Do nothing
  }

  const handleAddStoreImageError = (error: AxiosError) => {
    console.error('image addition error', error)
  }

  const addStoreImageMutation = useMutation({
    mutationFn: handleAddStoreImage,
    onSuccess: handleAddStoreImageSuccess,
    onError: handleAddStoreImageError,
    mutationKey: [queryKey.addStoreImage]
  })

  const handleAddWarehouseImage = async ({ warehouseStoreId, storeImages }: UploadWarehouseImageMutationVariables) => {
    const apiBody =
      storeImages.map(image => {
        return image.id
      }) ?? []

    const response: AxiosResponse<any> = await axiosInstance.post(
      `/ironcore/store-api/v0/storefront/${warehouseStoreId}/add_image/`,
      apiBody
    )

    return response.data
  }

  const handleAddWarehouseImageSuccess = () => {
    // Do nothing
  }

  const handleAddWarehouseImageError = (error: AxiosError) => {
    console.error('image addition error', error)
  }

  const addWarehouseImageMutation = useMutation({
    mutationFn: handleAddWarehouseImage,
    onSuccess: handleAddWarehouseImageSuccess,
    onError: handleAddWarehouseImageError,
    mutationKey: [queryKey.addStoreImage]
  })

  return { addStoreMutation, isLoading: addStoreMutation.isPending || isImageUploading }
}

export default useAddStore
