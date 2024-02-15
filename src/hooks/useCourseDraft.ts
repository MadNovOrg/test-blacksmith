import { useQuery } from 'urql'

import {
  GetCourseDraftQuery,
  GetCourseDraftQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GET_COURSE_DRAFT } from '@app/queries/courses/get-course-draft'
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

  return {
    id: data?.course_draft_by_pk?.id,
    name: data?.course_draft_by_pk?.name,
    updatedAt: data?.course_draft_by_pk?.updatedAt,
    data: data?.course_draft_by_pk?.data ?? {},
    error,
    fetching,
  }
}
