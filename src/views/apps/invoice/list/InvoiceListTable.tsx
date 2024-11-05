'use client'

// React Imports
import { start } from 'repl'

import { useState, useEffect, useMemo, forwardRef, useCallback } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'

import MenuItem from '@mui/material/MenuItem'

import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

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
import type { ColumnDef, FilterFn, PaginationState } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { Badge, Button, CardHeader } from '@mui/material'

import { toast } from 'react-toastify'

import dayjs from 'dayjs'

import { formatDateIso } from '@/utils/string'

import type { OrdersResponse, OrderStatus, OrderType } from '@/types/apps/orderTypes'

import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { orderSatusColor } from '@/utils/colorsInfo'
import CustomChip from '@/@core/components/mui/Chip'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { orderStatus, readOnlyOrderStatus } from '@/data/orderFlowConstants'
import { getNextOrderStatus } from '@/utils/getNextOrderStatus'
import useOrderStatus from '@/@core/hooks/mutation/useOrderStatus'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import IdTrimString from '@/components/IdTrimString'

import useExportOrderData from '@/@core/hooks/query/useExportOrderData'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export type EventDateType = Date | null | undefined

type OrderTypeWithAction = OrderType & {
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

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 700,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

interface DateType {
  endDate: Date | string
  startDate: Date | string
}

const defaultDateState: DateType = {
  endDate: new Date(),
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7)
}

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface SelectedOrder {
  id: string
  status: OrderStatus | string
}

// Column Definitions
const columnHelper = createColumnHelper<OrderTypeWithAction>()

