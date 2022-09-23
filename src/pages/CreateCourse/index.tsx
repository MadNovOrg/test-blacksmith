import React, { useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
import { LoadingStatus } from '@app/util'

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

  const { fetchDraft } = useCourseDraft(profile?.id ?? '', courseType)

  const { data: draft, status: fetchDraftStatus } = fetchDraft()

  if (fetchDraftStatus === LoadingStatus.FETCHING) {
    return <SuspenseLoading />
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
