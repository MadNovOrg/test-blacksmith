import React from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@app/components/Icon'

type LayoutProps = {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <div className="md:container md:mx-auto">
      <div className="flex items-center px-6 py-3">
        <div className="">
          <Icon name="logo-color" className="text-5xl" />
        </div>
        <div className="flex-1 px-3 font-thin text-2xl">
          {t('common.appTitle')}
        </div>
        <div className="flex items-center">
          <Icon name="chevron-down" />
          <p className="text-base">Salman M</p>
          <div className="ml-4">
            <img
              className="inline-block h-12 w-12 rounded-full ring-1 ring-lime"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              alt="avatar"
            />
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
