import React from 'react'

import { IconProps, Icon } from './Icon'
import icons from './icons'

export default {
  title: 'components/Icon',
  component: Icon,
}

export const Basic = () => (
  <div>
    <table className="table-auto">
      <tbody>
        {(Object.keys(icons) as IconProps['name'][]).map((name, index) => (
          <tr key={index}>
            <td className="text-3xl py-2">
              <Icon name={name} />
            </td>
            <td className="pl-4">{name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
