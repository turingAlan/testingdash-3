import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import isEqual from 'fast-deep-equal'

import { queryKey } from '@/@core/querykey'
import axiosInstance from '@/@core/api/interceptor'
import type { CustomInputImgData } from '@/@core/components/custom-inputs/types'
import { blobUrlToFile } from '@/@core/utils/imageHelper'
import type { EditStoreFormData } from '@/app/[subdomain]/[lang]/(stable)/store/[storeId]/page'
import type { EditStorePayload, StoreDetails, StoreTiming } from '@/types/apps/storeTypes'
import { convertDurationToIso } from '@/@core/utils/timeFormatHelpers'
import { deliveryTypes, qualityCheckList } from '@/data/storeFlowConstants'
import { useEssentialDataStore } from '@/@core/stores'

// Custom hook for editStore and related mutations
const useEditStore = (storeId: string, setStoreImages: React.Dispatch<React.SetStateAction<any[]>>) => {
  const queryClient = useQueryClient()
  const { setAllShops, allShops } = useEssentialDataStore()

  const transformFormDataToApiPayload = (storeDetails: EditStoreFormData, storeId: string): EditStorePayload => {
    const returnWindowString = convertDurationToIso(
      storeDetails.returnWindow.value || '',
      storeDetails.returnWindow.unit
    )

    const packingTimeString = convertDurationToIso(storeDetails.packingTime.value || '', storeDetails.packingTime.unit)

    const qualityChecksMapPayload: { [key: string]: boolean | string } = {}

    const selfFulfillmentDeliveryTimeString = convertDurationToIso(
      storeDetails.selfFulfillment.deliveryTime.value || '',
      storeDetails.selfFulfillment.deliveryTime.unit
    )

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

    return {
      id: storeId,
      name: storeDetails.name,
      fssai: storeDetails.FSSAI,
      fulfillment: storeDetails.deliveryType,
      business_email: storeDetails.BEmail,
      business_mobile_number: storeDetails.BPhone,
      mode: storeDetails.storeType,
      bap_commission_threshold: storeDetails.maxBapCommission || '',
      delivery_location: storeDetails.deliveryRadius ? { radius: storeDetails.deliveryRadius } : null,
      quality_checks: qualityChecksMapPayload,
      category: {
        return_window: storeDetails.returnAllowed ? returnWindowString : '',
        is_cancellable: storeDetails.isCancellable || false,
        is_returnable: storeDetails.returnAllowed,
        is_cod: storeDetails.isCod || false,
        time_to_ship: packingTimeString
      },
      ...(storeDetails.deliveryType === deliveryTypes.SELF
        ? {
            expected_delivery_time: selfFulfillmentDeliveryTimeString,
            delivery_charge: storeDetails.selfFulfillment.price || ''
          }
        : {})
    }
  }

  const handleEditStore = async ({
    storeData,
    initialStoreData
  }: {
    storeData: EditStoreFormData
    initialStoreData: EditStoreFormData | null
  }): Promise<any> => {
    try {
      console.log(
        JSON.stringify(storeData),
        JSON.stringify(initialStoreData),
        'here is the store data and initial store data',
        isEqual(storeData, initialStoreData)
      )

      // Check if the storeData is same as initialStoreData
      if (isEqual(storeData, initialStoreData)) {
        throw new Error('No changes made to the store details')
      }

      const apiPayload = transformFormDataToApiPayload(storeData, storeId)

      const response = await axiosInstance.patch(`/ironcore/store-api/v0/storefront/${storeId}/`, apiPayload)

      return response.data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error))
    }
  }

  // Invalidate the getStoreDetails query and update the store details
  const handleEditStoreSuccess = (updateStoreData: StoreDetails) => {
    console.log(updateStoreData, 'here is the update store details')

    queryClient.invalidateQueries({ queryKey: [queryKey.getStoreDetails, storeId] })
    toast.success('Store details updated successfully!')
  }

  const handleEditStoreError = (error: any) => {
    const isNoChangesError = error instanceof Error && error.message === 'No changes made to the store details'

    if (isNoChangesError) {
      toast.error('No changes made to the store details.')
    } else {
      toast.error('Error while updating store details, please try again!')
    }

    console.error('Store edit error:', error)
  }

  const editStoreDetailMutation = useMutation({
    mutationFn: handleEditStore,
    onSuccess: handleEditStoreSuccess,
    onError: handleEditStoreError,
    mutationKey: [queryKey.editStoreDetails, storeId]
  })

  const handleAddImage = async (imageData: CustomInputImgData[]): Promise<any> => {
    let updatedStoreImage: CustomInputImgData[] = []

    const uploadPromises = imageData.map(async imgObj => {
      const addImageForm = new FormData()
      let imageObject: File | null = null

      if (imgObj.img) {
        const blob = await fetch(imgObj.img).then(r => r.blob())

        imageObject = await blobUrlToFile(URL.createObjectURL(blob), `${imgObj.value}_store_${storeId}`)
      }

      addImageForm.append('file', imageObject as File)
      const response = await axiosInstance.post(`ironcore/store-api/v0/storefront/${storeId}/add_image/`, addImageForm)

      updatedStoreImage = response.data.data?.store_images?.map((apiImage: any) => {
        return {
          value: `imageData${apiImage.id}`,
          isSelected: apiImage?.image === response.data.data?.icon,
          img: apiImage.image
        }
      })
    })

    await Promise.all(uploadPromises)

    return updatedStoreImage
  }

  const handleAddImageSuccess = (updatedImages: CustomInputImgData[]) => {
    setStoreImages(updatedImages)
  }

  const handleAddImageError = (error: any) => {
    toast.error('Error while adding image please try again!')
    console.error('login error', error)
  }

  const addStoreImageMutation = useMutation({
    mutationFn: handleAddImage,
    onSuccess: handleAddImageSuccess,
    onError: handleAddImageError,
    mutationKey: [queryKey.addStoreImage, storeId]
  })

  const handleDeleteImage = async (imageId: string): Promise<any> => {
    let updatedStoreImage: CustomInputImgData[] = []

    if (!imageId) {
      toast.error('some error occured please try again!')

      return
    }

    const apiPayload = {
      images: [imageId]
    }

    const response = await axiosInstance.post(`ironcore/store-api/v0/storefront/${storeId}/remove_image/`, apiPayload)

    updatedStoreImage = response.data.data?.store_images?.map((apiImage: any) => {
      return {
        value: `imageData${apiImage.id}`,
        isSelected: apiImage?.image === response.data.data?.icon,
        img: apiImage.image
      }
    })

    return updatedStoreImage
  }

  const handleDeleteImageSuccess = (updatedImages: CustomInputImgData[]) => {
    setStoreImages(updatedImages)
  }

  const handleDeleteImageError = (error: any) => {
    toast.error('Error while deleting image please try again!')
    console.error('login error', error)
  }

  const deleteStoreImageMutation = useMutation({
    mutationFn: handleDeleteImage,
    onSuccess: handleDeleteImageSuccess,
    onError: handleDeleteImageError,
    mutationKey: [queryKey.deleteStoreImage, storeId]
  })

  const handleChangeThumbnailImage = async (imageId: string): Promise<any> => {
    let updatedStoreImage: CustomInputImgData[] = []

    if (!imageId) {
      toast.error('some error occured please try again!')

      return
    }

    const apiPayload = new FormData()

    apiPayload.append('image_id', imageId)

    const response = await axiosInstance.post(`ironcore/store-api/v0/storefront/${storeId}/add_logo/`, apiPayload)

    updatedStoreImage = response.data.data?.store_images?.map((apiImage: any) => {
      return {
        value: `imageData${apiImage.id}`,
        isSelected: apiImage?.image === response.data.data?.icon,
        img: apiImage.image
      }
    })

    return updatedStoreImage
  }

  const handleChangeThumbnailImageSuccess = (updatedImages: CustomInputImgData[]) => {
    setStoreImages(updatedImages)
  }

  const handleChangeThumbnailImageError = (error: any) => {
    toast.error('Error while updating thumbnail please try again!')
    console.error('login error', error)
  }

  const changeThumbnailStoreImageMutation = useMutation({
    mutationFn: handleChangeThumbnailImage,
    onSuccess: handleChangeThumbnailImageSuccess,
    onError: handleChangeThumbnailImageError,
    mutationKey: [queryKey.makeStoreImageThumbnail, storeId]
  })

  const handleStoreTimingsChange = async (storeTimeData: StoreTiming): Promise<any> => {
    const response = await axiosInstance.post(
      `ironcore/store-api/v0/storefront/${storeId}/change_shop_timings/`,
      storeTimeData
    )

    return response.data?.data
  }

  const handleStoreTimingsChangeSuccess = (storeData: StoreDetails) => {
    toast.success('Store timings updated successfully!')

    // Update the store in zustand store with the new timing
    const updatedStoreList =
      allShops?.map(shop => {
        if (shop.id === storeData.id) {
          return storeData
        }

        return shop
      }) ?? []

    setAllShops(updatedStoreList)

    return storeData
  }

  const handleStoreTimingsChangeError = (error: any) => {
    toast.error('Error while updating timing please try again!')
    console.error('login error', error)
  }

  const changeStoreTimingMutation = useMutation({
    mutationFn: handleStoreTimingsChange,
    onSuccess: handleStoreTimingsChangeSuccess,
    onError: handleStoreTimingsChangeError,
    mutationKey: [queryKey.editStoreTimings, storeId]
  })

  return {
    addStoreImageMutation,
    deleteStoreImageMutation,
    changeThumbnailStoreImageMutation,
    editStoreDetailMutation,
    changeStoreTimingMutation
  }
}

export default useEditStore
