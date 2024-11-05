'use client'

// React Imports
import { useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'

// import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// import Checkbox from '@mui/material/Checkbox'

// import Chip from '@mui/material/Chip'
// import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'

// import Tooltip from '@mui/material/Tooltip'
import TablePagination from '@mui/material/TablePagination'

// import type { TextFieldProps } from '@mui/material/TextField'

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
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { Button } from '@mui/material'

// import { formatDateIso } from '@/utils/string'

// Type Imports
// import type { ThemeColor } from '@core/types'
import type { PaymentType } from '@/types/apps/invoiceTypes'

// import type { Locale } from '@configs/i18n'

// Component Imports
// import OptionMenu from '@core/components/option-menu'
// import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
// import { getInitials } from '@/utils/getInitials'
// import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { orderSatusColor } from '@/utils/colorsInfo'
import CustomChip from '@/@core/components/mui/Chip'

// import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export type EventDateType = Date | null | undefined

type PaymentTypeWithAction = PaymentType & {
  action?: string
}

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

// const DebouncedInput = ({
//   value: initialValue,
//   onChange,
//   debounce = 500,
//   ...props
// }: {
//   value: string | number
//   onChange: (value: string | number) => void
//   debounce?: number
// } & Omit<TextFieldProps, 'onChange'>) => {
//   // States
//   const [value, setValue] = useState(initialValue)

//   useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value)
//     }, debounce)

//     return () => clearTimeout(timeout)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value])

//   return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
// }

// Column Definitions
const columnHelper = createColumnHelper<PaymentTypeWithAction>()

const InvoiceListTable = ({ paymentData }: { paymentData: PaymentType[] }) => {
  // States
  const [status, setStatus] = useState('')
  const [filter, setFilter] = useState('-created_at')
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[paymentData])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<PaymentTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Order no.',
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={`payment/${row.original.id}`}
            color='primary'
          >{`#${row.original.bap_order_id}`}</Typography>
        )
      }),
      columnHelper.accessor('order_status', {
        header: 'Order Status',
        cell: ({ row }) => {
          const bgColor = orderSatusColor(row.original.order_status)

          return (
            <CustomChip
              round='true'
              size='small'
              label={row.original.order_status}
              style={{ backgroundColor: bgColor, color: '#fafafa', fontWeight: 100 }}
            />
          )
        }
      }),
      columnHelper.accessor('net_amount', {
        header: 'Net Amount',
        cell: ({ row }) => <Typography>{`₹${row.original.net_amount}`}</Typography>
      }),
      columnHelper.accessor('payment_status', {
        header: 'Payment Status',
        cell: ({ row }) => {
          const bgColor = orderSatusColor(row.original.payment_status)

          return (
            <CustomChip
              round='true'
              size='small'
              label={row.original.payment_status}
              style={{ backgroundColor: bgColor, color: '#fafafa', fontWeight: 100 }}
            />
          )
        }
      }),
      columnHelper.accessor('payment_type', {
        header: 'Payment Type',
        cell: ({ row }) => <Typography>{`${row.original.payment_type}`}</Typography>
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as PaymentType[],
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
        pageSize: 15
      }
    },
    enableRowSelection: true,
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
    <Card>
      <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
        <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
          <CustomTextField
            select
            id='select-filter'
            value={filter}
            onChange={e => {
              setFilter(e.target.value)
              table.resetPageIndex(true)
            }}
            className='is-[160px]'
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value='net_amount'>Amount (Low to high)</MenuItem>
            <MenuItem value='-net_amount'>Amount (High to low)</MenuItem>
            <MenuItem value='created_at'>Time Oldest</MenuItem>
            <MenuItem value='-created_at'>Time Newest</MenuItem>
          </CustomTextField>
          <CustomTextField
            select
            id='select-status'
            value={status}
            onChange={e => {
              setStatus(e.target.value)
              table.resetPageIndex(true)
            }}
            className='is-[160px]'
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Order Status</MenuItem>
            <MenuItem value='Pending'>Pending</MenuItem>
            <MenuItem value='Return'>Return</MenuItem>
            <MenuItem value='Packed'>Packed</MenuItem>
            <MenuItem value='Processing'>Processing</MenuItem>
            <MenuItem value='Completed'>Completed</MenuItem>
            <MenuItem value='Cancelled'>Cancelled</MenuItem>
          </CustomTextField>
        </div>
        <Button variant='contained' color='primary' onClick={() => {}}>
          Export <i className='tabler-arrow-bar-up text-[22px]' />
        </Button>
      </CardContent>
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
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
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
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default InvoiceListTable
