import { useMemo } from 'react'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Course_Draft_Order_By,
  GetCourseDraftsQuery,
  GetCourseDraftsQueryVariables,
  Order_By,
} from '@app/generated/graphql'
import { QUERY as GET_COURSE_DRAFTS } from '@app/queries/courses/get-course-drafts'

import { Sorting } from './useTableSort'

type Props = {
  sorting: Sorting
  pagination?: { perPage: number; currentPage: number }
  profileId?: string
}

export function useCourseDrafts({ sorting, pagination }: Props) {
  const { acl } = useAuth()
  const orderBy = getOrderBy(sorting)
  const [{ data, error, fetching }] = useQuery<
    GetCourseDraftsQuery,
    GetCourseDraftsQueryVariables
  >({
    query: GET_COURSE_DRAFTS,
    variables: {
      orderBy,
      ...(pagination
        ? {
            limit: pagination.perPage,
            offset: pagination.perPage * (pagination?.currentPage - 1),
          }
        : null),
    },
    pause: !acl.isTrainer(),
  })

  const mapDraftData = (
    dataFromResponse?: GetCourseDraftsQuery['course_draft'],
  ) =>
    dataFromResponse?.map(d => ({
      id: d.id,
      name: d.name,
      draft: d.data ?? {},
      profile: d.profile,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }))

  return useMemo(
    () => ({
      drafts: mapDraftData(data?.course_draft) ?? [],
      error,
      loading: fetching,
      total: data?.course_draft_aggregate
        ? data?.course_draft_aggregate.aggregate?.count
        : 0,
    }),
    [data?.course_draft, data?.course_draft_aggregate, error, fetching],
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
