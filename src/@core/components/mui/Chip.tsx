'use client'

// React Imports
import React from 'react'

// Mui Imports
import MuiChip from '@mui/material/Chip'
import { styled } from '@mui/material'
import type { ChipProps } from '@mui/material/Chip'

export type CustomChipProps = ChipProps & {
  round?: 'true' | 'false'
  circular?: 'true' | 'false'
}

const Chip = styled(MuiChip)<CustomChipProps>(({ round, circular }) => {
  return {
    '&': {
      ...(round === 'true' && {
        borderRadius: 16
      }),
      ...(circular === 'true' && {
        borderRadius: 9999,
        height: 10,
        width: 10
      })
    }
  }
})

const CustomChip = (props: CustomChipProps) => <Chip {...props} />

export default CustomChip
