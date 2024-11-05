'use client'

// MUI Imports

import { useState } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'

// import Divider from '@mui/material/Divider'
// import Switch from '@mui/material/Switch'
// import Typography from '@mui/material/Typography'

// import Divider from '@mui/material/Divider'
// import Switch from '@mui/material/Switch'
// import Typography from '@mui/material/Typography'

// Component Imports
import { MenuItem, Select } from '@mui/material'

import Form from '@components/Form'

const ProductPricing = () => {
  const [isChecked, setIsChecked] = useState(false)
  const [code, setCode] = useState('1')
  const [subcategory, setSubcategory] = useState('')

  const handleSubcategoryChange = (event: any) => {
    setSubcategory(event.target.value)
  }

  const handleCodeChange = (event: any) => {
    setCode(event.target.value)
  }

  return (
    <Card>
      <CardHeader title='Pricing' />
      <CardContent>
        <TextField fullWidth label='Selling Price' className='mbe-5' />
        <TextField fullWidth label='MRP' className='mbe-5' />
        <TextField fullWidth label='Cost Price' className='mbe-5' />
        <div className='w-full flex gap-2'>
          <Select
            value={code}
            onChange={handleCodeChange}
            displayEmpty
            sx={{ paddingRight: '0.5rem' }}
            defaultValue='1'
          >
            <MenuItem value='4'>HSN</MenuItem>
            <MenuItem value='3'>GTIN</MenuItem>
            <MenuItem value='1'>EAN</MenuItem>
            <MenuItem value='5'>Other</MenuItem>
          </Select>
          <TextField label='Code' />
        </div>
        <br />
        <FormControlLabel
          control={<Checkbox checked={isChecked} onChange={() => setIsChecked(prev => !prev)} />}
          label='Charge tax on this product'
        />
        {isChecked ? (
          <Select
            value={subcategory}
            onChange={handleSubcategoryChange}
            displayEmpty
            fullWidth
            renderValue={selected => {
              if (selected.length === 0) {
                return <span className='opacity-80'>Select Tax</span>
              }

              return selected
            }}
          >
            <MenuItem value='tax1'>tax 1</MenuItem>
            <MenuItem value='tax2'>tax 2</MenuItem>
            <MenuItem value='tax3'>tax 3</MenuItem>
          </Select>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default ProductPricing
