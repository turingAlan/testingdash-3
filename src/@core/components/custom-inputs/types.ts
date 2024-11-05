'use client'

// React Imports
import type { ChangeEvent, ReactNode } from 'react'

// MUI Imports
import type { GridProps } from '@mui/material/Grid'

// Type Imports
import type { ThemeColor } from '@core/types'

// Types of Horizontal Custom Inputs
export type CustomInputHorizontalData = {
  value: string
  content?: ReactNode
  isSelected?: boolean
} & (
  | {
      meta: ReactNode
      title: ReactNode
    }
  | {
      meta?: never
      title?: never
    }
  | {
      title: ReactNode
      meta?: never
    }
)
export type CustomInputHorizontalProps = {
  name: string
  color?: ThemeColor
  gridProps?: GridProps
  data: CustomInputHorizontalData
} & (
  | {
      type: 'checkbox'
      selected: string[]
      handleChange: (value: string) => void
    }
  | {
      type: 'radio'
      selected: string
      handleChange: (value: string | ChangeEvent<HTMLInputElement>) => void
    }
)

// Types of Vertical Custom Inputs
export type CustomInputVerticalData = {
  value: string
  title?: ReactNode
  content?: ReactNode
  isSelected?: boolean
  asset?: ReactNode
}
export type CustomInputVerticalProps = {
  name: string
  color?: ThemeColor
  gridProps?: GridProps
  data: CustomInputVerticalData
  disabled?: boolean
} & (
  | {
      type: 'checkbox'
      selected: string[]
      handleChange: (value: string) => void
    }
  | {
      type: 'radio'
      selected: string
      handleChange: (value: string | ChangeEvent<HTMLInputElement>) => void
    }
)

// Types of Custom Inputs with Images
export type CustomInputImgData = {
  alt?: string
  value: string
  img: string
  isSelected?: boolean
}

export type CustomInputImgDataDelivery = {
  alt?: string
  value: string
  img: string
  isSelected?: boolean
  deliverType?: string
}
export type CustomInputImgProps = {
  name: string
  isThumbnail?: boolean
  color?: ThemeColor
  gridProps: GridProps
  data: CustomInputImgData
} & (
  | {
      type: 'checkbox'
      selected: string
      handleChange: (value: string) => void
    }
  | {
      type: 'radio'
      selected: string
      handleChange: (value: string | ChangeEvent<HTMLInputElement>) => void
    }
)
