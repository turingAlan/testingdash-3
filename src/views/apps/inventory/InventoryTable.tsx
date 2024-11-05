import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

import useMediaQuery from '@/@menu/hooks/useMediaQuery'
import InventoryCard from '@/components/inventory/InventoryCard'
import useProductsByStoreId from '@/@core/hooks/query/inventory/useInventory'
import tableStyles from '@core/styles/table.module.css'
import ProductPreview from '@/components/dialogs/inventory/productInfo'
import Setuji from '@/components/Setuji'

const InventoryTable = ({
  sortOrder,
  stockStatus,
  productStatus,
  search,
  currCategory
}: {
  sortOrder: string
  stockStatus: string
  productStatus: string
  search: string
  currCategory: string
}) => {
  const [productPreview, setProductPreview] = useState<any>({})
  const { data, isLoading, isError, error } = useProductsByStoreId({ sortOrder, stockStatus, productStatus, search })

  if (isLoading) {
    return <div className='w-full h-full flex flex-col items-center justify-center'><i className='tabler-loader-2 text-primary text-6xl mt-8 animate-spin' /></div>
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center w-full h-full mt-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-300 shadow-md max-w-md text-center">
          <div className='flex gap-2 items-center justify-center'>
            <i className='tabler-bug' />
            <p className="font-semibold">Oops! Something went wrong.</p>
            </div>
          <p className="mt-2">{error?.message??"Something isnt working the way it was supposed to"}</p>
        </div>
      </div>
    );
  }
  

  return (
    data?.results.length === 0 ? (
      <Setuji message='No products here!!' />
    ):
    <div className='grid mt-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 pt-4 pr-6 gap-20'>
      {productPreview?.id && (
        <ProductPreview
          open={!!productPreview?.id}
          setOpen={() => setProductPreview({})}
          mainProduct={productPreview.mainProduct}
          variants={productPreview.variants}
        /> 
      )}
      {data?.results.map((product: any) => (
        <div key={product.id} className={stockStatus === 'all' && product?.sku_count === 0 ? 'opacity-50' : ''}
          onClick={() => {
            if(currCategory!='F&B'&&!product.parent) setProductPreview({
            id: product.id,
            mainProduct: {
              name: product.name,
              id: product.id,
              image: product?.image[0]?.image
            },
            variants: product.variants.map((variant: any) => ({
              name: variant.name,
              id: variant.id,
              image: variant?.image[0]?.image
            }))
          })}}
        >
          <InventoryCard currCategory={currCategory} product={product} />
        </div>
      ))}
    </div>
  )
}

const InventoryTableDesktop = ({
  sortOrder,
  stockStatus,
  productStatus,
  search,
  currCategory
}: {
  sortOrder: string
  stockStatus: string
  productStatus: string
  search: string
  currCategory: string
}) => {
  const [productPreview, setProductPreview] = useState<any>({})
  const { data, isLoading, isError, error } = useProductsByStoreId({ sortOrder, stockStatus, productStatus, search })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Card className='mt-2'>
      {productPreview?.id && (
        <ProductPreview
          open={!!productPreview?.id}
          setOpen={() => setProductPreview({})}
          mainProduct={productPreview.mainProduct}
          variants={productPreview.variants}
        /> 
      )}
      <CardContent>
        <TableContainer>
          <Table className={tableStyles.table}>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.results.map((product: any) => (
                <TableRow
                  key={product.id}
                  className={stockStatus === 'all' && product?.sku_count === 0 ? 'opacity-50' : ''}
                  onClick={() => {
                    if(currCategory!='F&B'&&!product.parent) setProductPreview({
                    id: product.id,
                    mainProduct: {
                      name: product.name,
                      id: product.id,
                      image: product.image[0].image
                    },
                    variants: product.variants.map((variant: any) => ({
                      name: variant.name,
                      id: variant.id,
                      image: variant.image[0].image
                    }))
                  })}}
                >
                  <TableCell>
                    <Link href={`/inventory/${product?.id}`}>
                      <Image
                        height={50}
                        width={100}
                        className='object-contain'
                        src={product.image[0]?.image??'https://dashboard.dev.sellersetu.in/assets/logo-DFpZRj9c.svg'}
                        alt={product.name}
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/inventory/${product?.id}`}>
                      {product.name}
                      <span className='text-sm ml-1 text-gray-500'>
                        {(product?.variants && (product?.variants?.length > 0 ? '(' + product?.variants?.length + ')' : ''))}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-6'>
                      <i className='tabler-pencil-plus text-primary cursor-pointer' />
                      <i className='tabler-trash text-error cursor-pointer' />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

const ResponsiveInventoryTable = ({
  sortOrder,
  stockStatus,
  productStatus,
  search,
  currCategory
}: {
  sortOrder: string
  stockStatus: string
  productStatus: string
  search: string
  currCategory: string
}) => {
  const isTablet = useMediaQuery('900px')

  return !isTablet ? (
    <InventoryTable currCategory={currCategory} sortOrder={sortOrder} stockStatus={stockStatus} productStatus={productStatus} search={search} />
  ) : (
    <InventoryTableDesktop
      currCategory={currCategory}
      sortOrder={sortOrder}
      stockStatus={stockStatus}
      productStatus={productStatus}
      search={search}
    />
  )
}

export default ResponsiveInventoryTable
