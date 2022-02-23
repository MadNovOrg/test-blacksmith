import React from 'react'
import clsx from 'clsx'
import format from 'date-fns/format'

import { Typography } from '@app/components/Typography'
import { IconButton } from '@app/components/IconButton'

import { COURSE_COLOR_BY_LEVEL } from '../CourseColorScheme'

import { Course } from '@app/types'

type CourseCardProps = {
  data: Course
  onClick: VoidFunction
}

export const CourseCard: React.FC<CourseCardProps> = ({ data, onClick }) => {
  return (
    <div
      className={clsx(
        'p-4 w-auto sm:w-52 m-2 text-white flex flex-col',
        COURSE_COLOR_BY_LEVEL[data.level].color
      )}
    >
      <Typography variant="subtitle3" className="mb-6">
        {data.name}
      </Typography>
      <div>
        <Typography variant="body3">{data.organization?.name}</Typography>
        <Typography variant="body3">
          {format(new Date(data.dates.aggregate.start.date), 'dd/MM/yyyy')}
        </Typography>
      </div>
      <div className="flex-1" />
      <div className="flex justify-end items-center">
        <IconButton
          name="arrow-right"
          size="lg"
          className="text-white"
          onClick={onClick}
        />
      </div>
    </div>
  )
}
