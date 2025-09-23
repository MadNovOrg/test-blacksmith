import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  GetCourseDraftQuery,
  GetCourseDraftQueryVariables,
} from '@app/generated/graphql'
import { GET_COURSE_DRAFT } from '@app/modules/course/queries/get-course-draft'
import { Draft } from '@app/types'

type UseCourseDraft = {
  id: string
  name?: string | null
  updatedAt?: string | null
  data: Draft
  error?: Error
  fetching: boolean
}

export function useCourseDraft(draftId?: string): UseCourseDraft {
  const [{ data, error, fetching }] = useQuery<
    GetCourseDraftQuery,
    GetCourseDraftQueryVariables
  >({ query: GET_COURSE_DRAFT, variables: { draftId }, pause: !draftId })

  const courseDraftData = useMemo(
    () => ({
      id: data?.course_draft_by_pk?.id,
      name: data?.course_draft_by_pk?.name,
      updatedAt: data?.course_draft_by_pk?.updatedAt,
      data: data?.course_draft_by_pk?.data ?? {},
      error,
      fetching,
    }),
    [
      data?.course_draft_by_pk?.data,
      data?.course_draft_by_pk?.id,
      data?.course_draft_by_pk?.name,
      data?.course_draft_by_pk?.updatedAt,
      error,
      fetching,
    ],
  )

  return courseDraftData
}
