import React from 'react'

import { Icon } from '@app/components/Icon'

export const LoggedOutHeader = () => {
  return (
    <div className="flex mb-12 items-center">
      <Icon
        name="logo-color"
        aria-hidden="true"
        className="text-2xl sm:text-7xl"
      />

      <div className="ml-2 md:ml-6">
        <p className="sm:text-4xl font-thin leading-10 sm:leading-5rem">
          Team Teach Hub
        </p>
      </div>
    </div>
  )
}
