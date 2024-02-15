import { useMemo } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { useCourseDraft } from '@app/hooks/useCourseDraft'

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
  const { id: draftId } = useParams()

  const {
    data: draftData,
    name: draftName,
    fetching,
    updatedAt: draftUpdatedAt,
  } = useCourseDraft(draftId)

  const courseType: Course_Type_Enum = useMemo(
    () =>
      draftData.courseData?.type ??
      getCourseType(
        profile?.id ?? 'unknown',
        searchParams.get('type'),
        pathname === '/courses/new'
      ),
    [draftData, pathname, profile, searchParams]
  )

  if (fetching && draftId) {
    return <SuspenseLoading />
  }

  return (
    <CreateCourseProvider
      key={draftUpdatedAt}
      initialValue={initialContextValue ?? draftData}
      courseType={courseType}
      draftName={draftName}
    >
      <CreateCoursePage />
    </CreateCourseProvider>
  )
}
