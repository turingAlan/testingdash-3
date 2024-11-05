'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileProp = {
  name: string
  type: string
  size: number
  image?: string
}

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

// Styled Small Dropzone Component
const SmallDropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(6),  // Smaller padding for the second dropzone
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(3)
    }
  }
}))

const ProductImage = ({
  files,
  setFiles,
  isExtra,
  extraFile,
  setExtraFile,
  currCategory
}: {
  files: File[] | any[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  isExtra: boolean
  extraFile: File | any | undefined
  setExtraFile: React.Dispatch<React.SetStateAction<File | undefined>>
  currCategory: string
}) => {
  // Hooks for the main dropzone
  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map((file: File) => Object.assign(file))])
    }
  })

  // Separate hooks for the extra dropzone
  const { getRootProps: getExtraRootProps, getInputProps: getExtraInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setExtraFile(acceptedFiles[0]) // Only allowing one extra file in this dropzone
      }
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if( file?.image){
      return <img width={38} height={38} alt={file.name} src={file.image} />
    } else if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    }else {
      return <i className='tabler-file-text text-3xl p-1 mx-1' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp, index: number) => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name?file.name:('Image '+(index+1))}
          </Typography>
          {!file?.image&&<Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>}
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Dropzone>
      <Card>
        <CardHeader title='Product Image' sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }} />
        <CardContent>
          {/* Main Dropzone */}
          <div {...getMainRootProps({ className: 'dropzone' })}>
            <input {...getMainInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <i className='tabler-upload' />
              </CustomAvatar>
              <Typography variant='h4'>Drag and Drop Your Image Here.</Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='outlined' size='small'>
                Browse Image
              </Button>
            </div>
          </div>
          {files.length ? (
            <>
              <List>{fileList}</List>
              <div className='buttons'>
                {files.length>1? <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                  Remove All
                </Button>:null}
              </div>
            </>
          ) : null}
          
          {/* Extra Dropzone */}
          {isExtra && (
            <SmallDropzone>
              <Typography variant='h5' className='mt-6'>
                {currCategory=='Grocery'?"Back Image":"Size Chart"}
              </Typography>
              <div {...getExtraRootProps({ className: 'dropzone' })}>
                <input {...getExtraInputProps()} />
                <div className='flex items-center gap-2 text-center'>
                  <CustomAvatar variant='rounded' skin='light' color='secondary' sx={{ height: 24, width: 24 }}>
                    <i className='tabler-upload text-sm' />
                  </CustomAvatar>
                  <Typography variant='h5'>Drag and Drop Your Image Here</Typography>
                  <Typography color='text.disabled'>or</Typography>
                  <Button variant='outlined' size='small'>
                    {extraFile?'Change Image':'Browse Image'}
                  </Button>
                </div>

              </div>
                {extraFile && (
                  <ListItem className='pis-4 plb-3 extrafile justify-between border rounded border-gray-200 mt-4'>
                    <div className='file-details flex gap-4'>
                      <div className='file-preview'>{renderFilePreview(extraFile)}</div>
                      <div>
                        <Typography className='file-name font-medium' color='text.primary'>
                          {extraFile?.name??"Extra Image"}
                        </Typography>
                        {!extraFile?.image&&<Typography className='file-size' variant='body2'>
                          {Math.round(extraFile.size / 100) / 10 > 1000
                            ? `${(Math.round(extraFile.size / 100) / 10000).toFixed(1)} mb`
                            : `${(Math.round(extraFile.size / 100) / 10).toFixed(1)} kb`}
                        </Typography>}
                      </div>
                    </div>
                    <IconButton onClick={() => setExtraFile(undefined)}>
                      <i className='tabler-x text-xl' />
                    </IconButton>
                  </ListItem>
                )}
            </SmallDropzone>
          )}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default ProductImage
