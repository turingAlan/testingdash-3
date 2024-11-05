'use client'

// React Imports
import { useState, useMemo } from 'react'

import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'

import Dialog from '@mui/material/Dialog'

import { DialogTitle, MenuItem } from '@mui/material'

import DialogCloseButton from '../DialogCloseButton'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import { resolutionStatus } from '@/data/orderFlowConstants'
import ConfirmationDialog from '../confirmation-dialog'
import type { ProductImage } from '@/types/apps/orderTypes'
import useOrderResolution from '@/@core/hooks/mutation/userOrderResolution'
import ProgressiveImage from '@/@core/components/custom-enhanced-image'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Column Definitions
const columnHelper = createColumnHelper<TotalItems>()

interface TotalItems {
  id: string
  name: string
  quantity: number
  image: string
  description: string
}

type SelectedResolutionData = {
  confirmation: boolean
  resolutionStatus: string
  id: string
}

type OrderItemsDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data: any[]
}

const OrderResolutionDialog = ({ open, setOpen, data }: OrderItemsDialogProps) => {
  const { mutate: orderResolutionMutate } = useOrderResolution()

  const handleClose = () => {
    setOpen(false)
  }

  const resolutionData = useMemo(() => {
    return data.map(item => {
      const image = item?.product?.image?.find((image: ProductImage) => image?.is_thumbnail)?.image

      return {
        id: item.id,
        name: item.product.name,
        quantity: item.return_quantity,
        image: image,
        description: item.reason_description
      }
    })
  }, [data])

  const [selectedReslutionData, setSelectedResolutionData] = useState<SelectedResolutionData>({
    confirmation: false,
    resolutionStatus: '',
    id: ''
  })

  const handleResolutionChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setSelectedResolutionData({
      ...selectedReslutionData,
      confirmation: true,
      resolutionStatus: e.target.value,
      id: id
    })
  }

  const handleConfirmResolution = () => {
    orderResolutionMutate({
      method: {
        action: selectedReslutionData.resolutionStatus,
        id: selectedReslutionData.id
      }
    })
  }

  const columns = useMemo<ColumnDef<TotalItems, any>[]>(
    () => {
      return [
        columnHelper.accessor('name', {
          header: 'Product',
          cell: ({ row }) => {
            return (
              <div className='flex items-center gap-3'>
                <ProgressiveImage src={row.original?.image} alt={row.original.name} height={34} />
                <div>
                  <Typography color='text.primary' className='font-medium'>
                    {row.original.name}
                  </Typography>
                </div>
              </div>
            )
          }
        }),

        columnHelper.accessor('quantity', {
          header: 'Qty',
          cell: ({ row }) => <Typography>{`${row.original.quantity} unit`}</Typography>
        }),
        columnHelper.accessor('description', {
          header: 'Description',
          cell: ({ row }) => <Typography>{row.original.description}</Typography>
        }),
        columnHelper.accessor('id', {
          header: 'Description',
          cell: ({ row }) => (
            <CustomTextField
              select
              id='select-resoultion'
              value={selectedReslutionData.resolutionStatus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleResolutionChange(e, row.original.id)}
              className='is-[160px]'
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>Resolution Status</MenuItem>
              <MenuItem value={resolutionStatus.LIQUIDATION}>Liquidation</MenuItem>
              <MenuItem value={resolutionStatus.REJECT}>Reject</MenuItem>
              <MenuItem value={resolutionStatus.REVERSEQC}>Reverse QC</MenuItem>
            </CustomTextField>
          )
        })
      ]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: resolutionData as TotalItems[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },

    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <ConfirmationDialog
        open={selectedReslutionData.confirmation}
        setOpen={state => {
          setSelectedResolutionData({
            ...selectedReslutionData,
            confirmation: state
          })
        }}
        type='pending-resolution'
        handleOnConfirmation={handleConfirmResolution}
      />
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle>Resolution Pending</DialogTitle>

      <>
        <div className='overflow-x-auto sm:mb-7'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className='border-be'>
                {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
          <br />
        </div>
      </>
    </Dialog>
  )
}

export default OrderResolutionDialog
