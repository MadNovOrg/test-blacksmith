import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  Course_Order_By,
  Order_By,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GetTrainerCourses } from '@app/queries/courses/get-trainer-courses'
import { RoleName } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { Sorting } from './useTableSort'

type Props = {
  sorting: Sorting
  where: Record<string, unknown>
  pagination?: { perPage: number; currentPage: number }
}

export const useCourses = (
  _role: RoleName,
  { sorting, where, pagination }: Props
) => {
  const orderBy = getOrderBy(sorting)

  const [{ data, error }, refetch] = useQuery<
    TrainerCoursesQuery,
    TrainerCoursesQueryVariables
  >({
    requestPolicy: 'cache-and-network',
    query: GetTrainerCourses,
    variables: {
      where,
      orderBy,
      ...(pagination
        ? {
            limit: pagination.perPage,
            offset: pagination.perPage * (pagination?.currentPage - 1),
          }
        : null),
    },
  })

  const status = getSWRLoadingStatus(data, error)

  return useMemo(
    () => ({
      courses: data?.courses ?? [],
      status,
      error,
      loading: status === LoadingStatus.FETCHING,
      mutate: () => refetch({ requestPolicy: 'network-only' }),
      total: data?.course_aggregate.aggregate?.count,
    }),
    [data, error, status, refetch]
  )
}

function getOrderBy({ by, dir }: Pick<Sorting, 'by' | 'dir'>): Course_Order_By {
  switch (by) {
    case 'name':
    case 'type':
      return { [by]: dir }

    case 'start':
    case 'end':
      return { schedule_aggregate: { min: { [by]: dir } } }
    default: {
      return { name: Order_By.Asc }
    }
  }
}
