import React from 'react'

import { Typography } from '@app/components/Typography'

import { Courses } from '../Courses'
import courses from '../mocked-courses'

type CourseHistoryProps = unknown

export const CourseHistory: React.FC<CourseHistoryProps> = () => {
  return (
    <div className="">
      <Typography variant="h4" className="mb-4">
        Course History
      </Typography>
      <Typography variant="body2">&nbsp;</Typography>

      <Courses data={courses} />
    </div>
  )
}
