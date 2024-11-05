// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Import
import { Button } from '@mui/material'

import type { CustomInputImgData } from '@core/components/custom-inputs/types'

// Components Imports
import CustomInputImg from '@core/components/custom-inputs/Image'

interface CustomCheckboxImageSelectProps {
  imageObjects: CustomInputImgData[]
  handleChangeThumbnail: (image: string) => void
  handleRemoveImage: (image: string) => void
  disabled?: boolean
}

const CustomCheckboxImageSelect = ({
  imageObjects,
  handleChangeThumbnail,
  handleRemoveImage,
  disabled = false
}: CustomCheckboxImageSelectProps) => {
  const thumbnailImage: string = imageObjects.filter(item => item.isSelected)[0]?.value ?? imageObjects[0]?.value

  // States
  const [selected, setSelected] = useState<string>('')

  const handleChange = (value: string) => {
    setSelected(value)
  }

  return (
    <>
      <Grid container spacing={4}>
        {imageObjects.map((item, index) => (
          <CustomInputImg
            type='checkbox'
            isThumbnail={item.value === thumbnailImage}
            key={index}
            data={item}
            selected={selected}
            name='custom-checkbox-img'
            handleChange={handleChange}
            gridProps={{ sm: 4, xs: 12 }}
          />
        ))}
      </Grid>
      {selected && !disabled && (
        <>
          <div className='buttons flex justify-end gap-2 mt-2'>
            <Button color='error' variant='outlined' onClick={() => handleRemoveImage(selected)}>
              Remove {thumbnailImage === selected ? 'Thumbnail' : 'Image'}
            </Button>
            <Button
              disabled={thumbnailImage === selected}
              variant='contained'
              onClick={() => handleChangeThumbnail(selected)}
              startIcon={<i className='tabler-crown' />}
            >
              Make Thumbnail
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default CustomCheckboxImageSelect
