import React from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

import { Typography } from '@app/components/Typography'
import { IconButton } from '@app/components/IconButton'

type Course = {
  id: number
  name: string
  date: Date
  orgName: string
  color: string
}

type CoursesProps = {
  data: Course[]
}

export const Courses: React.FC<CoursesProps> = ({ data: courses }) => {
  const navigate = useNavigate()

  return (
    <div className="mt-4 -mx-2 flex flex-wrap">
      {courses.map(c => (
        <div
          key={c.id}
          className={clsx(
            'p-4 w-auto sm:w-52 m-2 text-white flex flex-col',
            c.color
          )}
        >
          <Typography variant="subtitle3" className="mb-6">
            {c.name}
          </Typography>
          <div>
            <Typography variant="body3">{c.orgName}</Typography>
            <Typography variant="body3">
              {format(c.date, 'dd/MM/yyyy')}
            </Typography>
          </div>
          <div className="flex-1" />
          <div className="flex justify-end items-center">
            <IconButton
              name="arrow-right"
              size="lg"
              className="text-white"
              onClick={() => navigate(`../course/${c.id}`)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
