import type { Address } from '@/types/apps/orderTypes'

export const transfromOrderAddressToString = (address: Address) => {
  const parts = [address.building, address.locality, address.city, address.state, address.area_code]

  
return parts.filter(part => part && part.trim().length > 0).join(', ')
}

export const exportOrderToCsv = (csvData: any, fileName: string) => {
  const blobData = new Blob([csvData], { type: 'text/csv' })
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(blobData)

  link.href = url
  link?.setAttribute('download', `${fileName}.csv`)

  document.body.appendChild(link)

  link.click()

  link?.parentNode?.removeChild(link)
}
