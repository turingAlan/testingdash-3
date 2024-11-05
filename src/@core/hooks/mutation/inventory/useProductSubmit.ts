import { useParams, useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import axiosInstance from '@/@core/api/interceptor'
import { useEssentialDataStore } from '@/@core/stores'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'

// API call to submit the product
const submitProduct = async (data: any) => {
    if (data.storeCategory != 'F&B') {
        let priceBeforeTax = parseFloat(data.sellingPrice)

        if (data.taxSlab) {
            priceBeforeTax = (parseFloat(data.sellingPrice) * 100) / (100 + parseFloat(data.taxSlab))
        }

        const apibody: {
            name: any
            category: any
            description: any
            brand: any
            return_window: any
            time_to_ship: string
            status: string
            is_returnable: any
            is_cancellable: any
            is_cod: boolean
            tax: any
            mrp: number
            selling_price: number
            cost_price: number
            attributes: any
            uom: string
            uom_value: number
            sku_count: number
            code: string
            price_before_tax: number
            packaging_details: {
                after_packaging_length: number
                after_packaging_breadth: number
                after_packaging_height: number
                after_packaging_weight: number
            }
            manufacture_details?: {
                manufacturer_name?: string
                manufacturer_address?: string
                generic_name?: any
                manufacture_date?: string
                origin_country?: string
            }
            parent?: any
        } = {
            name: data.productName,
            category: data.subcategory,
            description: data.description,
            brand: data.brand,
            return_window: data.allowReturns ? data.returnWindow : 'P10D',
            time_to_ship: data.storeTimeToShip,
            is_returnable: data.allowReturns,
            is_cancellable: data.allowCancellations,
            status: 'active',
            is_cod: false,
            tax: data.taxSlab,
            mrp: parseFloat(data.mrp),
            selling_price: parseFloat(data.sellingPrice),
            cost_price: parseFloat(data.costPrice),
            attributes: data.attributes,
            uom: data?.uom ?? 'unit',
            uom_value: parseInt(data.uom_value),
            sku_count: parseInt(data.sku_count),
            code: `${data.code}:${data.codeValue}`,
            price_before_tax: priceBeforeTax,
            packaging_details: {
                after_packaging_length: parseFloat(data.packing_details.length),
                after_packaging_breadth: parseFloat(data.packing_details.width),
                after_packaging_height: parseFloat(data.packing_details.height),
                after_packaging_weight: parseFloat(data.packing_details.weight)
            },
        }

        if (!data?.pid) {
            if (data.parent) {
                apibody['parent'] = data.parent
            }

            // TODO: Take from shop in a better way
            apibody['manufacture_details'] = {
                manufacturer_name: 'SellerSetu',
                manufacturer_address:
                    '  Prof Ram Nath Vij Marg,  71,   Block S,  Karol Bagh, New Rajendra Nagar, New Delhi - 110060',
                generic_name: data.subcategory,
                manufacture_date: '2024-11-04',
                origin_country: 'India'
            }
            const response = await axiosInstance.post(`/ironcore/product-api/v0/products/?store_id=${data.storeId}`, apibody)

            const productId = response.data.data.id

            if (data.selectedImages && data.selectedImages.length > 0) {
                for (const image of data.selectedImages) {
                    const formData = new FormData()

                    formData.append('file', image, image.name)

                    try {
                        await axiosInstance.post(
                            `/ironcore/product-api/v0/products/${productId}/add_image/?store_id=${data.storeId}`,
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }
                        )
                    } catch (error) {
                        console.error('Error uploading image:', error)
                        toast.error('Error uploading image')
                    }
                }
            }

            if (data?.isExtra) {
                const formData = new FormData()

                formData.append('file', data?.extraFile, data?.extraFile.name)
                formData.append(data?.storeCategory == 'Grocery' ? 'is_backimage' : 'is_sizechart', 'true')

                try {
                    await axiosInstance.post(
                        `/ironcore/product-api/v0/products/${productId}/add_image/?store_id=${data.storeId}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    )
                } catch (error) {
                    console.error('Error uploading extra file:', error)
                    toast.error('Error uploading extra file')
                }
            }

            return response.data
        } else {
            const response = await axiosInstance.patch(`/ironcore/product-api/v0/products/${data.pid}/?store_id=${data.storeId}`, apibody)
            const productId = data.pid

            if (data.selectedImages && data.selectedImages.length > 0) {
                for (const image of data.selectedImages) {
                    if (!image?.image) {

                        const formData = new FormData()

                        formData.append('file', image, image.name)

                        try {
                            await axiosInstance.post(
                                `/ironcore/product-api/v0/products/${productId}/add_image/?store_id=${data.storeId}`,
                                formData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }
                            )
                        } catch (error) {
                            console.error('Error uploading image:', error)
                            toast.error('Error uploading image')
                        }
                    }
                }
            }

            if (data?.isExtra && !data?.extraFile?.image) {
                const formData = new FormData()

                formData.append('file', data?.extraFile, data?.extraFile.name)
                formData.append(data?.storeCategory == 'Grocery' ? 'is_backimage' : 'is_sizechart', 'true')

                try {
                    await axiosInstance.post(
                        `/ironcore/product-api/v0/products/${productId}/add_image/?store_id=${data.storeId}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    )
                } catch (error) {
                    console.error('Error uploading extra file:', error)
                    toast.error('Error uploading extra file')
                }
            }

            return response.data
        }


    } else {

        if (!data?.pid) {
            const apibody: {
                name: any
                description: any
                category: any
                uom: string
                uom_value: number
                sku_count: number
                packing_charges: number
                status: string
                disabled: boolean
                return_window: any
                time_to_ship: string
                is_returnable: any
                is_cancellable: any
                is_cod: boolean
                tax: any
                selling_price: number
                cost_price: number
                attributes: any
                packaging_details: {
                    after_packaging_length: number
                    after_packaging_breadth: number
                    after_packaging_height: number
                    after_packaging_weight: number
                }
                time: any
                recommended: any
                veg: any
            } = {
                name: data.productName,
                description: data.description,
                category: data.subcategory.name,
                uom: data?.uom ?? 'unit',
                uom_value: parseInt(data.uom_value),
                sku_count: parseInt(data.sku_count),
                tax: parseInt(data.taxSlab),
                packing_charges: parseFloat(data.packing),
                status: 'active',
                disabled: false,
                return_window: data.allowReturns ? data.returnWindow : 'P10D',
                is_returnable: data.allowReturns,
                is_cancellable: data.allowCancellations,
                is_cod: false,
                selling_price: parseFloat(data.sellingPrice),
                cost_price: parseFloat(data.costPrice),
                attributes: data.attributes,
                packaging_details: {
                    after_packaging_length: parseFloat(data.packing_details.length),
                    after_packaging_breadth: parseFloat(data.packing_details.width),
                    after_packaging_height: parseFloat(data.packing_details.height),
                    after_packaging_weight: parseFloat(data.packing_details.weight)
                },
                time_to_ship: data.storeTimeToShip,
                time: data.storeTime,
                veg: data.vegNonveg == 'veg',
                recommended: data.recommended == 'recommended'
            }

            const response = await axiosInstance.post(
                `/ironcore/product-api/v0/food-products/?store_id=${data.storeId}`,
                apibody
            )

            const productId = response.data.data.id

            if (data.selectedImages && data.selectedImages.length > 0) {
                for (const image of data.selectedImages) {
                    const formData = new FormData()

                    formData.append('file', image, image.name)

                    try {
                        await axiosInstance.post(`/ironcore/product-api/v0/food-products/${productId}/add_image/`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                    } catch (error) {
                        console.error('Error uploading image:', error)
                        toast.error('Error uploading image')
                    }
                }
            }

            if (data?.selectedFoodCustomization) {
                for (const custom of data.selectedFoodCustomization) {
                    const id = custom.id as string

                    const isDummy = id.includes('dummy')

                    let apibody

                    if (isDummy) {
                        apibody = {
                            product: productId,
                            customization_group: {
                                name: custom.name,
                                description: custom.description,
                                min_allowed: custom.min_allowed,
                                max_allowed: custom.max_allowed,
                                time: data.storeTime,
                                parent: null,
                                food_customizations: custom.food_customizations
                            }
                        }
                    } else {
                        apibody = {
                            product: productId,
                            customization_group: {
                                id: id,
                                food_customizations: custom.food_customizations
                            }
                        }
                    }

                    axiosInstance.post(`/ironcore/product-api/v0/food-customizations/?store_id=${data.storeId}`, apibody)
                }
            }

            return { ...response.data, pid: data?.pid }
        } else {
            const apibody: {
                name: any
                description: any

                // category: any
                uom: string
                uom_value: number
                sku_count: number
                packing_charges: number
                status: string
                disabled: boolean
                return_window: any
                is_returnable: any
                is_cancellable: any
                is_cod: boolean
                tax: any
                selling_price: number
                cost_price: number
                packaging_details: {
                    after_packaging_length: number
                    after_packaging_breadth: number
                    after_packaging_height: number
                    after_packaging_weight: number
                }
                recommended: any
                veg: any
            } = {
                name: data.productName,
                description: data.description,

                // category: data.subcategory,
                uom: data?.uom ?? 'unit',
                uom_value: parseInt(data.uom_value),
                sku_count: parseInt(data.sku_count),
                tax: parseInt(data.taxSlab),
                packing_charges: parseFloat(data.packing),
                status: 'active',
                disabled: false,
                return_window: data.allowReturns ? data.returnWindow : 'P10D',
                is_returnable: data.allowReturns,
                is_cancellable: data.allowCancellations,
                is_cod: false,
                selling_price: parseFloat(data.sellingPrice),
                cost_price: parseFloat(data.costPrice),
                packaging_details: {
                    after_packaging_length: parseFloat(data.packing_details.length),
                    after_packaging_breadth: parseFloat(data.packing_details.width),
                    after_packaging_height: parseFloat(data.packing_details.height),
                    after_packaging_weight: parseFloat(data.packing_details.weight)
                },
                veg: data.vegNonveg == 'veg',
                recommended: data.recommended == 'recommended'
            }


            const response = await axiosInstance.patch(
                `/ironcore/product-api/v0/food-products/${data.pid}/?store_id=${data.storeId}`,
                apibody
            )

            return { ...response.data, pid: data?.pid }
        }
    }
}

// Custom hook for submitting a product
const useSubmitProduct = () => {
    const { currentShopData, variantData, variantDataId } = useEssentialDataStore(state => state)
    const { setVariantDataId } = useEssentialDataStore()
    const storeCategory = currentShopData?.category?.category_detail?.name
    const storeId = currentShopData.id

    const storeTime = currentShopData?.time
    const storeTimeToShip = currentShopData?.category?.time_to_ship

    const { lang: locale } = useParams()
    const router = useRouter()

    const handleSuccess = (productData: any) => {
        console.log(productData, 'productData data')
        if (!variantData?.productName && storeCategory != 'F&B' && !productData?.pid) setVariantDataId(productData.data.id)
        router.push(getLocalizedUrl('/inventory', locale as Locale))
    }

    const mutation = useMutation({
        mutationFn: (productData: { name: string; brand: string; subcategory: string; description: string }) =>
            submitProduct({
                ...productData,
                storeId: storeId as string,
                parent: variantDataId,
                storeCategory: storeCategory,
                storeTime: storeTime,
                storeTimeToShip: storeTimeToShip
            }),
        onSuccess: handleSuccess,
        onError: (error: unknown) => {
            console.error('Error submitting product:', error)
        }
    })

    // Returning the mutation along with loading state for external use
    return { ...mutation, isLoading: mutation.status === 'pending' }
}

export default useSubmitProduct
