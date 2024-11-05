'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

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

const getLocalePath = (pathName: string, locale: string) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  if (!pathName) return '/'
  const segments = pathName.split('/')

  segments[1] = locale

  return segments.join('/')
}

type ChangeShopStatuProps = {
  id: string
  name: string
  status: 'CLOSE' | 'OPEN'
  image?: string
}

const shopList: ChangeShopStatuProps[] = [
  { id: 'sfgsdf', name: 'kirana0', status: 'CLOSE' },
  { id: 'bnmvf', name: 'kirana1', status: 'OPEN' }
]

const ChangeShopStatus = () => {
  // States
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const pathName = usePathname()
  const { settings } = useSettings()
  const { lang } = useParams()

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  return (
    <>
      {/* TODO: some how need to manage context of the current shop status */}
      <Tooltip
        title={'Change Shop Status'} // set status in here
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : tooltipOpen ? true : false}
        PopperProps={{ className: 'capitalize' }}
      >
        <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
          <i className='tabler-power' />
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
                <MenuList onKeyDown={handleClose}>
                  {shopList.map(locale => (
                    <MenuItem
                      key={locale.id}
                      component={Link}
                      href={getLocalePath(pathName, locale.name)}
                      onClick={handleClose}
                      selected={lang === locale.name}
                    >
                      {locale.name}
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

export default ChangeShopStatus
