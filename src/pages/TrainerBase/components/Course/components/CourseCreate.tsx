import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import { Typography } from '@app/components/Typography'
import { Dropdown } from '@app/components/Dropdown'

import { CourseCard } from './CourseCard'

import {
  QUERY as GetMyCourses,
  ResponseType as GetMyCoursesResponseType,
  ParamsType as GetMyCourseParamsType,
} from '@app/queries/courses/get-my-courses'

type CourseCreateProps = unknown

export const CourseCreate: React.FC<CourseCreateProps> = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<string>()
  const [sort, setSort] = useState('name')
  const { data } = useSWR<
    GetMyCoursesResponseType,
    Error,
    [string, GetMyCourseParamsType]
  >([GetMyCourses, { orderBy: { [sort]: 'desc' } }])
  console.log(filter)
  return (
    <div className="">
      <Typography variant="h4" className="mb-4">
        Create Course
      </Typography>

      <div className="flex justify-between">
        <Typography variant="body2">Select your course</Typography>
        <div>
          <Dropdown
            title="Filter by"
            items={['pending', 'draft', 'completed']}
            handleClick={setFilter}
          />

          <Dropdown
            title="Sort by"
            items={['name', 'course_type']}
            handleClick={setSort}
          />
        </div>
      </div>
      <div className="mt-4 -mx-2 flex flex-wrap">
        {data?.course?.map(c => (
          <CourseCard
            key={c.id}
            data={c}
            onClick={() => navigate(`../view/${c.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
