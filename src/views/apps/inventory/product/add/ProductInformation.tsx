'use client'

// React Imports
import { useState } from 'react'

import { Controller } from 'react-hook-form'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { MenuItem, Select } from '@mui/material'


// Third-party Imports
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'

// Style Imports
import '@/libs/styles/tiptapEditor.css'
import CustomTextField from '@/@core/components/mui/TextField'

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className='tabler-bold text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className='tabler-underline text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className='tabler-italic text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className='tabler-strikethrough text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className='tabler-align-left text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i className='tabler-align-center text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i className='tabler-align-right text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i className='tabler-align-justify text-textSecondary' />
      </CustomIconButton>
    </div>
  )
}

const ProductInformation = ({ control, errors }: any) => {
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],

    content: `
      <p>
        Add your product description here
        Add your product description here
      </p>
    `
  })

  return (
    <Card>
      <CardHeader title='Product Information' />
      <CardContent>
        <Grid container spacing={5} className='mbe-5'>
          <Grid item xs={12}>
            <Controller
              name='productName'
              control={control}
              rules={{ required: true }}
              render={({ field }: { field: any }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Product Name'
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  error={errors.productName}
                  helperText={errors.productName ? errors.productName.message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='brand'
              control={control}
              rules={{ required: true }}
              render={({ field }: { field: any }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Brand'
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  error={errors.brand}
                  helperText={errors.brand ? errors.brand.message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='subcategory'
              control={control}
              rules={{ required: true }}
              render={({ field }: { field: any }) => (
                <Select
                  {...field}
                  value={field.value}
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  displayEmpty
                  fullWidth
                  renderValue={selected => {
                    if(field.value.length === 0) {
                      return <span className='opacity-80'>Select Subcategory</span>
                    }
                    
                    return selected
                  }}
                >
                  <MenuItem value='subcategory1'>Subcategory 1</MenuItem>
                  <MenuItem value='subcategory2'>Subcategory 2</MenuItem>
                  <MenuItem value='subcategory3'>Subcategory 3</MenuItem>
                </Select>
              )}
            />
          </Grid>
        </Grid>
        <Typography className='mbe-1'>Description</Typography>
        <Typography className='mbe-1'>Description</Typography>
        <Card className='p-0 border shadow-none'>
          <CardContent className='p-0'>
            <EditorToolbar editor={editor} />
            <Divider className='mli-5' />
            <EditorContent editor={editor} className='bs-[135px] overflow-y-auto flex ' />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default ProductInformation
