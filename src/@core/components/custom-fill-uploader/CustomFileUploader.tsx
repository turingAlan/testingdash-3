// React Imports
import { useState } from 'react'

// MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { toast } from 'react-toastify'

// Icon Imports
import { useDropzone } from 'react-dropzone'

import type { CustomInputImgData } from '../custom-inputs/types'
import ProgressiveImage from '../custom-enhanced-image'

type CustomFileUploaderProps = {
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: { [key: string]: string[] }
  onUpload?: (files: CustomInputImgData[]) => void
  onRemove?: () => void
  disabled?: boolean
}

const CustomFileUploader: React.FC<CustomFileUploaderProps> = ({
  maxFiles = 2,
  maxSize = 2000000,
  acceptedTypes = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  },
  onUpload,
  onRemove,
  disabled = false
}) => {
  // States
  const [files, setFiles] = useState<CustomInputImgData[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    disabled: disabled,
    maxSize,
    accept: acceptedTypes,
    onDrop: (acceptedFiles: File[]) => {
      const fileObjects: CustomInputImgData[] = acceptedFiles.map((file: File) => {
        return {
          value: file.name,
          alt: file.name,
          img: URL.createObjectURL(file),
          isSelected: false // default selection state
        }
      })

      setFiles(fileObjects)
      if (onUpload) onUpload(fileObjects)
    },
    onDropRejected: () => {
      toast.error(`You can only upload ${maxFiles} files & maximum size of ${maxSize / 1000000} MB.`, {
        autoClose: 3000
      })
    }
  })

  const renderFilePreview = (file: CustomInputImgData) => {
    if (typeof file.img === 'string' && file.img.startsWith('blob:')) {
      return <ProgressiveImage width={38} height={38} alt={file?.alt || 'preview'} src={file.img as string} />
    } else if (file.img) {
      return file.img
    } else {
      // Default icon if no image is available
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveFile = (file: CustomInputImgData) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: CustomInputImgData) => i.value !== file.value)

    setFiles([...filtered])

    if (onRemove) {
      onRemove()
    }
  }

  const fileList = files.map((file: CustomInputImgData) => (
    <ListItem key={file.value}>
      <div className='flex justify-between items-center w-full'>
        <div className='file-details flex items-center'>
          <div className='file-preview mr-3'>{renderFilePreview(file)}</div>
          <div>
            <Typography className='file-name'>{file.value}</Typography>
            <Typography className='file-size' variant='body2'>
              Max File Size in {(maxSize / 1000000)?.toFixed(1)} MB
            </Typography>
          </div>
        </div>
        <IconButton onClick={() => handleRemoveFile(file)}>
          <i className='tabler-x text-xl' />
        </IconButton>
      </div>
    </ListItem>
  ))

  return (
    <>
      <div className='border-2 border-dashed border-neutral-300 rounded-lg p-2 cursor-pointer transition-colors duration-300'>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='flex items-center flex-col'>
            <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
              <i className='tabler-upload' />
            </Avatar>
            <Typography variant='h4' className='mbe-2.5' align='center'>
              Drop files here or click to upload.
            </Typography>
            <Typography>
              Allowed{' '}
              {acceptedTypes?.['image/*']
                .map(imageType => {
                  return `*${imageType}`
                })
                .join(', ')}
            </Typography>
            <Typography>
              Max {maxFiles} files and max size of {(maxSize / 1000000)?.toFixed(1)} MB
            </Typography>
          </div>
        </div>
      </div>
      <br />
      {files.length ? (
        <>
          <div className='border-2 border-neutral-600 rounded-lg p-1 cursor-pointer transition-colors duration-300'>
            <List>{fileList}</List>
          </div>
          <br />
        </>
      ) : null}
    </>
  )
}

export default CustomFileUploader
