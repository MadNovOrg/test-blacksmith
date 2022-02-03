import React from 'react'

import { Icon } from '@app/components/Icon'
import { IconButton } from '@app/components/IconButton'
import { AppIcons } from '@app/components/Icon/icons'

type DashboardCardProps = {
  icon: AppIcons
  title: string
  children: React.ReactNode
  onClick: VoidFunction
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  children,
  onClick,
}) => {
  return (
    <div className="flex-1 basis-1/2 p-2">
      <div className="h-full bg-gradient-to-r from-black via-navy-500 to-navy-500 p-4 pb-8 pr-16 relative">
        <div className="absolute top-6 right-6 pointer-events-none">
          <Icon name={icon} className="text-white/10 text-[16rem]" />
        </div>
        <p className="text-2xl font-light text-white">{title}</p>
        <div className="flex mt-4">
          <Icon name={icon} className="text-white text-6xl" />
          <div className="flex-1 ml-3">{children}</div>
        </div>
        <div className="absolute right-1 bottom-1">
          <IconButton
            name="arrow-right"
            size="lg"
            className="text-white bg-navy/10"
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  )
}
