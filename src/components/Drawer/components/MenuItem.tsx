import React from 'react'
import { NavLink } from 'react-router-dom'

import { Typography } from '@app/components/Typography'

type Item = {
  to: string
  title: string
  children?: Item[]
}

type MenuItemProps = { item: Item; child?: boolean }

export const MenuItem: React.FC<MenuItemProps> = ({ item, child }) => {
  return (
    <div>
      <NavLink
        key={item.to}
        to={item.to}
        className="flex items-center h-10"
        end
      >
        {({ isActive }) => (
          <Typography
            variant={child ? 'body3' : 'body1'}
            className={isActive ? 'border-b border-lime font-bold' : ''}
          >
            {item.title}
          </Typography>
        )}
      </NavLink>

      <div className="pl-5">
        {item.children?.map(mi => (
          <MenuItem key={mi.to} item={mi} child />
        ))}
      </div>
    </div>
  )
}