const InvoiceListTable = ({ invoiceData, isLoading }: { invoiceData: OrdersResponse; isLoading: boolean }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()

  const { lang: locale } = params

  // States
  const orderStatusFilter = searchParams.get('order_status') || ''
  const searchValueFilter = searchParams.get('search') || ''
  const pageIndex = searchParams.get('page') || 1

  // Phone number filter for redirection from customer page
  const phone = searchParams.get('phone') || ''

  // const dateValueFilter = searchParams.get('date_range') || ''

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex ? Number(pageIndex) : 1,
    pageSize: 15
  })

  const [selectedOrderData, setSelectedOrderData] = useState<SelectedOrder>({
    id: '',
    status: ''
  })

  const [orderStatusPopup, setOrderStatusPopup] = useState<boolean>(false)

  const [rowSelection, setRowSelection] = useState({})
  const [data] = useState(...[invoiceData.results ?? []])
  const [globalFilter, setGlobalFilter] = useState('')
  const [dateData, setDateData] = useState<DateType>(defaultDateState)

  const { mutate: orderStatusMutation } = useOrderStatus()
  const { refetch: getExportOrders } = useExportOrderData(dateData)

  useEffect(() => {
    if (pagination.pageIndex !== Number(pageIndex)) {
      handleSearchParamsChange('page', String(pagination.pageIndex))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex])

  const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
    return (
      <CustomTextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        className='is-full'
        error={props.error}
      />
    )
  })

  const columns = useMemo<ColumnDef<OrderTypeWithAction, any>[]>(
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
      columnHelper.accessor('id', {
        header: 'Order no.',
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`orders/${row.original.id}`, locale as Locale)}
            color='primary'
          >
            #<IdTrimString>{row.original.ondc_order_num}</IdTrimString>
          </Typography>
        )
      }),
      columnHelper.accessor('order_status', {
        header: 'Order Status',
        cell: ({ row }) => {
          const orderStatusBgColor = orderSatusColor(row.original.order_status)

          return (
            <Badge
              color='error'
              variant='dot'
              overlap='circular'
              invisible={!row.original.is_resolution_pending}
              sx={{
                '& .MuiBadge-dot': {
                  top: 2,
                  right: 2,
                  boxShadow: 'var(--mui-palette-background-paper) 0px 0px 0px 2px'
                }
              }}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <CustomChip
                round='true'
                size='small'
                label={row.original.order_status}
                style={{ backgroundColor: orderStatusBgColor, color: '#fafafa', fontWeight: 100 }}
              />
            </Badge>
          )
        }
      }),
      columnHelper.accessor('amount', {
        header: 'Bill',
        cell: ({ row }) => <Typography>{`₹${row.original.amount}`}</Typography>
      }),
      columnHelper.accessor('total_items', {
        header: 'Products',
        cell: ({ row }) => <Typography>{`${row.original.total_items}`}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'time',
        cell: ({ row }) => <Typography>{formatDateIso(row.original.created_at)}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <>
            {readOnlyOrderStatus.includes(row.original.order_status) ? (
              <Button
                variant='outlined'
                color='primary'
                size='small'
                onClick={() => {
                  router.push(getLocalizedUrl(`/orders/${row.original.id}`, locale as Locale))
                }}
              >
                View Details
              </Button>
            ) : (
              <Button
                variant='outlined'
                color='primary'
                size='small'
                disabled={row.original.order_status === orderStatus.COMPLETED}
                onClick={() => {
                  setSelectedOrderData({
                    id: row.original.id ?? '',
                    status: getNextOrderStatus(row.original.order_status)
                  })
                  setOrderStatusPopup(true)
                }}
              >
                Mark as {getNextOrderStatus(row.original.order_status)}
              </Button>
            )}
          </>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as OrderType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter,
      pagination
    },
    enableRowSelection: true, //enable row selection for all rows
    manualPagination: true,

    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    // enableColumnFilters: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onPaginationChange: setPagination
  })

  const handleOrderStatusChange = () => {
    orderStatusMutation({ status: selectedOrderData.status, id: selectedOrderData.id })
  }

  const handleStartDate = (date: Date) => {
    if (date > dateData.endDate) {
      toast.error('Start date should be less than end date')
    }

    setDateData({ ...dateData, startDate: new Date(date) })
  }

  const handleEndDate = (date: Date) => {
    if (date < dateData.startDate) {
      toast.error('End date should be greater than start date')
    }

    setDateData({ ...dateData, endDate: new Date(date) })
  }

  // Call the export order data query
  const handleExportOrderData = () => {
    getExportOrders()
  }

  const handleSearchParamsChange = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set(name, value)

      // Reset the page to 1 on any params change
      if (name !== 'page' && !(name === 'search' && value === '')) {
        params.set('page', '1')
      }

      router.replace(`?${params.toString()}`)

      return params.toString()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  )

  const handleRemovePhone = () => {
    handleSearchParamsChange('phone', '')
  }

  return (
    <>
      <ConfirmationDialog
        type={'status-change-order'}
        open={orderStatusPopup}
        setOpen={setOrderStatusPopup}
        handleOnConfirmation={handleOrderStatusChange}
      />
      <Card>
        <CardHeader
          title='Orders'
          action={
            phone ? <CustomChip label={phone} color='primary' round='true' onDelete={handleRemovePhone} /> : <></>
          }
        />
        <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
          <div className='flex gap-2'>
            <AppReactDatepicker
              selectsStart
              id='event-start-date'
              endDate={dateData.endDate as EventDateType}
              selected={dateData.startDate as EventDateType}
              startDate={dateData.startDate as EventDateType}
              dateFormat={'dd-MM-yyyy'}
              customInput={<PickersComponent label='Start Date' registername='startDate' />}
              onChange={(date: Date) => setDateData({ ...dateData, startDate: new Date(date) })}
              onSelect={handleStartDate}
            />
            <AppReactDatepicker
              selectsEnd
              id='event-end-date'
              endDate={dateData.endDate as EventDateType}
              selected={dateData.endDate as EventDateType}
              minDate={dateData.startDate as EventDateType}
              startDate={dateData.startDate as EventDateType}
              dateFormat={'dd-MM-yyyy'}
              customInput={<PickersComponent label='End Date' registername='endDate' />}
              onChange={handleEndDate}
            />
          </div>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            <DebouncedInput
              value={searchValueFilter ?? ''}
              onChange={value => handleSearchParamsChange('search', String(value))}
              placeholder='Search Invoice'
              className='is-[250px]'
            />
            <CustomTextField
              select
              id='select-status'
              value={orderStatusFilter}
              onChange={e => {
                handleSearchParamsChange('order_status', e.target.value)
              }}
              className='is-[160px]'
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>Order Status</MenuItem>
              <MenuItem value={orderStatus.PENDING}>{orderStatus.PENDING}</MenuItem>
              <MenuItem value={orderStatus.RETURN}>{orderStatus.RETURN}</MenuItem>
              <MenuItem value={orderStatus.PACKED}>{orderStatus.PACKED}</MenuItem>
              <MenuItem value={orderStatus.PROCESSING}>{orderStatus.PROCESSING}</MenuItem>
              <MenuItem value={orderStatus.COMPLETED}>{orderStatus.COMPLETED}</MenuItem>
              <MenuItem value={orderStatus.CANCELLED}>{orderStatus.CANCELLED}</MenuItem>
            </CustomTextField>
            <Button variant='contained' color='primary' onClick={handleExportOrderData}>
              Export <i className='tabler-arrow-bar-up text-[22px]' />
            </Button>
          </div>
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

            {isLoading || table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {isLoading
                      ? 'Loading...'
                      : table.getFilteredRowModel().rows.length === 0
                        ? 'No data available'
                        : ''}
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
          component={() => <TablePaginationComponent table={table} tableSize={invoiceData.count} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
    </>
  )
}

export default InvoiceListTable
