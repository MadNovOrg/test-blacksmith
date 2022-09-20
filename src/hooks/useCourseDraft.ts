import { useCallback } from 'react'
import useSWR from 'swr'

import {
  GetCourseDraftQuery,
  GetCourseDraftQueryVariables,
  RemoveCourseDraftMutation,
  RemoveCourseDraftMutationVariables,
  SetCourseDraftMutation,
  SetCourseDraftMutationVariables,
} from '@app/generated/graphql'
import { QUERY as GET_COURSE_DRAFT } from '@app/queries/courses/get-course-draft'
import { QUERY as REMOVE_COURSE_DRAFT } from '@app/queries/courses/remove-course-draft'
import { QUERY as SET_COURSE_DRAFT } from '@app/queries/courses/set-course-draft'
import { CourseType, Draft } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { useFetcher } from './use-fetcher'

type FetchDraft = {
  data: GetCourseDraftQuery['course_draft'][number]['data']
  error?: Error
  status: LoadingStatus
}

type UseCourseDraft = {
  fetchDraft: () => FetchDraft
  removeDraft: () => void
  setDraft: (draft: Draft) => void
}

export function useCourseDraft(
  profileId: string,
  courseType: CourseType
): UseCourseDraft {
  const fetcher = useFetcher()

  const { data, error } = useSWR<
    GetCourseDraftQuery,
    Error,
    [string, GetCourseDraftQueryVariables]
  >([GET_COURSE_DRAFT, { profileId, courseType }])

  const fetchDraft = useCallback(() => {
    return {
      data: data?.course_draft[0]?.data ?? {},
      error,
      status: getSWRLoadingStatus(data, error),
    }
  }, [data, error])

  const removeDraft = useCallback(async () => {
    await fetcher<
      RemoveCourseDraftMutation,
      RemoveCourseDraftMutationVariables
    >(REMOVE_COURSE_DRAFT, { profileId, courseType })
    localStorage.removeItem(`${profileId}-last-draft-course-type`)
  }, [fetcher, courseType, profileId])

  const setDraft = useCallback(
    async (draft: Draft) => {
      await fetcher<SetCourseDraftMutation, SetCourseDraftMutationVariables>(
        SET_COURSE_DRAFT,
        { courseType, data: draft, profileId }
      )
      localStorage.setItem(`${profileId}-last-draft-course-type`, courseType)
    },
    [fetcher, courseType, profileId]
  )

  return {
    fetchDraft,
    removeDraft,
    setDraft,
  }
}
