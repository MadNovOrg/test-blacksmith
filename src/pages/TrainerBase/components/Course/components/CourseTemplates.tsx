import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Typography } from '@app/components/Typography'

import courses from '../mocked-courses'

import { CourseCard } from './CourseCard'

type CourseTemplatesProps = unknown

export const CourseTemplates: React.FC<CourseTemplatesProps> = () => {
  const navigate = useNavigate()

  return (
    <div className="">
      <Typography variant="h4" className="mb-4">
        Course Templates
      </Typography>
      <Typography variant="body2">Select your template</Typography>

      <div className="mt-4 -mx-2 flex flex-wrap">
        {courses.map(c => (
          <CourseCard key={c.id} data={c} onClick={() => navigate('')} />
        ))}
      </div>
    </div>
  )
}
