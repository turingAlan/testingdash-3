'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import { Tooltip } from '@mui/material'

import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useEssentialDataStore } from '@/@core/stores'
import { getLocalizedUrl } from '@/utils/i18n'
import type { StoreDetails } from '@/types/apps/storeTypes'

const ChangeShop = () => {
  // States
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const { allShops, setCurrentShopData, currentShopData } = useEssentialDataStore()

  const isNoStore = allShops?.length === 0

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const { lang } = useParams()

  const handleClose = () => {
    setOpen(false)
  }

  const handleShopChange = (shop: StoreDetails) => {
    return () => {
      setOpen(false)

      // setCurrentShopData(shop)
    }
  }

  const handleToogleAdd = () => {
    if (isNoStore) {
      router.push(getLocalizedUrl('/addstore', lang as Locale))

      return
    }

    setOpen(prevOpen => !prevOpen)
  }

  return (
    <>
      <Tooltip
        title={isNoStore ? 'Add Store' : 'Change Store'}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : tooltipOpen ? true : false}
        PopperProps={{ className: 'capitalize' }}
      >
        <IconButton ref={anchorRef} onClick={handleToogleAdd} className='text-textPrimary'>
          <i className={`${isNoStore ? 'tabler-building-store' : 'tabler-arrows-exchange'}`} />
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[160px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose} className='max-h-[200px] overflow-y-auto w-[200px] overflow-x-clip'>
                  {allShops?.map(shopDetails => (
                    <MenuItem
                      key={shopDetails.id}
                      onClick={handleShopChange(shopDetails)}
                      selected={currentShopData?.id === shopDetails.id}
                    >
                      {shopDetails.name.length > 20 ? `${shopDetails.name.substring(0, 17)}...` : shopDetails.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default ChangeShop
