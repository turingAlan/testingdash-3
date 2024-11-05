'use client'
import { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Checkbox,
  Typography,
  Switch,
  Divider
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { object, string, boolean, record, pipe, minLength, optional, union, check } from 'valibot'

import { toast } from 'react-toastify'

import ProductVariants from './add/ProductVariants'
import ProductImage from './add/ProductImage'
import ProductAddHeader from './add/ProductAddHeader'
import ProductPricing from './add/ProductPricing'
import ProductOrganize from './add/ProductOrganize'
import useSubmitProduct from '@/@core/hooks/mutation/inventory/useProductSubmit'
import { useEssentialDataStore } from '@/@core/stores'
import CustomAvatar from '@/@core/components/mui/Avatar'
import axiosInstance from '@/@core/api/interceptor'
import AddFoodCustomizationDialog from './add/CustomizeDialog'
import useProduct from '@/@core/hooks/query/inventory/useProduct'

// Validation Schema
const productSchema = object({
  productName: pipe(string(), minLength(1, 'Product Name is required')),
  brand: string(),
  subcategory: union([
    pipe(string(), minLength(1, 'Subcategory is required')), // Case 1: When subcategory is a string
    object({
      name: pipe(string(), minLength(1, 'Subcategory name is required')) // Case 2: When subcategory is an object with a name property
    })
  ]),
  description: pipe(string(), minLength(1, 'Description is required')),
  packing: string(),
  recommended: string(),
  vegNonveg: string(),
  sellingPrice: pipe(string(), minLength(1, 'Selling Price is required')),
  mrp: string(),
  costPrice: pipe(string(), minLength(1, 'Cost Price is required')),
  code: string(),
  codeValue: string(),
  taxSlab: pipe(string(), minLength(1, 'Tax Slab is required')),
  uom_value: pipe(string(), minLength(1, 'Required')),
  uom: optional(string()),
  sku_count: pipe(string(), minLength(1, 'Required')),
  packing_details: object({
    weight: pipe(string(), minLength(1, 'Weight is required')),
    length: pipe(string(), minLength(1, 'Length is required')),
    width: pipe(string(), minLength(1, 'Width is required')),
    height: pipe(string(), minLength(1, 'Height is required'))
  }),
  allowCancellations: optional(boolean()),
  allowReturns: optional(boolean()),
  returnPeriod: optional(string()),
  attributes: record(
    string(),
    pipe(
      string(),
      minLength(1, fieldName => `${fieldName} is required`)
    )
  )
})

const ProductPage = ({ pid }: { pid?: string | number }) => {
  const { currentShopData, categoryMetaData, variantData } = useEssentialDataStore(state => state)
  const { setVariantData } = useEssentialDataStore()
  
  // Use optional chaining and nullish coalescing to safely access the properties
  const currCategory = currentShopData?.category?.category_detail?.name ?? ''

  // const currCategory = 'F&B'

  const subcategories = categoryMetaData?.[currCategory]?.sub_categories

  const [foodSubcategories, setFoodSubcategories] = useState<any[]>([])

  type ProductFormValues = {
    productName: string
    brand: string
    subcategory: any
    description: string
    sellingPrice: string
    packing: string
    recommended: string
    vegNonveg: string
    mrp: string
    costPrice: string
    code: string
    codeValue: string
    taxSlab: string
    uom_value: string
    uom: string
    sku_count: string
    packing_details: {
      weight: string
      length: string
      width: string
      height: string
    }
    allowCancellations: boolean
    allowReturns: boolean
    returnPeriod: string
    attributes: {
      [key: string]: string
    }
  }

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: valibotResolver(productSchema),
    defaultValues: {
      productName: '',
      brand: '',
      subcategory: '',
      description: '',
      sellingPrice: '',
      packing: '',
      recommended: 'recommended',
      vegNonveg: 'veg',
      mrp: '',
      costPrice: '',
      code: '4',
      codeValue: '',
      taxSlab: '0',
      uom_value: '',
      uom: 'unit',
      sku_count: '',
      packing_details: {
        weight: '',
        length: '',
        width: '',
        height: ''
      },
      allowCancellations: false,
      allowReturns: false,
      returnPeriod: '',
      attributes: {}
    }
  })

  const [files, setFiles] = useState<File[]| any[]>([])
  const [extraFile, setExtraFile] = useState<File|any>()
  const selectedSubcategory = watch('subcategory')
  const gender = watch('attributes.gender')

  const mandatory = selectedSubcategory ? subcategories[selectedSubcategory]?.attributes?.mandatory : []
  const optional = selectedSubcategory ? subcategories[selectedSubcategory]?.attributes?.optional : []

  const { data } = useProduct({ productId: pid })
  const { mutate: submitProduct, isLoading } = useSubmitProduct()
  const [selectedOptionalAttributes, setSelectedOptionalAttributes] = useState<string[]>([])
  const [addSubcategory, setAddSubcategory] = useState('')
  const [addFoodCustomizationPopup, setAddFoodCustomizationPopup] = useState(false)
  const [foodCustomizations, setFoodCustomizations] = useState<any[]>([])

  const [currentFoodCustomization, setCurrentFoodCustomization] = useState<any>({
    food_customizations: []
  })

  const getFoodSubcategories = () => {
    if (currCategory != 'F&B') return
    axiosInstance
      .get(`/ironcore/product-api/v0/food-products/get_categories/?store_id=${currentShopData?.id}`)
      .then(res => {
        setFoodSubcategories(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getFoodCustomizations = () => {
    if (currCategory != 'F&B' || !selectedSubcategory?.id || pid) return
    axiosInstance
      .get(`/ironcore/product-api/v0/customization-groups/?category_id=${selectedSubcategory?.id}`)
      .then(res => {
        const data = res.data

        const filter = data.map((customization: any) => {
          return {
            id: customization.id,
            name: customization.name,
            description: customization.description,
            sequence: customization.sequence,
            min_allowed: customization.min_allowed,
            max_allowed: customization.max_allowed,
            check: false,
            food_customizations: []
          }
        })

        setFoodCustomizations(filter)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getFoodSubcategories()
  }, [])

  useEffect(() => {
    setSelectedOptionalAttributes([])
    if(!pid) getFoodCustomizations()
  }, [selectedSubcategory])

  useEffect(() => {
    // Check if variantData.product exists and set default values on initial load
    if (variantData?.productName) {
      reset({
        ...variantData
      })
    }
  }, [variantData, reset])

  useEffect(() => {
    if (data) {
      const checkCode = data?.code ?? ''
      const codeParts = checkCode.split(':')
      
      const returnWindow = data.return_window;
      const days = returnWindow.match(/\d+/)[0];
      const subcategoryType = currCategory != 'F&B' ? data?.category?.name : data?.category

      reset({
        productName: data?.name ?? '',
        brand: data?.brand ?? '',
        subcategory: subcategoryType,
        description: data?.description ?? '',
        sellingPrice: data?.selling_price?.toString() ?? '',
        mrp: data?.mrp?.toString() ?? '',
        costPrice: data?.cost_price?.toString() ?? '',
        packing: data?.packing_charges?.toString() ?? '',
        taxSlab: data?.tax?.toString() ?? '',
        code: codeParts[0]?.toString() ?? '',
        codeValue: codeParts[1]?.toString() ?? '',
        recommended: !data?.recommended ? 'notRecommended' : 'recommended',
        vegNonveg: !data?.veg ? 'nonveg' : 'veg',
        packing_details: {
          length: data?.packaging_details?.after_packaging_length?.toString() ?? '',
          width: data?.packaging_details?.after_packaging_breadth?.toString() ?? '',
          height: data?.packaging_details?.after_packaging_height?.toString() ?? '',
          weight: data?.packaging_details?.after_packaging_weight?.toString() ?? ''
        },
        returnPeriod: data?.is_cancellable ?days: '0',
        allowCancellations: data?.is_cancellable ?? false,
        allowReturns: data?.is_returnable ?? false,
        sku_count: data?.sku_count?.toString() ?? '',
        uom_value: data?.uom_value?.toString() ?? '',
        uom: data?.uom ?? '',
        attributes: data?.attributes ?? {}
      })

      setFiles(data?.image)
      const extraInfo = data?.extra_info
      const sizeChartExtraInfo = extraInfo?.size_chart
      const backImageExtraInfo = extraInfo?.back_image
      const extraFile = sizeChartExtraInfo || backImageExtraInfo

      setExtraFile(extraFile?{
        id: extraFile?.id,
        image: extraFile.url,
      }:undefined)

      if(data?.customization_groups){
        const customGrps = data.customization_groups.map((e: any)=>{
          return {
            id: e.id,
            name: e.name,
            description: e.description,
            sequence: e.sequence,
            min_allowed: e.min_allowed,
            max_allowed: e.max_allowed,
            check: true,
            food_customizations: e.customizations
          }
        })

        setFoodCustomizations(customGrps)
      }
    }
  }, [data])

  // Updating `subcategory` field once `foodSubcategories` are loaded
useEffect(() => {
  if (currCategory === 'F&B' && data && foodSubcategories.length) {
    // Find the subcategory from foodSubcategories that matches data.category.name
    const initialSubcategory = foodSubcategories.find(sub => sub.name === data.category.name);
    
    if (initialSubcategory) {
      reset(prev => ({ ...prev, subcategory: initialSubcategory }));
    }
  }
}, [foodSubcategories]);

  // Handler for optional attribute changes
  const handleOptionalAttributesChange = (event: any) => {
    const { value } = event.target

    setSelectedOptionalAttributes(typeof value === 'string' ? value.split(',') : value)
  }
  
  console.log('foodcustomizations', foodCustomizations)

  const onSubmit = (data: any) => {
    console.log('Form Data:', data)

    const selectedFoodCustomization = foodCustomizations.filter(customization => customization.check)

    submitProduct(
      {
        ...data,
        pid: pid,
        selectedImages: files,
        extraFile: extraFile,
        isExtra: !!mandatory?.size_chart,
        selectedFoodCustomization: selectedFoodCustomization
      },
      {
        onSuccess: () => {
          toast.success('Product submitted successfully!')
          if (!variantData?.productName && currCategory != 'F&B' && !pid) setVariantData(data)
        },
        onError: error => {
          toast.error('Failed to submit product.')
          console.error('Submission error:', error)
        }
      }
    )
  }

  // clean up after it moves to prod
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form errors:', errors);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AddFoodCustomizationDialog
        open={addFoodCustomizationPopup}
        onClose={() => {
          setAddFoodCustomizationPopup(false)
          console.log(currentFoodCustomization)

          if (currentFoodCustomization.id) {
            setFoodCustomizations(prev =>
              prev.map(customization =>
                customization.id === currentFoodCustomization.id
                  ? { ...currentFoodCustomization, check: true }
                  : customization
              )
            )
          } else {
            setFoodCustomizations(prev => [
              ...prev,
              { ...currentFoodCustomization, id: `dummyid-${Date.now()}`, check: true }
            ])
          }

          setCurrentFoodCustomization({
            food_customizations: []
          })
        }}
        currentFoodCustomization={currentFoodCustomization}
        setCurrentFoodCustomization={setCurrentFoodCustomization}
      />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div className='flex flex-wrap items-center justify-between gap-6'>
            <div>
              <Typography variant='h4' className='mbe-1'>
                {!pid ? (variantData?.productName ? 'Add a variant' : 'Add a new product') : 'Edit the product'}
              </Typography>
            </div>
            <div className='flex flex-wrap gap-4'>
              <Link href={'/inventory'}>
                <Button variant='outlined' color='secondary'>
                  Discard
                </Button>
              </Link>
              <Button type='submit' variant='contained'
                disabled={isLoading}
              >
                Save product
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={6}>
            {/* Product Information */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Product Information' />
                <CardContent>
                  <Grid container spacing={5} className='mbe-5'>
                    <Grid item xs={12}>
                      <Controller
                        name='productName'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            label='Product Name'
                            {...field}
                            error={!!errors.productName}
                            helperText={errors.productName?.message}
                          />
                        )}
                      />
                    </Grid>
                    {currCategory != 'F&B' && (
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name='brand'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              fullWidth
                              label='Brand'
                              {...field}
                              error={!!errors.brand}
                              helperText={errors.brand?.message}
                            />
                          )}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='subcategory'
                        control={control}
                        render={({ field }) => (
                          <Select
                            fullWidth
                            {...field}
                            displayEmpty
                            error={!!errors.subcategory}
                            renderValue={selected => {
                              if (currCategory == 'F&B' && selected) {
                                return selected.name
                              } else if (selected) {
                                return selected
                              } else if (!selected) {
                                return <span className='opacity-80'>Select Subcategory</span>
                              }
                            }}
                          >
                            <MenuItem value=''>
                              <span className='opacity-80'>Select Subcategory</span>
                            </MenuItem>
                            {currCategory != 'F&B' &&
                              Object.keys(subcategories).map(subcategory => (
                                <MenuItem key={subcategory} value={subcategory}>
                                  {subcategory}
                                </MenuItem>
                              ))}
                            {currCategory == 'F&B' &&
                              foodSubcategories.map(subcategory => {
                                if (subcategory.is_active == true)
                                  return (
                                    <MenuItem key={subcategory.id} value={subcategory}>
                                      {subcategory.name}
                                    </MenuItem>
                                  )
                              })}
                          </Select>
                        )}
                      />
                    </Grid>
                    {currCategory == 'F&B' && (
                      <Grid item xs={12} sm={6}>
                        <div className='relative'>
                          <TextField
                            fullWidth
                            label='Add subcategory (optional)'
                            value={addSubcategory}
                            onChange={e => setAddSubcategory(e.target.value)}
                          />
                          <div
                            className='absolute top-4 cursor-pointer right-2'
                            onClick={() => {
                              if (addSubcategory) {
                                axiosInstance
                                  .post(
                                    `/ironcore/product-api/v0/food-products/create_category/?store_id=${currentShopData?.id}`,
                                    { name: addSubcategory }
                                  )
                                  .then(() => {
                                    toast.success('Category added sucessfully')
                                    setTimeout(() => {
                                      getFoodSubcategories()
                                    }, 1000)
                                    setAddSubcategory('')
                                  })
                                  .catch(() => {
                                    toast.error('Failed to add category')
                                  })
                              }
                            }}
                          >
                            <CustomAvatar
                              variant='rounded'
                              skin='light'
                              color='secondary'
                              sx={{ height: 24, width: 24 }}
                            >
                              <i className='tabler-plus text-sm' />
                            </CustomAvatar>
                          </div>
                        </div>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label='Description'
                            {...field}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            {/* Other Components */}
            <Grid item xs={12}>
              <ProductImage
                currCategory={currCategory}
                files={files}
                setFiles={setFiles}
                isExtra={!!mandatory?.size_chart}
                setExtraFile={setExtraFile}
                extraFile={extraFile}
              />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Extra details' />
                <CardContent>
                  <Grid item xs={12} className=''>
                    <Grid container spacing={5}>
                      <Grid item xs={6} md={3}>
                        <Controller
                          name='uom_value'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              fullWidth
                              label={'Uom value'}
                              type='number'
                              {...field}
                              error={!!errors.uom_value}
                              helperText={!!errors.uom_value ? 'Required' : ''}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Controller
                          name='uom'
                          control={control}
                          render={({ field }) => (
                            <Select fullWidth {...field} sx={{ paddingRight: '0.5rem' }} defaultValue='unit'>
                              <MenuItem value='unit'>unit</MenuItem>
                              <MenuItem value='dozen'>dozen</MenuItem>
                              <MenuItem value='gram'>gram</MenuItem>
                              <MenuItem value='kilogram'>kilogram</MenuItem>
                              <MenuItem value='tonne'>tonne</MenuItem>
                              <MenuItem value='litre'>litre</MenuItem>
                              <MenuItem value='millilitre'>millilitre</MenuItem>
                            </Select>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name='sku_count'
                          control={control}
                          render={({ field }) =>
                            currCategory == 'F&B' ? (
                              <Select
                                fullWidth
                                {...field}
                                displayEmpty
                                error={!!errors.sku_count}
                                renderValue={selected => {
                                  if (selected) {
                                    return selected
                                  } else if (!selected) {
                                    return <span className='opacity-80'>Select Sku count</span>
                                  }
                                }}
                              >
                                <MenuItem value=''>
                                  <span className='opacity-80'>Select Sku count</span>
                                </MenuItem>
                                <MenuItem value='1'>1 (In stock)</MenuItem>
                                <MenuItem value='0'>0 (Out of stock)</MenuItem>
                              </Select>
                            ) : (
                              <TextField
                                fullWidth
                                label={'Sku count'}
                                type='number'
                                {...field}
                                error={!!errors.sku_count}
                                helperText={!!errors.sku_count ? 'Required' : ''}
                              />
                            )
                          }
                        />
                      </Grid>
                      {currCategory == 'F&B' && (
                        <Grid item xs={12} md={6}>
                          <Controller
                            name='vegNonveg'
                            control={control}
                            render={({ field }) => (
                              <Select fullWidth {...field} sx={{ paddingRight: '0.5rem' }} defaultValue='unit'>
                                <MenuItem value='veg'>Vegetarian</MenuItem>
                                <MenuItem value='nonveg'>Non Vegetarian</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>
                      )}
                      {currCategory == 'F&B' && (
                        <Grid item xs={12} md={6}>
                          <Controller
                            name='recommended'
                            control={control}
                            render={({ field }) => (
                              <Select fullWidth {...field} sx={{ paddingRight: '0.5rem' }} defaultValue='unit'>
                                <MenuItem value='recommended'>Recommended</MenuItem>
                                <MenuItem value='notRecommended'>Not recommended</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>
                      )}

                      {currCategory != 'F&B' &&
                        Object.keys(mandatory).map((ele, index) => {
                          if (ele !== 'brand' && ele !== 'size_chart') {
                            return (
                              <Grid key={index} item xs={12} md={6}>
                                <Controller
                                  name={`attributes.${ele}`}
                                  control={control}
                                  render={({ field }) => {
                                    const attributeOptions = mandatory[ele] || []

                                    return attributeOptions.length === 0 ? (
                                      <TextField
                                        fullWidth
                                        label={ele}
                                        {...field}
                                        error={!!errors.attributes?.[ele]}
                                        helperText={!!errors.attributes?.[ele] ? 'Required' : ''}
                                      />
                                    ) : ele === 'size' ? (
                                      gender && attributeOptions[0]?.[gender] ? (
                                        <Select
                                          fullWidth
                                          {...field}
                                          error={!!errors.attributes?.[ele]}
                                          displayEmpty
                                          renderValue={selected => {
                                            if (!selected) {
                                              return <span className='opacity-80'>Select {ele}</span>
                                            }

                                            return selected
                                          }}
                                        >
                                          {attributeOptions[0][gender].map((option: string, idx: number) => (
                                            <MenuItem key={idx} value={option}>
                                              {option}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      ) : (
                                        <TextField
                                          fullWidth
                                          label={ele}
                                          {...field}
                                          error={!!errors.attributes?.[ele]}
                                          helperText={!!errors.attributes?.[ele] ? 'Required' : ''}
                                        />
                                      )
                                    ) : (
                                      <Select
                                        fullWidth
                                        {...field}
                                        error={!!errors.attributes?.[ele]}
                                        displayEmpty
                                        renderValue={selected => {
                                          if (!selected) {
                                            return <span className='opacity-80'>Select {ele}</span>
                                          }

                                          return selected
                                        }}
                                      >
                                        {attributeOptions.map((option: string, idx: number) => (
                                          <MenuItem key={idx} value={option}>
                                            {option}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    )
                                  }}
                                />
                              </Grid>
                            )
                          }
                        })}
                    </Grid>
                    <br />
                    <div className='relative'>
                      {selectedOptionalAttributes.length > 0 ? (
                        <i
                          className='tabler-x absolute top-4 right-10 z-50 cursor-pointer hover:text-error'
                          onClick={() => {
                            setSelectedOptionalAttributes([])
                          }}
                        />
                      ) : null}
                      {currCategory != 'F&B' && (
                        <Select
                          multiple
                          fullWidth
                          value={selectedOptionalAttributes}
                          onChange={handleOptionalAttributesChange}
                          displayEmpty
                          renderValue={selected =>
                            selected.length === 0 ? (
                              <span className='opacity-80'>Select Optional Attributes</span>
                            ) : (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {selected.map(value => (
                                  <div
                                    key={value}
                                    style={{
                                      display: 'inline-flex',
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
                          }
                        >
                          {Object.keys(optional).map((attr, index) => (
                            <MenuItem key={index} value={attr}>
                              {attr}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </div>
                    <Grid container spacing={5} marginTop={2}>
                      {/* Render selected optional attributes as TextFields */}
                      {selectedOptionalAttributes.map((attr, index) => (
                        <Grid key={index} item xs={12} md={6}>
                          <Controller
                            name={`attributes.${attr}`}
                            control={control}
                            defaultValue='' // Add default value to ensure the field is registered
                            render={({ field }) => (
                              <TextField
                                fullWidth
                                label={attr}
                                {...field}
                                error={!!errors.attributes?.[attr]}
                                helperText={!!errors.attributes?.[attr] ? 'Required' : ''}
                              />
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={6}>
            <Grid item xs={12} spacing={6}>
              <Card>
                <CardHeader title='Pricing' />
                <CardContent>
                  <Controller
                    name='sellingPrice'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        className='mbe-5'
                        type='number'
                        fullWidth
                        label='Selling Price'
                        {...field}
                        error={!!errors.sellingPrice}
                        helperText={errors.sellingPrice?.message}
                      />
                    )}
                  />
                  {currCategory != 'F&B' && (
                    <Controller
                      name='mrp'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          className='mbe-5'
                          fullWidth
                          type='number'
                          label='MRP'
                          {...field}
                          error={!!errors.mrp}
                          helperText={errors.mrp?.message}
                        />
                      )}
                    />
                  )}
                  <Controller
                    name='costPrice'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        className='mbe-5'
                        label='Cost Price'
                        type='number'
                        {...field}
                        error={!!errors.costPrice}
                        helperText={errors.costPrice?.message}
                      />
                    )}
                  />
                  {currCategory == 'F&B' && (
                    <Controller
                      name='packing'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          className='mbe-5'
                          label='Packing charge'
                          type='number'
                          {...field}
                          error={!!errors.costPrice}
                          helperText={errors.costPrice?.message}
                        />
                      )}
                    />
                  )}
                  {currCategory != 'F&B' && (
                    <div className='w-full flex gap-2'>
                      <Controller
                        name='code'
                        control={control}
                        render={({ field }) => (
                          <Select
                            className='mbe-5'
                            fullWidth
                            {...field}
                            displayEmpty
                            sx={{ paddingRight: '0.5rem' }}
                            defaultValue='1'
                          >
                            <MenuItem value='4'>HSN</MenuItem>
                            <MenuItem value='3'>GTIN</MenuItem>
                            <MenuItem value='1'>EAN</MenuItem>
                            <MenuItem value='5'>Other</MenuItem>
                          </Select>
                        )}
                      />
                      <Controller
                        name='codeValue'
                        control={control}
                        render={({ field }) => (
                          <TextField className='mbe-5' fullWidth label='Code' {...field} error={!!errors.codeValue} />
                        )}
                      />
                    </div>
                  )}
                  <div>Tax Slab:</div>
                  <Controller
                    name='taxSlab'
                    control={control}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        className='mbe-5'
                        {...field}
                        displayEmpty
                        renderValue={selected => {
                          if (selected.length === 0) {
                            return <span className='opacity-80'>Select Tax</span>
                          }

                          return selected + '%'
                        }}
                      >
                        <MenuItem value='0'>0%</MenuItem>
                        <MenuItem value='3'>3%</MenuItem>
                        <MenuItem value='5'>5%</MenuItem>
                        <MenuItem value='12'>12%</MenuItem>
                        <MenuItem value='18'>18%</MenuItem>
                        <MenuItem value='28'>28%</MenuItem>
                      </Select>
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Logistics Information' />
                <CardContent>
                  <Typography className='mbe-4 opacity-80'>After Packing Details</Typography>
                  <div className='flex gap-2'>
                    {/* <TextField fullWidth label='Length' placeholder='Enter in cm' className='mbe-4' /> */}
                    <Controller
                      name='packing_details.length'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label='Length'
                          type='number'
                          placeholder='Enter in cm'
                          className='mbe-4'
                          {...field}
                          error={!!errors.packing_details?.length}
                          helperText={!!errors.packing_details?.length ? 'Required' : ''}
                        />
                      )}
                    />
                    <Controller
                      name='packing_details.width'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label='Width'
                          type='number'
                          placeholder='Enter in cm'
                          className='mbe-4'
                          {...field}
                          error={!!errors.packing_details?.width}
                          helperText={!!errors.packing_details?.width ? 'Required' : ''}
                        />
                      )}
                    />
                  </div>
                  <div className='flex gap-2'>
                    <Controller
                      name='packing_details.height'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label='Height'
                          type='number'
                          placeholder='Enter in cm'
                          className='mbe-4'
                          {...field}
                          error={!!errors.packing_details?.height}
                          helperText={!!errors.packing_details?.height ? 'Required' : ''}
                        />
                      )}
                    />
                    <Controller
                      name='packing_details.weight'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label='Weight'
                          type='number'
                          placeholder='Enter in gram'
                          className='mbe-4'
                          {...field}
                          error={!!errors.packing_details?.weight}
                          helperText={!!errors.packing_details?.weight ? 'Required' : ''}
                        />
                      )}
                    />
                  </div>
                  <Divider className='mbe-4' />
                  <div>
                    <Typography className='opacity-80'>Reverse Logistics</Typography>
                    <div className='flex items-center justify-between'>
                      <Typography>Allow Cancellations</Typography>
                      <Controller
                        name='allowCancellations'
                        control={control}
                        render={({ field }) => {
                          return <Switch {...field} checked={field.value} />
                        }}
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <Typography>Allow Returns</Typography>
                      <Controller
                        name='allowReturns'
                        control={control}
                        render={({ field }) => {
                          return <Switch {...field} checked={field.value} />
                        }}
                      />
                    </div>
                    <Controller
                      name='returnPeriod'
                      control={control}
                      render={({ field }) => (
                        <div className='relative'>
                          <span className='absolute top-6 right-3 opacity-75'>Days</span>
                          <TextField fullWidth type='number' label='Return Period' className='mt-2' {...field} />
                        </div>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {currCategory == 'F&B' && (
        <Grid item xs={12} md={4} className='mt-6'>
          <Grid container spacing={6}>
            <Grid item xs={12} spacing={6}>
              <Card>
                <CardHeader
                  title='Customizations'
                  action={
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => {
                        if (selectedSubcategory) {
                          setAddFoodCustomizationPopup(true)
                        } else {
                          toast.error('Please select a subcategory first')
                        }
                      }}
                      disabled={!!pid}
                    >
                      Add Customizations
                    </Button>
                  }
                />
                <CardContent>
                  <div className='flex overflow-x-auto pb-2' style={{ display: 'flex', flexWrap: 'nowrap' }}>
                    {foodCustomizations.map((customization, index) => {
                      return (
                        <div key={index} className='relative flex flex-col gap-2 p-1 rounded border mx-2 min-w-[150px]'>
                          <Checkbox
                            className='absolute top-0 right-0'
                            checked={customization.check}
                            onChange={e => {
                              if (e.target.checked) {
                                setCurrentFoodCustomization(customization)
                                setAddFoodCustomizationPopup(true)
                              } else {
                                setFoodCustomizations(prev =>
                                  prev.map(item => (item.id === customization.id ? { ...item, check: false } : item))
                                )
                              }
                            }}
                          />
                          
                          <Typography variant='h6'>{customization.name}</Typography>
                          <Typography variant='body1'>{customization.description}</Typography>
                          <Typography>Sequence: {customization.sequence ?? index + 1}</Typography>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}
    </form>
  )
}

export default ProductPage
