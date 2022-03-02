import React from 'react'

import { Logo } from '../Logo'

export const LoggedOutHeader = () => {
  return (
    <div className="flex mb-12 items-center">
      <Logo size={60} />

      <div className="ml-2 md:ml-6">
        <p className="sm:text-4xl font-thin leading-10 sm:leading-5rem">
          Team Teach Hub
        </p>
      </div>
    </div>
  )
}
