'use client'

// MUI Imports
import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import { DialogTitle, FormControlLabel, IconButton, InputAdornment, Radio, RadioGroup } from '@mui/material'

import { toast } from 'react-toastify'

import DialogCloseButton from '../DialogCloseButton'
import { cancelReasons } from '@/data/orderFlowConstants'
import CustomTextField from '@/@core/components/mui/TextField'

type OrderCancelDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  handleOnConfirmation: any
  maxQuantity: number
}

const OrderItemCancelDialog = ({ open, setOpen, handleOnConfirmation, maxQuantity }: OrderCancelDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('')

  const [selectedQuanity, setSelectedQuantity] = useState<number>(parseInt(maxQuantity.toString()))

  const handleConfirmation = () => {
    if (!selectedReason || selectedQuanity <= 0) {
      toast.error('Please select a reason and quantity')

      return
    }

    setOpen(false)
    handleOnConfirmation(selectedReason, selectedQuanity)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDecrement = () => {
    setSelectedQuantity(prev => prev - 1)
  }

  const handleIncrement = () => {
    setSelectedQuantity(prev => prev + 1)
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle>Please select the reason and quantity of cancelling the order item</DialogTitle>

        <DialogContent className='flex flex-col'>
          <CustomTextField
            className='w-30'
            label='Quantity'
            value={selectedQuanity}
            type='tel'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <IconButton onClick={handleDecrement} edge='start' disabled={selectedQuanity <= 1}>
                    <i className={`tabler-minus w-4 h-4`} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleIncrement} edge='end' disabled={selectedQuanity >= maxQuantity}>
                    <i className={`tabler-plus w-4 h-4'`} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <RadioGroup
            row
            value={selectedReason}
            onChange={e => {
              setSelectedReason(e.target.value)
            }}
          >
            {cancelReasons
              .filter(reason => {
                return reason.id !== '007'
              })
              .map((reason, index) => {
                return <FormControlLabel key={index} value={reason.id} control={<Radio />} label={reason.label} />
              })}
          </RadioGroup>
        </DialogContent>
        <DialogActions className='justify-center '>
          <Button variant='contained' onClick={handleConfirmation}>
            Yes
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OrderItemCancelDialog
