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

import { CardContent, DialogTitle } from '@mui/material'

import DialogCloseButton from '../DialogCloseButton'

import tableStyles from '@core/styles/table.module.css'
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
  variant: string | number
  image: string
  reasonId?: string
}

type OrderItemsDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  data: TotalItems[]
}

const OrderItemsDialog = ({ open, setOpen, title, data }: OrderItemsDialogProps) => {
  const handleClose = () => {
    setOpen(false)
  }

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<TotalItems, any>[]>(
    () => {
      return [
        columnHelper.accessor('name', {
          header: 'Product',
          cell: ({ row }) => {
            console.log(row.original.image, 'here is the image')
            
return (
              <div className='flex items-center gap-3'>
                {/* <ProgressiveImage src={row.original?.image} alt={row.original.name} height={34} /> */}
                <div>
                  <Typography color='text.primary' className='font-medium'>
                    {row.original.name}
                  </Typography>
                </div>
              </div>
            )
          }
        }),
        columnHelper.accessor('variant', {
          header: 'variant',
          cell: ({ row }) => <Typography>{`Variant ${row.original.variant ?? 0}`}</Typography>
        }),
        columnHelper.accessor('quantity', {
          header: 'Qty',
          cell: ({ row }) => <Typography>{`${row.original.quantity} unit`}</Typography>
        }),
        columnHelper.accessor('reasonId', {
          header: 'Cancellation Reason',
          cell: ({ row }) => <Typography>{row.original.reasonId}</Typography>
        })
      ]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as TotalItems[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },

    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle>{title}</DialogTitle>

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
    </>
  )
}

export default OrderItemsDialog
