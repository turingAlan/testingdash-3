'use client'

// MUI Imports
import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import { DialogTitle, FormControlLabel, Radio, RadioGroup } from '@mui/material'

import { toast } from 'react-toastify'

import DialogCloseButton from '../DialogCloseButton'
import { cancelReasons } from '@/data/orderFlowConstants'

type OrderCancelDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  handleOnConfirmation: any
}

const OrderCancelDialog = ({ open, setOpen, handleOnConfirmation }: OrderCancelDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('')

  const handleConfirmation = () => {
    if (!selectedReason) {
      toast.error('Please select a reason')

      return
    }

    setOpen(false)
    handleOnConfirmation(selectedReason)
  }

  const handleClose = () => {
    setOpen(false)
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
        <DialogTitle>Please mention the reason of cancelling the complete order</DialogTitle>

        <DialogContent className='flex flex-col'>
          <RadioGroup
            row
            value={selectedReason}
            onChange={e => {
              setSelectedReason(e.target.value)
            }}
          >
            {cancelReasons.map((reason, index) => {
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

export default OrderCancelDialog
