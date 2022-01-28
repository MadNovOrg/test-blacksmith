import React from 'react'

import { Typography } from '@app/components/Typography'

import { Courses } from '../Courses'
import courses from '../mocked-courses'

type NewCourseProps = unknown

export const NewCourse: React.FC<NewCourseProps> = () => {
  return (
    <div className="">
      <Typography variant="h4" className="mb-4">
        New Course
      </Typography>
      <Typography variant="body2">Select your course</Typography>

      <Courses data={courses} />
    </div>
  )
}
