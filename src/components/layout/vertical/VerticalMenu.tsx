'use client'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import { Button } from '@mui/material'

import { toast } from 'react-toastify'

import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import useLogout from '@/@core/hooks/useLogout'
import { useEssentialDataStore } from '@/@core/stores'
import CustomChip from '@/@core/components/mui/Chip'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { allShops, currentShopData, paymentDetails } = useEssentialDataStore()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()

  const { logout } = useLogout()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const isPayementDetailsPresent = !!paymentDetails?.find(value => {
    return value.is_default
  })

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const handleUserLogout = () => {
    try {
      logout()
    } catch (error) {
      toast.error('An error occurred while logging out. Please try again.')
      console.error(error)
    }
  }

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      {/* TODO: Add translation */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href={`/${locale}/dashboards/crm`} icon={<i className='tabler-layout-board' />}>
          {'Dashboard'}
        </MenuItem>
        <MenuItem href={`/${locale}/orders`} icon={<i className='tabler-shopping-cart-plus' />}>
          {'Orders'}
        </MenuItem>
        <MenuItem href={`/${locale}/inventory`} icon={<i className='tabler-device-ipad-horizontal-plus' />}>
          {'Inventory'}
        </MenuItem>
        <MenuItem href={`/${locale}/payment`} icon={<i className='tabler-credit-card-pay' />}>
          {'Payment'}
        </MenuItem>
        <MenuItem href={`/${locale}/analytics`} icon={<i className='tabler-brand-google-analytics' />}>
          {'Analytics'}
        </MenuItem>
        <MenuItem href={`/${locale}/costumerqueries`} icon={<i className='tabler-user-question' />}>
          {'Costumer Queries'}
        </MenuItem>
        <MenuItem
          href={`/${locale}/store/${currentShopData?.id}${currentShopData?.is_timing_updated ? '' : '#storeTiming'}`}
          icon={<i className='tabler-settings-up' />}
          disabled={allShops?.length === 0 || !currentShopData}
          suffix={
            currentShopData?.is_timing_updated ? null : (
              <CustomChip label='' size='small' color='error' round='true' circular='true' />
            )
          }
        >
          {'Store'}
        </MenuItem>
        <MenuItem href={`/${locale}/customers`} icon={<i className='tabler-user-hexagon' />}>
          {'Customers'}
        </MenuItem>
        <MenuItem href={`/${locale}/managerdetails`} icon={<i className='tabler-phone' />}>
          {'Access Control'}
        </MenuItem>
        <MenuItem
          href={`/${locale}/addstore`}
          icon={<i className='tabler-building-store' />}
          disabled={!isPayementDetailsPresent}
        >
          {'Add Store'}
        </MenuItem>
        {/* <MenuItem href={`/${locale}/addon`} icon={<i className='tabler-device-ipad-horizontal-down' />}>
          {'Addon'}
        </MenuItem> */}
        <MenuItem href={`/${locale}/profile`} icon={<i className='tabler-user' />}>
          {'Your Profile'}
        </MenuItem>

        <br />
        <Button
          color='error'
          variant='contained'
          startIcon={<i className='tabler-logout' />}
          onClick={handleUserLogout}
          className='is-full sm:is-auto'
        >
          Logout
        </Button>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
