import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { Icon } from '@app/components/Icon'

import { AppMenu } from '../AppMenu'
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
    <div className="md:container md:mx-auto flex flex-col flex-1">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-b-lime-500 sm:border-0">
        <Link to="/" className="flex items-center">
          <Icon name="logo-color" className="text-4xl sm:text-5xl mr-3" />
          <p className="text-lg font-light sm:text-2xl">
            {t('common.appTitle')}
          </p>
        </Link>
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
      <div className="flex-1">{children}</div>
    </div>
  )
}
