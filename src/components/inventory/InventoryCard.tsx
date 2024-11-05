'use client'
import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

const InventoryCard = ({ product,currCategory }: { product: any, currCategory:string }) => {
  const [iconsVisible, setIconsVisible] = useState(false)
  
  return (
    <div
      className='w-[204px] relative'
      onMouseEnter={() => setIconsVisible(true)}
      onMouseLeave={() => setIconsVisible(false)}
    >
      <Link href={currCategory=='F&B'||product.parent?`/inventory/${product?.id}`:''}>
        <div className='img-container overflow-hidden flex flex-col rounded-xl hover:shadow border-2 border-gray-50 transition duration-200'>
          <Image
            className={`rounded border-2 p-1 object-contain ${iconsVisible ? 'scale-105' : ''} overflow-hidden border-gray-200/50 transition duration-200`}
            src={product?.image[0]?.image ?? 'https://dashboard.dev.sellersetu.in/assets/logo-DFpZRj9c.svg'}
            alt={product.name}
            width={200}
            height={135}
          />
          <div className='px-2 py-3'>{product?.name}</div>
          <i
            className={`tabler-trash text-error ${!iconsVisible ? 'opacity-0' : 'opacity-100'} text-[20px] transition duration-200 absolute top-2 left-2`}
          />
          <i
            className={`tabler-pencil text-primary ${!iconsVisible ? 'opacity-0' : 'opacity-100'} text-[20px] transition duration-200 absolute bottom-4 right-2`}
          />

          {product?.variants && product?.variants.length > 0 && (
            <div className='absolute top-2 right-2 px-2 py-1 text-xs text-[#fafafa] rounded-full bg-primary'>
              {product?.variants.length}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export default InventoryCard
