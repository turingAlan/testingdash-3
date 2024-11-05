'use client'

//  React Imports
import { useEffect, useRef } from 'react'

// Next Imports
// import Img from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import Image from 'next/image'

import styled from '@emotion/styled'

import type { Locale } from '@configs/i18n'
import type { VerticalNavContextProps } from '@menu/contexts/verticalNavContext'

// Component Imports
// import VuexyLogo from '@core/svg/Logo'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Import Assets
import logo from '@assets/logo.svg'
import useEssentialData from '@/@core/hooks/query/useEssentialData'
import { useEssentialDataStore } from '@/@core/stores'

type LogoTextProps = {
  isHovered?: VerticalNavContextProps['isHovered']
  isCollapsed?: VerticalNavContextProps['isCollapsed']
  transitionDuration?: VerticalNavContextProps['transitionDuration']
}

const ImageWrapper = styled(Image)<LogoTextProps>`
  transition: ${({ transitionDuration }) => `opacity ${transitionDuration}ms ease-in-out`};
  ${({ isHovered, isCollapsed }) => (isCollapsed && !isHovered ? 'opacity: 0;' : 'opacity: 1;')}
`

const Logo = () => {
  // Refs
  const logoTextRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const { isHovered, transitionDuration } = useVerticalNav()
  const { settings } = useSettings()
  const { lang: locale } = useParams()

  const { organizationData: tenantData } = useEssentialDataStore()

  // Vars
  const { layout } = settings

  useEffect(() => {
    if (layout !== 'collapsed') {
      return
    }

    if (logoTextRef && logoTextRef.current) {
      if (layout === 'collapsed' && !isHovered) {
        logoTextRef.current?.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout])

  // You may return any JSX here to display a logo in the sidebar header
  // return <Img src='/next.svg' width={100} height={25} alt='logo' /> // for example

  return (
    <Link href={getLocalizedUrl('/', locale as Locale)} className='flex items-center'>
      {tenantData.logo ? (
        <div className='flex items-end justify-center gap-2'>
          {!tenantData.is_whitelabel && (
            <ImageWrapper
              src={logo}
              alt='logo'
              width={75}
              height={30}
              isHovered={isHovered}
              isCollapsed={layout === 'collapsed'}
              transitionDuration={transitionDuration}
            />
          )}

          <ImageWrapper
            src={tenantData?.logo}
            alt='logo'
            width={75}
            height={30}
            isHovered={isHovered}
            isCollapsed={layout === 'collapsed'}
            transitionDuration={transitionDuration}
          />
        </div>
      ) : (
        <ImageWrapper
          src={logo}
          alt='logo'
          width={150}
          height={30}
          isHovered={isHovered}
          isCollapsed={layout === 'collapsed'}
          transitionDuration={transitionDuration}
        />
      )}
    </Link>
  )
}

export default Logo
