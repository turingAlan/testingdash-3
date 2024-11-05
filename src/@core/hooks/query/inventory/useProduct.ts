import { useQuery } from '@tanstack/react-query'

import axiosInstance from '@/@core/api/interceptor'
import { useEssentialDataStore } from '@/@core/stores'
import { queryKey } from '@/@core/querykey'

const getProductByStoreId = async (storeId: string, productId: string, currCategory: string) => {
    if (currCategory != 'F&B') {
        const res = await axiosInstance.get(`/ironcore/product-api/v0/products/${productId}/`, {
            params: {
                store_id: storeId,
            }
        })

        return res.data
    } else {
        const res = await axiosInstance.get(`/ironcore/product-api/v0/food-products/${productId}/`, {
            params: {
                store_id: storeId,
            }
        })

        return res.data
    }
}

const useProduct = ({ productId }: { productId: string | number | undefined }) => {
    const { currentShopData } = useEssentialDataStore(state => state)

    const storeId = currentShopData.id
    const currCategory = currentShopData.category.category_detail.name

    return useQuery({
        queryKey: [queryKey.getInventoryItem, storeId, productId],
        queryFn: () => getProductByStoreId(storeId as string, productId as string, currCategory),
        enabled: !!productId
    })
}

export default useProduct
