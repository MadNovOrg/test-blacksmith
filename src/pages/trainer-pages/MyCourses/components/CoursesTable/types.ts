import { TableCellProps } from '@mui/material'

import { TrainerCoursesQuery } from '@app/generated/graphql'

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
