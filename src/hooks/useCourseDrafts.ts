import { useMemo } from 'react'
import useSWR from 'swr'

import { useAuth } from '@app/context/auth'
import {
  Course_Draft_Order_By,
  GetCourseDraftsQuery,
  GetCourseDraftsQueryVariables,
  Order_By,
} from '@app/generated/graphql'
import { QUERY as GET_COURSE_DRAFTS } from '@app/queries/courses/get-course-drafts'
import { LoadingStatus, getSWRLoadingStatus } from '@app/util'

import { Sorting } from './useTableSort'

type Props = {
  sorting: Sorting
  pagination?: { perPage: number; currentPage: number }
  profileId?: string
}

export function useCourseDrafts({ sorting, pagination }: Props) {
  const { acl } = useAuth()
  const orderBy = getOrderBy(sorting)
  const { data, error } = useSWR<
    GetCourseDraftsQuery,
    Error,
    [string, GetCourseDraftsQueryVariables] | null
  >(
    acl.isTrainer()
      ? [
          GET_COURSE_DRAFTS,
          {
            orderBy,
            ...(pagination
              ? {
                  limit: pagination.perPage,
                  offset: pagination.perPage * (pagination?.currentPage - 1),
                }
              : null),
          },
        ]
      : null
  )

  const mapDraftData = (
    dataFromResponse?: GetCourseDraftsQuery['course_draft']
  ) =>
    dataFromResponse?.map(d => ({
      id: d.id,
      name: d.name,
      draft: d.data ?? {},
      profile: d.profile,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }))

  const status = getSWRLoadingStatus(data, error)

  return useMemo(
    () => ({
      drafts: mapDraftData(data?.course_draft) ?? [],
      status,
      error,
      loading: status === LoadingStatus.FETCHING,
      total: data?.course_draft_aggregate.aggregate?.count,
    }),
    [data, error, status]
  )
}

export function getOrderBy({
  by,
  dir,
}: Pick<Sorting, 'by' | 'dir'>): Course_Draft_Order_By {
  switch (by) {
    case 'courseType':
    case 'createdAt':
      return { [by]: dir }

    default: {
      return { createdAt: Order_By.Desc }
    }
  }
}
