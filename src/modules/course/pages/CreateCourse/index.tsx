import { useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'

import {
  CreateCourseProvider,
  CreateCourseProviderProps,
  getCourseType,
} from './components/CreateCourseProvider'
import { CreateCoursePage } from './CreateCoursePage'

type Props = {
  initialContextValue?: CreateCourseProviderProps['initialValue']
}

export const CreateCourse = ({ initialContextValue }: Props) => {
  const [searchParams] = useSearchParams()
  const { profile } = useAuth()
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
  return (
    <CreateCourseProvider
      courseType={courseType}
      initialValue={initialContextValue}
    >
      <CreateCoursePage />
    </CreateCourseProvider>
  )
}
