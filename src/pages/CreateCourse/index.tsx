import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { CourseType } from '@app/types'

import { NotFound } from '../common/NotFound'

import {
  CreateCourseProvider,
  CreateCourseProviderProps,
} from './components/CreateCourseProvider'
import { CreateCoursePage } from './CreateCoursePage'

type Props = {
  initialContextValue?: CreateCourseProviderProps['initialValue']
}

export const CreateCourse = ({ initialContextValue }: Props) => {
  const [searchParams] = useSearchParams()
  const { acl } = useAuth()

  const courseType = (searchParams.get('type') as CourseType) ?? CourseType.OPEN

  if (!acl.canCreateCourse(courseType)) {
    return <NotFound />
  }

  return (
    <CreateCourseProvider initialValue={initialContextValue}>
      <CreateCoursePage />
    </CreateCourseProvider>
  )
}
