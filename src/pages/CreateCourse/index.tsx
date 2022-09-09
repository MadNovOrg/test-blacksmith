import React, { useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

import { NotFound } from '../common/NotFound'

import {
  CreateCourseProvider,
  CreateCourseProviderProps,
  getCourseType,
  getItem,
  getItemId,
} from './components/CreateCourseProvider'
import { CreateCoursePage } from './CreateCoursePage'

type Props = {
  initialContextValue?: CreateCourseProviderProps['initialValue']
}

export const CreateCourse = ({ initialContextValue }: Props) => {
  const [searchParams] = useSearchParams()
  const { acl, profile } = useAuth()
  const { pathname } = useLocation()

  const courseType = useMemo(
    () =>
      getCourseType(
        profile?.id ?? 'unknown',
        searchParams.get('type'),
        pathname === '/courses/new'
      ),
    [pathname, profile, searchParams]
  )

  const draft = useMemo(() => {
    const id = getItemId(profile?.id ?? 'unknown', courseType)
    return getItem(id)
  }, [courseType, profile])

  if (!acl.canCreateCourse(courseType)) {
    return <NotFound />
  }

  return (
    <CreateCourseProvider
      initialValue={initialContextValue ?? draft}
      courseType={courseType}
    >
      <CreateCoursePage />
    </CreateCourseProvider>
  )
}
