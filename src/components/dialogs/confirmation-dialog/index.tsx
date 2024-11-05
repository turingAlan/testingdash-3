'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import DialogCloseButton from '../DialogCloseButton'

type ConfirmationType =
  | 'status-change-order'
  | 'status-change-fulfillment'
  | 'generate-refund'
  | 'accept-return'
  | 'pending-resolution'
  | string

type ConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  type: ConfirmationType
  handleOnConfirmation?: any
}

const ConfirmationDialog = ({ open, setOpen, type, handleOnConfirmation }: ConfirmationDialogProps) => {
  const handleConfirmation = () => {
    setOpen(false)
    handleOnConfirmation()
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='xs'
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogContent className='flex items-center flex-col text-center '>
          <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
          <>
            <Typography variant='h5'>
              {type === 'status-change-order' && 'Are you sure you want change order status?'}
              {type === 'status-change-fulfillment' && 'Are you sure you want change fulfillment status?'}
              {type === 'generate-refund' && 'Are you sure you want to generate refund?'}
              {type === 'accept-return' && 'Are you sure you want to accept return?'}
              {type === 'pending-resolution' && 'Are you sure you want handle this resolution?'}
            </Typography>

            <Typography color='error'>You won&#39;t be able to revert user!</Typography>
          </>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 '>
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

export default ConfirmationDialog
