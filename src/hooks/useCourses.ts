import { useMemo } from 'react'
import useSWR from 'swr'

import {
  QUERY as GetTrainerCourses,
  ResponseType as GetTrainerCoursesResp,
  ParamsType as GetTrainerCoursesParams,
} from '@app/queries/courses/get-trainer-courses'
import {
  QUERY as GetUserCourses,
  ResponseType as GetUserCoursesResp,
  ParamsType as GetUserCoursesParams,
} from '@app/queries/user-queries/get-user-courses'
import { RoleName } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { Sorting } from './useTableSort'

type Props = {
  sorting: Sorting
  where: Record<string, unknown>
}

type Resp = GetTrainerCoursesResp | GetUserCoursesResp
type Params = GetTrainerCoursesParams | GetUserCoursesParams

export const useCourses = (role: RoleName, { sorting, where }: Props) => {
  const orderBy = getOrderBy(sorting)
  const isUser = role === RoleName.USER
  const QUERY = isUser ? GetUserCourses : GetTrainerCourses

  const { data, error, mutate } = useSWR<Resp, Error, [string, Params] | null>(
    [QUERY, { orderBy, where }],
    { focusThrottleInterval: 2000 }
  )

  const status = getSWRLoadingStatus(data, error)

  return useMemo(
    () => ({
      courses: data?.course ?? [],
      status,
      error,
      loading: status === LoadingStatus.FETCHING,
      mutate,
    }),
    [data, error, status, mutate]
  )
}

function getOrderBy({ by, dir }: Pick<Sorting, 'by' | 'dir'>) {
  switch (by) {
    case 'name':
    case 'type':
      return { [by]: dir }

    case 'org':
      return { organization: { name: dir } }

    case 'start':
    case 'end':
      return { schedule_aggregate: { min: { [by]: dir } } }
  }
}
