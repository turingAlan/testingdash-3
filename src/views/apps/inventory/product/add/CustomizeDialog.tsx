import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Grid,
  Typography,
  Checkbox,
  Select,
  MenuItem
} from '@mui/material'

interface FoodCustomization {
  name: string
  description: string
  sku_count: number
  uom: string
  uom_value: string
  veg: boolean
  selling_price: number
  cost_price: number
  mrp: number
  tax: number
  default: boolean
  is_active: boolean
  packaging_details: object
}

interface CustomizationGroup {
  name: string
  description: string
  min_allowed: number
  max_allowed: number
  sequence: number
  time: { days: number[]; range: { start: string; end: string } }
  parent: null | string
  food_customizations: FoodCustomization[]
}

const AddFoodCustomizationDialog = ({
  open,
  onClose,
  currentFoodCustomization,
  setCurrentFoodCustomization
}: {
  open: boolean
  onClose: () => void
  currentFoodCustomization: any
  setCurrentFoodCustomization: any
}) => {
    
  const handleChange = (e: any) => {
      const { name, value } = e.target;
      
      setCurrentFoodCustomization((prev:any) => ({ ...prev, [name]: value }));
    };

    const handleFoodCustomizationChange = (index:any, e:any) => {
      const { name, value, type, checked } = e.target;

      setCurrentFoodCustomization((prev: any) => {
        const updatedCustomizations = [...prev.food_customizations];

        updatedCustomizations[index] = {
          ...updatedCustomizations[index],
          [name]: type === 'checkbox' ? checked : value
        };

        return { ...prev, food_customizations: updatedCustomizations };
      });

    };

  const handleAddCustomization = () => {
    setCurrentFoodCustomization((prev: any) => ({
      ...prev,
      food_customizations: [
        ...prev?.food_customizations,
        {
          name: '',
          description: '',
          sku_count: '',
          uom: 'unit',
          uom_value: '',
          veg: true,
          selling_price: null,
          cost_price: null,
          mrp: null,
          tax: 0,
          default: false,
          is_active: true,
          packaging_details: {}
        }
      ]
    }))
  }

    const handleRemoveCustomization = (index: any) => {
      setCurrentFoodCustomization((prev: any) => {
        const updatedCustomizations = prev.food_customizations.filter(
          (_:any, i:any) => i !== index
        )
        
        return { ...prev, food_customizations: updatedCustomizations }
      })
    };

    const handleSave = () => {
      onClose();
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Add Customization Group</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Group Name'
              name='name'
              value={currentFoodCustomization.name}
              disabled={currentFoodCustomization?.id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Description'
              name='description'
              value={currentFoodCustomization.description}
              disabled={currentFoodCustomization?.id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Min Allowed'
              name='min_allowed'
              type='number'
              value={currentFoodCustomization.min_allowed}
              disabled={currentFoodCustomization?.id}
onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Max Allowed'
              name='max_allowed'
              type='number'
              value={currentFoodCustomization.max_allowed}
              disabled={currentFoodCustomization?.id}

               onChange={handleChange}
            />
          </Grid>

          {/* Food Customizations Section */}
          <Grid item xs={12}>
            <Typography variant='h5'>Food Customizations</Typography>
            {currentFoodCustomization?.food_customizations&&currentFoodCustomization.food_customizations.map((customization: any, index: number) => (
              <>
                <div className='flex justify-between items-center relative'>
                  <Typography variant='body1' className='mt-2 pb-1'>
                    Customization {index + 1}
                  </Typography>
                  <IconButton className='absolute bottom-0 right-0'
                    onClick={() => handleRemoveCustomization(index)}
                  >
                    <i className='tabler-x text-error text-[18px]' />
                  </IconButton>
                </div>
                <Grid container spacing={2} key={index} alignItems='center'>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Name'
                      name='name'
                      value={customization.name}

                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Description'
                      name='description'
                      value={customization.description}
                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Select
                      fullWidth
                      displayEmpty
                      value={customization.sku_count}
                      name='sku_count'
                      renderValue={(selected: any) => {
                        if (!selected) {
                          return <span className='opacity-80'>Sku count</span>
                        }

                        return selected
                      }}
                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                    >
                      <MenuItem value=''>
                        <span className='opacity-80'>Sku count</span>
                      </MenuItem>
                      <MenuItem value='1'>1 (In stock)</MenuItem>
                      <MenuItem value='0'>0 (Out of stock)</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label='Selling Price'
                      name='selling_price'
                      type='number'
                      value={customization.selling_price}

                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label='Cost Price'
                      name='cost_price'
                      type='number'
                      value={customization.cost_price}

                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label='Mrp'
                      name='mrp'
                      type='number'
                      value={customization.mrp}

                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <Select
                      fullWidth
                      displayEmpty
                      value={customization.tax}
                      name='tax'
                      renderValue={(selected: any) => {
                        if (!selected) {
                          return <span className='opacity-80'>Tax</span>
                        }

                        return selected
                      }}
                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                    >
                      <MenuItem value=''>
                        <span className='opacity-80'>Tax</span>
                      </MenuItem>
                      <MenuItem value='0'>0%</MenuItem>
                      <MenuItem value='3'>3%</MenuItem>
                      <MenuItem value='5'>5%</MenuItem>
                      <MenuItem value='12'>12%</MenuItem>
                      <MenuItem value='18'>18%</MenuItem>
                      <MenuItem value='28'>28%</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={2}>
                    <Checkbox
                      name='veg'
                      checked={customization.veg}

                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                      color='primary'
                    />{' '}
                    Veg Only
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label='Uom'
                      name='uom_value'
                      value={customization.uom_value}

                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Select fullWidth displayEmpty value={customization.uom}>
                      <MenuItem value='unit'>unit</MenuItem>
                      <MenuItem value='dozen'>dozen</MenuItem>
                      <MenuItem value='gram'>gram</MenuItem>
                      <MenuItem value='kilogram'>kilogram</MenuItem>
                      <MenuItem value='tonne'>tonne</MenuItem>
                      <MenuItem value='litre'>litre</MenuItem>
                      <MenuItem value='millilitre'>millilitre</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={3}>
                    <Checkbox
                      name='default'
                      checked={customization.default}

                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                      color='primary'
                    />{' '}
                    Default Customization
                  </Grid>
                  <Grid item xs={2}>
                    <Checkbox
                      name='is_active'
                      checked={customization.is_active}

                      onChange={(e) => handleFoodCustomizationChange(index, e)}
                      color='primary'
                    />{' '}
                    Active
                  </Grid>
                </Grid>
              </>
            ))}

            <Button
              startIcon={<i className='tabler-plus' />}
              color='primary'
              onClick={handleAddCustomization}
              style={{ marginTop: 10 }}
            >
              Add Customization
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color='primary'
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFoodCustomizationDialog
