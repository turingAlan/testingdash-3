'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

import { orderSatusColor } from '@/utils/colorsInfo'
import { orderStatus } from '@/data/orderFlowConstants'

interface InvoiceCardProps {
  stats: any
}

// Vars
const data = [
  {
    subtitle: orderStatus.PENDING,
    icon: 'tabler-receipt-rupee'
  },
  {
    subtitle: orderStatus.CONFIRMED,
    icon: 'tabler-package'
  },
  {
    subtitle: orderStatus.CANCELLED,
    icon: 'tabler-circle-off'
  },
  {
    subtitle: orderStatus.PROCESSING,
    icon: 'tabler-truck'
  },
  {
    subtitle: orderStatus.COMPLETED,
    icon: 'tabler-checks'
  },
  {
    subtitle: orderStatus.RETURN,
    icon: 'tabler-receipt-refund'
  }
]

const InvoiceCard = (props: InvoiceCardProps) => {
  const { stats } = props

  // Hooks
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Grid item xs={12} className={classnames({ hidden: isBelowSmScreen })}>
      <Card sx={{ padding: 0, paddingBottom: 0 }}>
        <CardContent style={{ padding: '10px', paddingBottom: 0, paddingBlockEnd: '10px' }}>
          <Grid container spacing={2}>
            {data.map((item, index) => {
              const bgColor = orderSatusColor(item.subtitle)

              return (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={2}
                  key={index}
                  className={classnames({
                    '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie':
                      isBelowMdScreen && !isBelowSmScreen,
                    '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen,
                    hidden: isBelowSmScreen
                  })}
                >
                  <div className='flex justify-between items-start' style={{ paddingInlineEnd: '0.5rem' }}>
                    <div className='flex sm:flex-col sm:gap-0 sm:items-start items-center gap-2 flex-row'>
                      <div className='flex items-center gap-2'>
                        <Avatar variant='rounded' className='hidden mt-1 sm:flex is-[26px] bs-[26px] flex-col '>
                          <i className={classnames(item.icon, 'text-[20px]')} style={{ color: bgColor }}></i>
                        </Avatar>
                        <Typography className='mt-1'>{item.subtitle}</Typography>
                      </div>
                    </div>
                    <Typography variant='h4'>{stats?.[item.subtitle] ?? 0}</Typography>
                  </div>
                  {isBelowMdScreen && !isBelowSmScreen && index < data.length - 2 && (
                    <Divider
                      className={classnames('mbs-6', {
                        'mie-6': index % 2 === 0
                      })}
                    />
                  )}
                  {isBelowSmScreen && index < data.length - 1 && <Divider className='mbs-6' />}
                </Grid>
              )
            })}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default InvoiceCard
