// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const ProductAddHeader = () => {
  return (
    <div className='flex flex-wrap items-center justify-between gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          Add a new product
        </Typography>
      </div>
      <div className='flex flex-wrap gap-4'>
        <Button variant='outlined' color='secondary'>
          Discard
        </Button>
        <Button variant='outlined'>Save Draft</Button>
        <Button variant='contained'>Publish Product</Button>
      </div>
    </div>
  )
}

export default ProductAddHeader
