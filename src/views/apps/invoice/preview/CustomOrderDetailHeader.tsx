// MUI Imports
import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import type { UseQueryResult } from '@tanstack/react-query'

import type { ThemeColor } from '@core/types'

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import ClickToGetCopied from '@/@core/components/custom-click-to-get-copied/CustomClickToGetCopied'
import CustomChip from '@/@core/components/mui/Chip'
import type { OrderDetailResponse, OrderItemCancel, ProductImage } from '@/types/apps/orderTypes'
import { orderSatusColor } from '@/utils/colorsInfo'
import { useEssentialDataStore } from '@/@core/stores'
import { deliveryTypes } from '@/data/storeFlowConstants'

import useOrderCancel from '@/@core/hooks/mutation/useOrderCancel'
import { getNextOrderStatus } from '@/utils/getNextOrderStatus'
import useOrderStatus from '@/@core/hooks/mutation/useOrderStatus'
import OrderCancelDialog from '@/components/dialogs/order-cancel-dialog'
import OrderItemsDialog from '@/components/dialogs/order-list-dialog'

interface OrderDetailHeaderProps {
  orderData: OrderDetailResponse
  generateInvoice: UseQueryResult<any, Error>
}

interface TotalItems {
  id: string
  name: string
  quantity: number
  variant: string | number
  image: string
  reasonId?: string
}

const CustomOrderDetailHeader = ({ orderData, generateInvoice }: OrderDetailHeaderProps) => {
  // Hooks
  const { currentShopData } = useEssentialDataStore()
  const { mutate: orderCancelMutate } = useOrderCancel(orderData?.id)
  const { mutate: orderStatusChangeMutate } = useOrderStatus()

  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  const orderStatusBgColor = orderSatusColor(orderData?.order_status)
  const nextOrderStatus = getNextOrderStatus(orderData?.order_status)
  const totalCancelledItems: TotalItems[] = []
  const totalLiquidatedItems: TotalItems[] = []
  const totalReturnItems: TotalItems[] = []
  const totalOrderItems: TotalItems[] = []

  orderData?.fulfillment?.forEach(fulfillmentItem => {
    const fulfillmentOrders = fulfillmentItem?.order_items.map(orderItem => {
      const thumnailImage =
        orderItem?.product?.image?.find((image: ProductImage) => image?.is_thumbnail)?.image ??
        orderItem?.product?.image?.[0]?.image

      return {
        id: orderItem?.id,
        name: orderItem?.product?.name,
        quantity: orderItem?.quantity,
        variant: orderItem?.product?.variants?.variant_no ?? '',
        image: thumnailImage
      }
    })

    const fulfillmentRto = fulfillmentItem?.order_return_items.map(orderItem => {
      const thumnailImage =
        orderItem?.product?.image?.find((image: ProductImage) => image?.is_thumbnail)?.image ??
        orderItem?.product?.image?.[0]?.image

      return {
        id: orderItem?.id,
        name: orderItem?.product?.name,
        quantity: orderItem?.quantity,
        variant: orderItem?.product?.variants?.variant_no ?? '',
        image: thumnailImage
      }
    })

    totalOrderItems.push(...fulfillmentOrders)


    // for rto push the items to totalOrderItems
    if (fulfillmentItem.is_rto) {
      totalOrderItems.push(...fulfillmentRto)
    }

    const fulfillmentCancelledOrders = fulfillmentItem?.order_cancel_items.map(cancelledItem => {
      const thumnailImage =
        cancelledItem?.product?.image?.find((image: ProductImage) => image?.is_thumbnail)?.image ??
        cancelledItem?.product?.image?.[0]?.image

      return {
        id: cancelledItem?.product?.id,
        name: cancelledItem?.product?.name,
        quantity: cancelledItem?.cancel_quantity,
        variant: cancelledItem?.product?.variants?.variant_no,
        reasonId: cancelledItem?.cancellation_reason_id,
        image: thumnailImage
      }
    })

    totalCancelledItems.push(...fulfillmentCancelledOrders)

    const fulfillmentLiquidatedOrders = fulfillmentItem?.order_liquidated_items.map(liquidatedItem => {
      const thumbnailImage =
        liquidatedItem?.product?.image?.find((image: ProductImage) => image?.is_thumbnail)?.image ??
        liquidatedItem?.product?.image?.[0]?.image

      return {
        id: liquidatedItem?.product?.id,
        name: liquidatedItem?.product?.name,
        quantity: liquidatedItem?.return_quantity,
        variant: liquidatedItem?.product?.variants?.variant_no,
        reasonId: liquidatedItem?.reason_id,
        image: thumbnailImage
      }
    })

    totalLiquidatedItems.push(...fulfillmentLiquidatedOrders)

    const fulfillmentReturnOrders = fulfillmentItem?.order_return_items.map(returnItem => {
      const thumbnailImage =
        returnItem?.product?.image?.find((image: ProductImage) => image?.is_thumbnail)?.image ??
        returnItem?.product?.image?.[0]?.image

      return {
        id: returnItem?.product?.id,
        name: returnItem?.product?.name,
        quantity: returnItem?.return_quantity,
        variant: returnItem?.product?.variants?.variant_no ?? '',
        reasonId: returnItem?.reason_id,
        image: thumbnailImage
      }
    })

    totalReturnItems.push(...fulfillmentReturnOrders)
  })

  const handleGetInvoice = () => {
    window.open(orderData?.invoice, '_blank')
  }

  const handleGenerateInvoice = () => {
    generateInvoice.refetch()
  }

  return (
    <div className='flex flex-wrap justify-between items-center gap-y-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <CustomChip
            round='true'
            variant='tonal'
            size='small'
            label={orderData?.order_status}
            style={{ backgroundColor: orderStatusBgColor, color: '#fafafa' }}
          />
          <Typography variant='h5'>
            {`Order #`}
            <ClickToGetCopied dataType='Order Id'>{orderData?.id}</ClickToGetCopied>
          </Typography>
        </div>
      </div>
      <div className='flex flex-row space-x-2 space-y-1 flex-wrap items-center justify-center'>
        {orderData.invoice ? (
          <Button onClick={handleGetInvoice} {...buttonProps('Download Invoice', 'primary', 'outlined')} />
        ) : (
          <Button onClick={handleGenerateInvoice} {...buttonProps('Genereate Invoice', 'primary', 'outlined')} />
        )}

        {totalLiquidatedItems.length > 0 && (
          <OpenDialogOnElementClick
            element={Button}
            elementProps={buttonProps('View Liquidated Items', 'success', 'outlined')}
            dialog={OrderItemsDialog}
            dialogProps={{ title: 'Liquidated Items', data: totalLiquidatedItems }}
          />
        )}

        {totalCancelledItems.length > 0 && (
          <OpenDialogOnElementClick
            element={Button}
            elementProps={buttonProps('View Cancelled Items', 'error', 'outlined')}
            dialog={OrderItemsDialog}
            dialogProps={{ title: 'Cancelled Items', data: totalCancelledItems }}
          />
        )}
        {totalReturnItems.length > 0 && (
          <OpenDialogOnElementClick
            element={Button}
            elementProps={buttonProps('View Return Items', 'success', 'outlined')}
            dialog={OrderItemsDialog}
            dialogProps={{ title: 'Cancelled Orders', data: totalReturnItems }}
          />
        )}

        {(orderData?.order_status == 'Pending' || orderData?.order_status == 'Packed') && (
          <>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Cancel Complete Order', 'error', 'contained')}
              dialog={OrderCancelDialog}
              dialogProps={{
                title: 'Please mention the reason of cancelling the complete order',
                type: 'order',
                handleOnConfirmation: (reason: string) => {
                  const cancelOrderItemsPayload: OrderItemCancel[] = totalOrderItems.map(orderItem => {
                    return {
                      item_id: orderItem.id,
                      quantity: orderItem.quantity
                    }
                  })

                  orderCancelMutate({
                    reasonId: reason,
                    orderItems: cancelOrderItemsPayload,
                    type: 'order'
                  })
                }
              }}
            />
            {currentShopData?.fulfillment === deliveryTypes.MANAGED && (
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps(`Mark As ${nextOrderStatus}`, 'success', 'outlined')}
                dialog={ConfirmationDialog}
                dialogProps={{
                  type: 'status-change-order',
                  handleOnConfirmation: () => {
                    orderStatusChangeMutate({ status: nextOrderStatus, id: orderData?.id })
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CustomOrderDetailHeader
