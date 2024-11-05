'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Link from 'next/link'

import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// Component Imports
import DialogCloseButton from '../../DialogCloseButton'
import { useEssentialDataStore } from '@/@core/stores'

// Type Definitions
type ProductVariant = {
  id: string
  name: string
  image: string
}

type ProductPreviewProps = {
  open: boolean
  setOpen: (open: boolean) => void
  mainProduct: ProductVariant
  variants?: ProductVariant[]
}

const ProductPreview = ({ open, setOpen, variants = [], mainProduct }: ProductPreviewProps) => {
  const handleClose = () => {
    setOpen(false)
  }
  
  const router = useRouter()
  const { setVariantDataId } = useEssentialDataStore()

  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle sx={{ textAlign: 'center', padding: '2.5rem' }}>Product Preview</DialogTitle>
      <DialogContent sx={{ padding: '2.5rem' }}>
        <Grid container spacing={2} justifyContent='center' marginTop={1} style={{
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          maxWidth: '90vh',
        }}>
          {/* Main Product */}
          <Link href={`/inventory/${mainProduct.id}`}>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <img
              src={mainProduct?.image??'https://dashboard.dev.sellersetu.in/assets/logo-DFpZRj9c.svg'}
              alt={mainProduct.name}
              style={{
                width: 100,
                height: 80,
                borderRadius: 8,
                objectFit: 'contain',
                border: '1px solid #e0e0e0',
                padding: '0.5rem'
              }}
            />
            <Typography>{mainProduct.name}</Typography>
          </Grid>
          </Link>
          {variants?.map(variant => (
            <Link href={`/inventory/${variant.id}`} key={variant.id}>
            <Grid item xs={4} sx={{ textAlign: 'center' }}>
              <img
                src={variant?.image??'https://dashboard.dev.sellersetu.in/assets/logo-DFpZRj9c.svg'}
                alt={variant.name}
                style={{
                  width: 100,
                  height: 80,
                  borderRadius: 8,
                  objectFit: 'contain',
                  border: '1px solid #e0e0e0',
                  padding: '0.5rem'
                }}
              />
              <Typography>{variant.name}</Typography>
            </Grid>
            </Link>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', padding: '2.5rem' }}>
        <Button onClick={handleClose} variant='outlined'>
          Close
        </Button>
        <Button onClick={() => {
          setVariantDataId(mainProduct.id)
          router.push('/inventory/addproduct')
        }} variant='contained'>
          Add Variant
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductPreview
