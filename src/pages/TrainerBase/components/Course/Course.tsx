import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Icon } from '@app/components/Icon'

type CourseProps = unknown

export const Course: React.FC<CourseProps> = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col px-4 sm:p-0">
      <div className="flex">
        <button className="flex items-center" onClick={() => navigate(-1)}>
          <Icon name="arrow-left" />
          <p className="ml-2 text-sm">Back</p>
        </button>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
