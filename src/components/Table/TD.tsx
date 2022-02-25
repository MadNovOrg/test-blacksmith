import React from 'react'

import { Icon, IconProps } from '../Icon'

import { noop } from '@app/util'

type TDProps = {
  id: string
  title: string
  sort?: string
  onSort?: React.Dispatch<React.SetStateAction<string>>
}

const _TD: React.FC<TDProps> = ({ id, title, sort, onSort = noop }) => {
  const [col, order] = sort?.split('-') ?? []
  const icon: IconProps['name'] =
    col === id ? `chevron-${order === 'asc' ? 'up' : 'down'}` : 'blank'

  return (
    <td className="py-4 px-2">
      <button
        className="flex items-center"
        onClick={() => onSort(`${id}-${order === 'asc' ? 'desc' : 'asc'}`)}
      >
        <p className="mr-2">{title}</p>
        {sort && <Icon name={icon} />}
      </button>
    </td>
  )
}

export const TD = React.memo(_TD)
