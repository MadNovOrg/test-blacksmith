import useSWR from 'swr'

import {
  GetCourseDraftQuery,
  GetCourseDraftQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GET_COURSE_DRAFT } from '@app/queries/courses/get-course-draft'
import { Draft } from '@app/types'
import { LoadingStatus, getSWRLoadingStatus } from '@app/util'

type UseCourseDraft = {
  id: string
  name?: string | null
  updatedAt?: string | null
  data: Draft
  error?: Error
  status: LoadingStatus
}

export function useCourseDraft(draftId?: string): UseCourseDraft {
  const { data, error } = useSWR<
    GetCourseDraftQuery,
    Error,
    [string, GetCourseDraftQueryVariables] | null
  >(draftId ? [GET_COURSE_DRAFT, { draftId }] : null)

  return {
    id: data?.course_draft_by_pk?.id,
    name: data?.course_draft_by_pk?.name,
    updatedAt: data?.course_draft_by_pk?.updatedAt,
    data: data?.course_draft_by_pk?.data ?? {},
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
