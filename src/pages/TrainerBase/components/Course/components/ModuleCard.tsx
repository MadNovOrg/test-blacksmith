import React from 'react'
import clsx from 'clsx'

import { ModuleGroup } from '@app/types'
import { formatDurationShort } from '@app/util'

type ModuleCardProps = {
  data: ModuleGroup
  className?: string
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  data,
  className,
  ...props
}) => (
  <div
    className={clsx(
      className,
      'relative m-2 w-24 h-24 lg:w-28 lg:h-28 rounded-md text-white p-2 flex flex-col justify-center transition-colors'
    )}
    {...props}
  >
    <p className="text-xs text-center font-bold mb-2">{data.name}</p>
    <p className="text-xs absolute bottom-2 left-2">
      {formatDurationShort(data.duration.aggregate.sum.duration)}
    </p>
  </div>
)
