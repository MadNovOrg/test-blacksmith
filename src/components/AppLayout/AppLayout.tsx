import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { Icon } from '@app/components/Icon'

import { AppMenu } from '../AppMenu'
import { Typography } from '../Typography'
import { IconButton } from '../IconButton'
import { Drawer } from '../Drawer'

type LayoutProps = {
  children: React.ReactNode
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <div className="md:container md:mx-auto">
      <div className="flex items-center px-4 sm:px-6 py-3 border-b border-b-lime-500 sm:border-0">
        <div className="">
          <Icon name="logo-color" className="text-4xl sm:text-5xl" />
        </div>
        <div className="flex-1 px-3 sm:hidden">
          <Typography variant="subtitle3">{t('common.appTitle')}</Typography>
        </div>
        <div className="flex-1 px-3 hidden sm:flex">
          <Typography variant="h6">{t('common.appTitle')}</Typography>
        </div>
        <div className="items-center hidden sm:flex">
          <AppMenu />
          <div className="ml-4">
            <img
              className="inline-block h-12 w-12 rounded-full ring-1 ring-lime-500"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              alt="avatar"
            />
          </div>
        </div>
        <div className="items-center flex sm:hidden">
          <IconButton name="burger" onClick={() => setOpen(true)} />
          <Drawer open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
