import { TableCellProps } from '@mui/material'

import { Course_Status_Enum } from '@app/generated/graphql'
import { TrainerCoursesQuery } from '@app/generated/graphql'
import { RoleName } from '@app/types'

export function getActionableStatuses(
  roleName: RoleName,
): Set<Course_Status_Enum> {
  switch (roleName) {
    case RoleName.TRAINER: {
      return new Set([Course_Status_Enum.TrainerPending])
    }

    case RoleName.TT_ADMIN:
    case RoleName.TT_OPS:
    case RoleName.LD: {
      return new Set([Course_Status_Enum.ExceptionsApprovalPending])
    }
  }

  return new Set()
}

export const getStatusesFromQueryString = (queryString: string): string[] => {
  const params = new URLSearchParams(queryString)
  const statuses: string[] = []

  for (const [key, value] of params.entries()) {
    if (key === 'status') {
      const statusValues = value.split(',')
      statuses.push(...statusValues)
    }
  }

  return statuses
}

export type Cols =
  | 'name'
  | 'venue'
  | 'type'
  | 'start'
  | 'end'
  | 'createdAt'
  | 'trainers'
  | 'registrants'
  | 'status'
  | 'orders'
  | 'actions'

export type ColHead = {
  id: Cols
  label: string
  sorting?: boolean
  align?: TableCellProps['align']
}

export type TableCourse = TrainerCoursesQuery['courses'][0]
