'use client'

import ProductPage from '@/views/apps/inventory/product'

export default function ProdcutId({ params }: { params: { product_id: string | number } }) {
  const { product_id } = params

  if (!product_id) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ProductPage pid={product_id} />
    </>
  )
}
