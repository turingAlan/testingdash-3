'use client'

// React Imports
import { useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

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
import type { ButtonProps } from '@mui/material'
import { Button } from '@mui/material'

import tableStyles from '@core/styles/table.module.css'
import type {
  FulfillmentDetails,
  OrderDetailResponse,
  OrderItem,
  ProductImage,
  ReturnOrderItem
} from '@/types/apps/orderTypes'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'
import CustomChip from '@/@core/components/mui/Chip'
import { orderSatusColor } from '@/utils/colorsInfo'
import { getNextFulfillmentStatus } from '@/utils/getNextOrderStatus'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import type { ThemeColor } from '@/@core/types'
import useFulfillmentStatus from '@/@core/hooks/mutation/useFulfillmentStatus'
import { orderStatus } from '@/data/orderFlowConstants'
import useOrderReturn from '@/@core/hooks/mutation/userOrderReturn'
import OrderItemCancelDialog from '@/components/dialogs/order-item-cancel'
import useOrderCancel from '@/@core/hooks/mutation/useOrderCancel'
import OrderResolutionDialog from '@/components/dialogs/order-resolution'
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
const columnHelper = createColumnHelper<OrderItem>()

interface OrderTableProps {
  fulfillmentData: FulfillmentDetails
  orderData: OrderDetailResponse
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

const OrderTable: React.FC<OrderTableProps> = ({ fulfillmentData, orderData }) => {
  const { lang: locale, order_id } = useParams()
  const orderId = Array.isArray(order_id) ? order_id[0] : order_id

  const router = useRouter()

  const { mutate: changeFulfillmentStatusMutate } = useFulfillmentStatus(orderId)
  const { mutate: handleOrderReturnMutate } = useOrderReturn(orderId)
  const { mutate: handleOrderCancelMutate } = useOrderCancel(orderId)

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [orderItems] = useState(...[fulfillmentData.order_items])
  const [globalFilter, setGlobalFilter] = useState('')
  const [orderCancelItemPopup, setOrderCancelItemPopup] = useState(false)
  const [selectedOrderCancelItem, setSelectedOrderCancelItem] = useState<OrderItem | null>(null)

  const handleOrderCancelItem = (selectedReasonId: string, quantity: number) => {
    const totalCancellableOrderItems: any[] = []

    orderData?.fulfillment?.forEach(fulfillmentItem => {
      const fulfillmentOrders = fulfillmentItem?.order_items.map(orderItem => {
        return {
          item_id: orderItem.id,
          quantity: orderItem.quantity
        }
      })

      totalCancellableOrderItems.push(...fulfillmentOrders)
    })

    const orderItemCancel = {
      item_id: selectedOrderCancelItem?.id ?? '',
      quantity: quantity,
      fulfillment_id: fulfillmentData.id
    }

    handleOrderCancelMutate({
      reasonId: selectedReasonId,
      orderItems: totalCancellableOrderItems,
      type: 'item',
      orderItem: orderItemCancel,
      maxQuantity: selectedOrderCancelItem?.quantity ?? 0
    })
  }

  const columns = useMemo<ColumnDef<OrderItem, any>[]>(
    () => {
      return [
        columnHelper.accessor('product.name', {
          header: 'Product',
          cell: ({ row }) => {
            const thumbnailImage =
              row.original?.product?.image?.find((image: ProductImage) => image?.is_thumbnail) ||
              row.original?.product?.image[0]

            return (
              <div className='flex items-center gap-3'>
                <ProgressiveImage src={thumbnailImage?.image} alt={row.original.product.name} height={34} width={50} />

                <div>
                  <Typography
                    component={Link}
                    href={getLocalizedUrl(`/inventory/${row.original.product.id}`, locale as Locale)}
                    color='text.primary'
                    className='font-medium'
                  >
                    {row.original.product.name}
                  </Typography>
                </div>
              </div>
            )
          }
        }),
        columnHelper.accessor('product.variants.variant_no', {
          header: 'variant',
          cell: ({ row }) => <Typography>{`Variant ${row.original.product.variants?.variant_no ?? 0}`}</Typography>
        }),
        columnHelper.accessor('quantity', {
          header: 'Qty',
          cell: ({ row }) => (
            <Typography>{`${row.original.quantity} ${row.original.product.variants.quantity.uom ?? 'unit'}`}</Typography>
          )
        }),
        columnHelper.accessor('product.id', {
          header: 'Operation',
          cell: ({ row }) => {
            const orderItemCancelled = row.original?.status === orderStatus.CANCELLED ? true : false

            const orderItemEmpty = row.original?.quantity === 0

            const orderItemCancellable =
              !orderItemCancelled &&
              !orderItemEmpty &&
              (fulfillmentData?.delivery_status === orderStatus.PENDING ||
                fulfillmentData?.delivery_status === orderStatus.PACKED ||
                fulfillmentData?.delivery_status === orderStatus.AGENT_ASSIGNED)

            return (
              <Button
                variant='outlined'
                color='primary'
                disabled={!orderItemCancellable}
                onClick={() => {
                  setOrderCancelItemPopup(true)
                  setSelectedOrderCancelItem(row.original)
                }}
              >
                <Typography>{`${orderItemCancellable ? 'Cancel this item' : orderStatus.CANCELLED}`}</Typography>
              </Button>
            )
          }
        })
      ]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: orderItems as OrderItem[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },

    enableRowSelection: false, //enable row selection for all rows
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
      <OrderItemCancelDialog
        open={orderCancelItemPopup}
        setOpen={setOrderCancelItemPopup}
        maxQuantity={selectedOrderCancelItem?.quantity ?? 0}
        handleOnConfirmation={handleOrderCancelItem}
      />
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
              {table.getRowModel().rows.map(row => {
                const orderItemCancelled = row.original?.status === orderStatus.CANCELLED ? true : false

                const orderItemEmpty = row.original?.quantity === 0

                const orderAwaitingConfirmation = row.original?.status === 'Awaiting Confirmation'

                const isOrderItemDisabled = orderItemCancelled || orderItemEmpty || orderAwaitingConfirmation

                return (
                  <tr
                    key={row.id}
                    className={classnames(
                      { selected: row.getIsSelected() },
                      `${isOrderItemDisabled ? 'opacity-40' : ''}`
                    )}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
        <div className='m-4 flex flex-wrap space-x-2 space-y-1 items-center'>
          {orderItems.length > 0 && (
            <>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => {
                  router.push(getLocalizedUrl(`/orders/${orderId}/${fulfillmentData.id}`, locale as Locale))
                }}
              >
                <Typography className='underline'>{`See more Details`}</Typography>
                <i className='tabler-arrow-up-right' />
              </Button>

              {orderData?.return_resolution.is_resolution_pending && (
                <OpenDialogOnElementClick
                  element={Button}
                  elementProps={buttonProps('Resolution Pending', 'error', 'contained')}
                  dialog={OrderResolutionDialog}
                  dialogProps={{
                    key: fulfillmentData.id,
                    data: orderData?.return_resolution?.resolution_items
                  }}
                />
              )}
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps(
                  `Mark As ${getNextFulfillmentStatus(fulfillmentData.delivery_status)}`,
                  'success',
                  'outlined'
                )}
                dialog={ConfirmationDialog}
                dialogProps={{
                  type: 'status-change-fulfillment',
                  handleOnConfirmation: () => {
                    const nextFulfillmentStatus = getNextFulfillmentStatus(fulfillmentData.delivery_status)

                    changeFulfillmentStatusMutate({
                      fulfillmentId: fulfillmentData.id,
                      status: nextFulfillmentStatus
                    })
                  }
                }}
              />
              {/* )} */}
            </>
          )}
          {fulfillmentData?.order_status === orderStatus.RETURN && (
            <>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps(`Generate Refund`, 'success', 'outlined')}
                dialog={ConfirmationDialog}
                dialogProps={{
                  type: 'generate-refund',
                  handleOnConfirmation: () => {
                    handleOrderReturnMutate({
                      action: 'GenerateRefund',
                      fulfillmentId: fulfillmentData.id
                    })
                  }
                }}
              />
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps(`Accept Return`, 'success', 'outlined')}
                dialog={ConfirmationDialog}
                dialogProps={{
                  type: 'accept-return',
                  handleOnConfirmation: () => {
                    handleOrderReturnMutate({
                      action: 'AcceptReturn',
                      fulfillmentId: fulfillmentData.id
                    })
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

const rtoColumnHelper = createColumnHelper<ReturnOrderItem>()

const OderTableRto: React.FC<OrderTableProps> = ({ fulfillmentData, orderData }) => {
  const { lang: locale } = useParams()

  const { mutate: handleOrderCancelMutate } = useOrderCancel(orderData.id)

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [orderItems] = useState(...[fulfillmentData.order_return_items])
  const [globalFilter, setGlobalFilter] = useState('')
  const [orderCancelItemPopup, setOrderCancelItemPopup] = useState(false)
  const [selectedOrderCancelItem, setSelectedOrderCancelItem] = useState<ReturnOrderItem | null>(null)

  const handleOrderCancelItem = (selectedReasonId: string, quantity: number) => {
    const totalCancellableOrderItems: any[] = []

    orderData?.fulfillment?.forEach(fulfillmentItem => {
      const fulfillmentOrders = fulfillmentItem?.order_items.map(orderItem => {
        return {
          item_id: orderItem.id,
          quantity: orderItem.quantity
        }
      })

      totalCancellableOrderItems.push(...fulfillmentOrders)
    })

    const orderItemCancel = {
      item_id: selectedOrderCancelItem?.id ?? '',
      quantity: quantity,
      fulfillment_id: fulfillmentData.id
    }

    handleOrderCancelMutate({
      reasonId: selectedReasonId,
      orderItems: totalCancellableOrderItems,
      type: 'item',
      orderItem: orderItemCancel,
      maxQuantity: selectedOrderCancelItem?.quantity ?? 0
    })
  }

  const columns = useMemo<ColumnDef<ReturnOrderItem, any>[]>(
    () => {
      return [
        rtoColumnHelper.accessor('product.name', {
          header: 'Product',
          cell: ({ row }) => {
            const thumbnailImage =
              row.original?.product?.image?.find((image: ProductImage) => image?.is_thumbnail) ||
              row.original?.product?.image[0]

            return (
              <div className='flex items-center gap-3'>
                <ProgressiveImage src={thumbnailImage?.image} alt={row.original.product.name} height={34} width={50} />

                <div>
                  <Typography
                    component={Link}
                    href={getLocalizedUrl(`/inventory/${row.original.product.id}`, locale as Locale)}
                    color='text.primary'
                    className='font-medium'
                  >
                    {row.original.product.name}
                  </Typography>
                </div>
              </div>
            )
          }
        }),
        rtoColumnHelper.accessor('product.variants.variant_no', {
          header: 'variant',
          cell: ({ row }) => <Typography>{`Variant ${row.original.product.variants?.variant_no ?? 0}`}</Typography>
        }),
        rtoColumnHelper.accessor('quantity', {
          header: 'Qty',
          cell: ({ row }) => (
            <Typography>{`${row.original.quantity} ${row.original.product.variants.quantity.uom ?? 'unit'}`}</Typography>
          )
        }),
        rtoColumnHelper.accessor('product.id', {
          header: 'Operation',
          cell: ({ row }) => {
            const orderItemCancelled = row.original?.return_status === orderStatus.RETURN_DELIVERED ? true : false

            const orderItemEmpty = row.original?.return_quantity === 0

            const orderItemCancellable =
              !orderItemCancelled &&
              !orderItemEmpty &&
              (fulfillmentData?.delivery_status === orderStatus.PENDING ||
                fulfillmentData?.delivery_status === orderStatus.PACKED ||
                fulfillmentData?.delivery_status === orderStatus.AGENT_ASSIGNED)

            return (
              <Button
                variant='outlined'
                color='primary'
                disabled={!orderItemCancellable}
                onClick={() => {
                  setOrderCancelItemPopup(true)
                  setSelectedOrderCancelItem(row.original)
                }}
              >
                <Typography>{`${orderItemCancellable ? 'Cancel this item' : orderStatus.CANCELLED}`}</Typography>
              </Button>
            )
          }
        })
      ]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const rtotable = useReactTable({
    data: orderItems as ReturnOrderItem[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },

    enableRowSelection: false, //enable row selection for all rows
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
      <OrderItemCancelDialog
        open={orderCancelItemPopup}
        setOpen={setOrderCancelItemPopup}
        maxQuantity={selectedOrderCancelItem?.quantity ?? 0}
        handleOnConfirmation={handleOrderCancelItem}
      />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {rtotable.getHeaderGroups().map(headerGroup => (
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
          {rtotable.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={rtotable.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className='border-be'>
              {rtotable.getRowModel().rows.map(row => {
                const orderItemCancelled = row.original?.return_status === orderStatus.CANCELLED ? true : false

                const orderItemEmpty = row.original?.return_quantity === 0

                const orderAwaitingConfirmation = row.original?.return_status === 'Awaiting Confirmation'

                const isOrderItemDisabled = orderItemCancelled || orderItemEmpty || orderAwaitingConfirmation

                return (
                  <tr
                    key={row.id}
                    className={classnames(
                      { selected: row.getIsSelected() },
                      `${isOrderItemDisabled ? 'opacity-40' : ''}`
                    )}
                  >
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
    </>
  )
}

interface CustomOrderItemCardProps {
  orderData: OrderDetailResponse
}

const CustomOrderItemCard: React.FC<CustomOrderItemCardProps> = ({ orderData }) => {
  const fulfillments = orderData.fulfillment

  return (
    <>
      {fulfillments.map((fulfillment, index) => (
        <Card key={fulfillment.id}>
          <CardHeader
            title={`Fulfillment ${index + 1}`}
            subheader={
              fulfillment.pickup_instructions?.short_desc ? `OTP ${fulfillment.pickup_instructions?.short_desc}` : ''
            }
            action={
              <CustomChip
                round='true'
                size='small'
                label={fulfillment.delivery_status}
                style={{
                  backgroundColor: orderSatusColor(fulfillment.delivery_status),
                  color: '#fafafa',
                  fontWeight: 100
                }}
              />
            }
          />
          {fulfillment.order_return_items.length > 0 ? (
            <OderTableRto key={fulfillment.id} fulfillmentData={fulfillment} orderData={orderData} />
          ) : (
            <OrderTable key={fulfillment.id} fulfillmentData={fulfillment} orderData={orderData} />
          )}
        </Card>
      ))}
    </>
  )
}

export default CustomOrderItemCard
