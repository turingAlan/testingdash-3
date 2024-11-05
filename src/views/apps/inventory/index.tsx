import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Typography } from '@mui/material'
import { useDropzone } from 'react-dropzone'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import InventoryTable from './InventoryTable'
import { useEssentialDataStore } from '@/@core/stores'
import CustomAvatar from '@/@core/components/mui/Avatar'
import axiosInstance from '@/@core/api/interceptor'

const Inventory = ({
  setSwitchmode,
  search
}: {
  setSwitchmode: React.Dispatch<React.SetStateAction<boolean>>
  search: string
}) => {
  const [sortOrder, setSortOrder] = useState('name')
  const [stockStatus, setStockStatus] = useState('all')
  const [productStatus, setProductStatus] = useState('active')
  const [bulkUpload, setBulkUpload] = useState(false)
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const { variantData } = useEssentialDataStore(state => state)
  const { setVariantData, setVariantDataId } = useEssentialDataStore()
  const router = useRouter()

  // Dropzone configuration
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    onDrop: (acceptedFiles) => {
      setBulkFile(acceptedFiles[0]) // Save the uploaded file
    }
  })

  const { currentShopData } = useEssentialDataStore(state => state)

  // Use optional chaining and nullish coalescing to safely access the properties
  const currCategory = currentShopData?.category?.category_detail?.name ?? ''
  const currStoreId = currentShopData?.id ?? ''

  // Handle bulk upload
  const handleBulkUpload = () => {
    // Handle file upload submission here
    if(!bulkFile) return

    try{
      toast.info('Uploading file...')
      const formdata = new FormData()
      
      formdata.append('file', bulkFile, bulkFile.name)
      formdata.append('store_id', currStoreId as string)
      formdata.append('category', currCategory)
      
      axiosInstance.post('/ironcore/product-api/v0/upload-products', formdata)
      .then(() => {
        toast.success('File uploaded successfully')
      })
    }catch(e){
      console.error(e)
      toast.error('An error occurred while uploading the file')
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='filters flex gap-2 flex-wrap sm:justify-between'>
        <div className='flex gap-2'>
          {bulkUpload && (
            <Dialog open={bulkUpload} onClose={() => setBulkUpload(false)}>
              <DialogTitle>
                <Typography variant='h3' className='text-center'>Bulk Upload</Typography>
              </DialogTitle>
              <DialogContent>
                <div {...getRootProps({ className: 'dropzone' })} className='border border-dashed border-gray-400 rounded p-4'>
                  <input {...getInputProps()} />
                  {bulkFile ? (
                    <div key={bulkFile.name} className='flex justify-between'>
                    <div className='file-details flex'>
                      <div className='file-preview'><i className='tabler-file-text text-3xl p-1 mx-1' /></div>
                      <div>
                        <Typography className='file-name font-medium' color='text.primary'>
                          {bulkFile.name}
                        </Typography>
                        <Typography className='file-size' variant='body2'>
                          {Math.round(bulkFile.size / 100) / 10 > 1000
                            ? `${(Math.round(bulkFile.size / 100) / 10000).toFixed(1)} mb`
                            : `${(Math.round(bulkFile.size / 100) / 10).toFixed(1)} kb`}
                        </Typography>
                      </div>
                    </div>
                    <IconButton onClick={() => {
                      setBulkFile(null)
                    }}>
                      <i className='tabler-x text-xl' />
                    </IconButton>
                  </div>
                  ) : (
                    <div className='flex flex-col justify-center items-center gap-2'>
                    <CustomAvatar variant='rounded' skin='light' color='secondary' sx={{ height: 24, width: 24 }}>
                    <i className='tabler-upload text-sm' />
                  </CustomAvatar>
                    <Typography variant='body1' className='text-center text-gray-600 cursor-pointer'>
                      Drag and drop an .xlsx file here, or click to select one
                    </Typography>

                    </div>
                  )}
                </div>
                <div className='flex justify-end gap-2 mt-4'>
                  <Button variant='outlined' onClick={() => {
                    setBulkUpload(false)
                    setBulkFile(null)
                    }}>
                    Cancel
                  </Button>
                  <Button variant='contained' onClick={() => {
                    // Handle file upload submission here
                    setBulkUpload(false)
                    handleBulkUpload()
                  }}>
                    Proceed
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {variantData?.productName && (
            <Dialog open={!!variantData?.productName} onClose={() => {
              setVariantData(null)
              setVariantDataId(null)
            }}>
              <DialogTitle>
                <Typography variant='h3' className='text-center'>Do you want to add more variants?</Typography>
              </DialogTitle>
              <DialogContent>
                <Typography variant='body1' className='text-center'>
                  Base Product: {variantData?.productName}
                </Typography>
                <div className='flex justify-end gap-2 mt-4'>
                  <Button variant='outlined' onClick={() => {
                    setVariantData(null)
                    setVariantDataId(null)
                  }}>
                    No
                  </Button>
                  <Button variant='contained' onClick={() => router.push(`/inventory/addproduct/`)}>
                    Yes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {/* Filters */}
          <CustomTextField select value={sortOrder} onChange={e => setSortOrder(e.target.value)} id='custom-select' SelectProps={{ displayEmpty: true, multiple: false }} sx={{ width: '125px' }}>
            <MenuItem value='name'>Name A-Z</MenuItem>
            <MenuItem value='-name'>Name Z-A</MenuItem>
          </CustomTextField>
          <CustomTextField select value={stockStatus} onChange={e => setStockStatus(e.target.value)} id='custom-select' SelectProps={{ displayEmpty: true, multiple: false }} sx={{ width: '75px' }}>
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='in_stock'>In Stock</MenuItem>
            <MenuItem value='out_of_stock'>Out of Stock</MenuItem>
          </CustomTextField>
          <CustomTextField select value={productStatus} onChange={e => setProductStatus(e.target.value)} id='custom-select' SelectProps={{ displayEmpty: true, multiple: false }} sx={{ width: '100px' }}>
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='inactive'>Inactive</MenuItem>
            <MenuItem value='draft'>Draft</MenuItem>
          </CustomTextField>
        </div>
        <div className='flex gap-2 justify-between w-full sm:justify-normal sm:w-max'>
          <Button variant='outlined' className='h-full' onClick={() => setBulkUpload(true)}>
            <span className='hidden sm:block mr-2'>Bulk upload</span>
            <i className='tabler-history text-sm block sm:hidden' />
          </Button>
          <Button variant='outlined' className='h-full' onClick={() => setSwitchmode(false)}>
            <span className='hidden sm:block mr-2'>View History</span>
            <i className='tabler-history text-sm block sm:hidden' />
          </Button>
          <Link href='/inventory/addproduct/' className='h-full'>
            <Button variant='contained' className='h-full'>
              <span className='hidden sm:block mr-2'>Add Product</span>
              <i className='tabler-plus text-sm' />
            </Button>
          </Link>
        </div>
      </div>
      <InventoryTable currCategory={currCategory} sortOrder={sortOrder} stockStatus={stockStatus} productStatus={productStatus} search={search} />
    </div>
  )
}

export default Inventory
