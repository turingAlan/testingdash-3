'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'

// import FormControl from '@mui/material/FormControl'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'
import { Divider, Switch, Typography } from '@mui/material'

// import FormControl from '@mui/material/FormControl'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'

const ProductOrganize = () => {
  // States

  // const [vendor, setVendor] = useState('')
  // const [category, setCategory] = useState('')
  // const [collection, setCollection] = useState('')
  // const [status, setStatus] = useState('')

  const [allowReturns, setAllowReturns] = useState(false)

  return (
    <Card>
      <CardHeader title='Logistics Information' />
      <CardHeader title='Logistics Information' />
      <CardContent>
        <Typography className='mbe-4 opacity-80'>After Packing Details</Typography>
        <div className='flex gap-2'>
          <TextField fullWidth label='Length' placeholder='Enter in cm' className='mbe-4' />
          <TextField fullWidth label='Breadth' placeholder='Enter in cm' className='mbe-4' />
        </div>
        <div className='flex gap-2'>
          <TextField fullWidth label='Height' placeholder='Enter in cm' className='mbe-4' />
          <TextField fullWidth label='Weight' placeholder='Enter in gram' className='mbe-4' />
        </div>
        <Divider className='mbe-4' />
        <Typography className='mbe-4 opacity-80'>Reverse Logistics</Typography>
        <div className='flex items-center justify-between'>
          <Typography>Allow Cancellations</Typography>
          <Switch />
        </div>
        <div className='flex items-center justify-between'>
          <Typography>Allow Returns</Typography>
          <Switch checked={allowReturns} onChange={() => setAllowReturns(!allowReturns)} />
        </div>
        <TextField fullWidth label='Return Period' className='mt-2' />
      </CardContent>
    </Card>
  )
}

export default ProductOrganize
