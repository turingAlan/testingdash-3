import type { ImgHTMLAttributes } from 'react';
import React, { useState } from 'react'

import imageNotFoundSellersetu from '@/assets/KYCCard.webp'

import { useEssentialDataStore } from '@/@core/stores'

interface ProgressiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode
  src: string
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = props => {
  console.log(props.src, 'here is the src')
  const { fallback, src, ...restProps } = props

  const { organizationData: tenantData } = useEssentialDataStore()

  const [error, setError] = useState(false)

  const tenantLogo = tenantData?.logo ? tenantData?.logo : '/images/logos/logo.svg'

  const handleBrokenLink = () => {
    setError(true)
  }

  if (error && fallback && !src) {
    return <>{fallback}</>
  }

  if ((error && !fallback) || !src) {
    return (
      <img
        {...restProps}
        src={tenantLogo ? tenantLogo : '/images/logos/logo.svg'}
        alt={tenantData.name ?? 'Sellersetu logo'}
      />
    )
  }

  return <img src={src} {...restProps} onError={handleBrokenLink} />
}

export default ProgressiveImage
