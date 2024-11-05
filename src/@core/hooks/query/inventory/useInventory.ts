import { useQuery } from '@tanstack/react-query'

import axiosInstance from '@/@core/api/interceptor'
import { useEssentialDataStore } from '@/@core/stores'
import { queryKey } from '@/@core/querykey'

const getProductsByStoreId = async (storeId: string, sortOrder: string, stockStatus: string, productStatus: string, search: string | undefined, currCategory: string) => {
    if (currCategory != 'F&B') {
        const res = await axiosInstance.get(`/ironcore/product-api/v0/products/`, {
            params: {
                store_id: storeId,
                ordering: sortOrder,
                in_stock: stockStatus === 'in_stock' ? true : stockStatus === 'out_of_stock' ? false : undefined,
                status: productStatus,
                search: search,
            }
        })

        return res.data
    } else {
        const res = await axiosInstance.get(`/ironcore/product-api/v0/food-products/`, {
            params: {
                store_id: storeId,
                ordering: sortOrder,
                in_stock: stockStatus === 'in_stock' ? true : stockStatus === 'out_of_stock' ? false : undefined,
                status: productStatus,
                search: search,
            }
        })

        return res.data
    }


}

const useProductsByStoreId = ({ sortOrder, stockStatus, productStatus, search }: {
    sortOrder: string
    stockStatus: string
    productStatus: string
    search?: string
}) => {
    const { currentShopData } = useEssentialDataStore(state => state)

    const storeId = currentShopData.id // Assuming you want the first store's ID
    const currCategory = currentShopData.category.category_detail.name

    return useQuery({
        queryKey: [queryKey.getInventoryItems, storeId, sortOrder, stockStatus, productStatus],
        queryFn: () => getProductsByStoreId(storeId as string, sortOrder, stockStatus, productStatus, search, currCategory),
        enabled: !!storeId // Only run the query if storeId is available
    })
}

export default useProductsByStoreId
