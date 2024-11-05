'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

const IdTrimString = ({ children, className }: Props) => {
  return (
    <>
      <span className={`hidden sm:inline-block ${className ? className : ''}`}>
        {typeof children === 'string' && children.length > 20
          ? `${children.slice(0, 10)}...${children.slice(-10)}`
          : children}
      </span>
      <span className={`sm:hidden inline-block ${className ? className : ''}`}>
        {typeof children === 'string' && children.length > 10
          ? `${children.slice(0, 5)}...${children.slice(-5)}`
          : children}
      </span>
    </>
  )
}

export default IdTrimString
