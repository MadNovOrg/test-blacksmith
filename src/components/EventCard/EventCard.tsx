import React from 'react'

import { formatDateRange } from '@app/util'

const colorVariantMap = {
  fuschia: 'bg-fuschia-500',
  red: 'bg-red',
  navy: 'bg-navy-500',
}

export type EventCardProps = {
  variant: keyof typeof colorVariantMap
  startDate: Date | string
  endDate: Date | string
  children: React.ReactNode
}

export const EventCard: React.FC<EventCardProps> = ({
  variant,
  startDate,
  endDate,
  children,
  ...props
}) => {
  return (
    <div {...props}>
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full ${colorVariantMap[variant]}`} />
        <div className="ml-4 text-lg">
          {formatDateRange(new Date(startDate), new Date(endDate))}
        </div>
      </div>
      <div className="pt-4">{children}</div>
    </div>
  )
}
