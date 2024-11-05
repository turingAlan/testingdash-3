import { useQuery } from '@tanstack/react-query'

import dayjs from 'dayjs'

import { toast } from 'react-toastify'

import { json2csv } from 'json-2-csv'

import { queryKey } from '@/@core/querykey'
import axiosInstance from '@/@core/api/interceptor'
import { useEssentialDataStore } from '@/@core/stores'
import { exportOrderToCsv } from '@/@core/utils/orderHelper'

// Custom hook for exportOrderData query
const useExportOrderData = ({ startDate, endDate }: { startDate: Date | string; endDate: Date | string }) => {
  const { currentShopData } = useEssentialDataStore()

  const handleExportOrderData = async (): Promise<any> => {
    const startDateString = dayjs(startDate).format('DD-MM-YYYY')
    const endDateString = dayjs(endDate).format('DD-MM-YYYY')
    const startDateObject = dayjs(startDate)
    const endDateObject = dayjs(endDate)
    const differenceInDays = endDateObject.diff(startDateObject, 'day')

    if (differenceInDays > 45) {
      toast.error("Can't export data for more than 45 days")
      
return
    }

    if (!startDate || !endDate) {
      throw new Error('Please provide start and end dates')
    }

    const response = await axiosInstance.get(
      `/ironcore/orders-api/v0/orders/export/?store_id=${currentShopData.id}&start_date=${startDateString}&end_date=${endDateString}`
    )

    if (response.data && response.status === 200) {
      const fileName = `orders-${startDate}-${endDate}`

      const csvData = json2csv(response.data, {
        expandArrayObjects: true
      })

      exportOrderToCsv(csvData, fileName)
    }

    return response.data
  }

  const exportOrderData = useQuery({
    queryFn: handleExportOrderData,
    enabled: false,
    queryKey: [queryKey.exportOrderData]
  })

  return exportOrderData
}

export default useExportOrderData
