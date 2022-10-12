import { useCallback, useEffect } from 'react'
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
  removeDraft: () => Promise<void>
  setDraft: (draft: Draft) => Promise<void>
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

  const fetchDraft = useCallback(
    () => ({
      data: data?.course_draft[0]?.data ?? {},
      error,
      status: getSWRLoadingStatus(data, error),
    }),
    [data, error]
  )

  const removeDraft = useCallback(async () => {
    await fetcher<
      RemoveCourseDraftMutation,
      RemoveCourseDraftMutationVariables
    >(REMOVE_COURSE_DRAFT, { profileId, courseType })
    localStorage.removeItem(`${profileId}-last-draft-course-type`)
  }, [fetcher, courseType, profileId])

  const setDraft = useCallback(
    async (draft: Draft) => {
      const normalizedDraft = draft
      if (normalizedDraft.expenses) {
        for (const key in normalizedDraft.expenses) {
          normalizedDraft.expenses[key].transport =
            normalizedDraft.expenses[key].transport?.filter(Boolean) ?? []
          normalizedDraft.expenses[key].miscellaneous =
            normalizedDraft.expenses[key].miscellaneous?.filter(Boolean) ?? []
        }
      }

      await fetcher<SetCourseDraftMutation, SetCourseDraftMutationVariables>(
        SET_COURSE_DRAFT,
        { courseType, data: normalizedDraft, profileId }
      )
    },
    [fetcher, courseType, profileId]
  )

  useEffect(() => {
    localStorage.setItem(`${profileId}-last-draft-course-type`, courseType)
  }, [profileId, courseType])

  return {
    fetchDraft,
    removeDraft,
    setDraft,
  }
}
