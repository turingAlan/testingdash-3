'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { dummyTaxonomy } from '@/data/taxonomy'

const ProductVariants = () => {
  const category = 'Fashion'
  const sub_category = 'Shirts'

  const details = dummyTaxonomy[category].sub_categories[sub_category].attributes
  const mandatory = details.mandatory
  const optional = details.optional

  // States
  const [count, setCount] = useState(1)
  const [optionalDatails, setOptionalDatails] = useState([])

  // Handlers
  const handleOptionalDatailsChange = (e: any) => {
    setOptionalDatails(e.target.value)
  }

  const deleteForm = (e: SyntheticEvent) => {
    e.preventDefault()

    // @ts-ignore
    e.target.closest('.repeater-item').remove()
  }

  return (
    <Card>
      <CardHeader title='Extra details' />
      <CardContent>
        <Grid item xs={12} className=''>
          <Grid container spacing={5}>
            {Object.keys(mandatory).map((ele, index) => {
              return (
                <Grid key={index} item xs={12} md={6}>
                  <TextField fullWidth label={ele} />
                </Grid>
              )
            })}
          </Grid>
          <br />
          {
            <Select
              value={optionalDatails}
              onChange={handleOptionalDatailsChange}
              renderValue={selected => {
                if (selected.length === 0) {
                  return <span className='opacity-80'>Select Optional Details</span>
                }

                return (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', transform: 'translateY(-3px)' }}>
                    {selected.map((value: string) => (
                      <div
                        key={value}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '1rem',
                          backgroundColor: '#e0e0e0',
                          fontSize: '0.8rem'
                        }}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                )
              }}
              multiple
              fullWidth
              displayEmpty
              sx={{ paddingRight: '0.5rem' }}
            >
              {Object.keys(optional).map((ele, index) => {
                return (
                  <MenuItem key={index} value={ele}>
                    {ele}
                  </MenuItem>
                )
              })}
            </Select>
          }
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductVariants
