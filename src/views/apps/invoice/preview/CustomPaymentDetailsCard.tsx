'use client'

// React Imports
import { useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
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

// Style Imports
import { Button } from '@mui/material'

import tableStyles from '@core/styles/table.module.css'
import CustomChip from '@/@core/components/mui/Chip'

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

type dataType = {
  sNo: string
  name: string
  rate: string
  quantity: number
  total: number
}

const orderData: dataType[] = [
  {
    sNo: '001',
    name: 'OnePlus 7 Pro',
    rate: '799',
    quantity: 1,
    total: 799
  },
  {
    sNo: '002',
    name: 'Magic Mouse',
    rate: '89',
    quantity: 1,
    total: 89
  },
  {
    sNo: '003',
    name: 'Wooden Chair',
    rate: '289',
    quantity: 2,
    total: 578
  },
  {
    sNo: '004',
    name: 'Air Jordan',
    rate: '299',
    quantity: 2,
    total: 598
  }
]

// Column Definitions
const columnHelper = createColumnHelper<dataType>()

const OrderTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[orderData])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<dataType, any>[]>(

    // onClick on hole ffm should redirect to edit function
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('sNo', {
        header: 'Serial Number',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <img src={row.original.productImage} alt={row.original.productName} height={34} /> */}
            <div>
              <Typography color='text.primary' className='font-medium'>
                {row.original.sNo}
              </Typography>
              {/* <Typography variant='body2' color='textSecondary'>
                {row.original.brand}
              </Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Typography>{`${row.original.name}`}</Typography>
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: ({ row }) => <Typography>{`${row.original.quantity}`}</Typography>
      }),
      columnHelper.accessor('rate', {
        header: 'Rate',
        cell: ({ row }) => <Typography>{`${row.original.rate}`}</Typography>
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: ({ row }) => <Typography>{`₹${row.original.total}`}</Typography>
      })

      // columnHelper.accessor('operation', {
      //   header: 'Operation',
      //   cell: ({ row }) => (
      //     <Button variant='outlined' color='primary'>
      //       <Typography>{`${row.original.operation}`}</Typography>
      //     </Button>
      //   )
      // })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as dataType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
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
    <div className='overflow-x-auto'>
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
            {table
              .getRowModel()
              .rows.slice(0, table.getState().pagination.pageSize)
              .map(row => {
                return (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className='first:is-14'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
          </tbody>
        )}
      </table>
    </div>

    // pagination
  )
}

const CustomPaymentDetailsCard = ({ paymentNumber }: { paymentNumber: string }) => {
  return (
    <Card>
      <CardHeader
        title={`Payment No ${paymentNumber}`}
        action={
          <CustomChip
            label='Paid'
            color='success'
            sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: '0.75rem' }}
          />
        }
      />
      <OrderTable />
      <br />
    </Card>
  )
}

export default CustomPaymentDetailsCard
