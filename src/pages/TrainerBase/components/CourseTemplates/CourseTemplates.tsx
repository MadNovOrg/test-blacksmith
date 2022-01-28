import React from 'react'

import { Typography } from '@app/components/Typography'

import { Courses } from '../Courses'
import courses from '../mocked-courses'

type CourseTemplatesProps = unknown

export const CourseTemplates: React.FC<CourseTemplatesProps> = () => {
  return (
    <div className="">
      <Typography variant="h4" className="mb-4">
        Course Templates
      </Typography>
      <Typography variant="body2">&nbsp;</Typography>

      <Courses data={courses} />
    </div>
  )
}
