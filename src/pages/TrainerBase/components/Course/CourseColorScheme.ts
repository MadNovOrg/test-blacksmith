import { CourseLevel } from '@app/types'

type Colors = {
  color: string
  disabledColor: string
  draggingColor: string
}

export const COURSE_COLOR_BY_LEVEL: Record<CourseLevel, Colors> = {
  [CourseLevel.LEVEL_1]: {
    color: 'bg-navy-500',
    disabledColor: 'bg-navy-200',
    draggingColor: 'bg-navy-600',
  },
  [CourseLevel.LEVEL_2]: {
    color: 'bg-purple-500',
    disabledColor: 'bg-purple-200',
    draggingColor: 'bg-purple-600',
  },
  [CourseLevel.ADVANCED]: {
    color: 'bg-fuschia-500',
    disabledColor: 'bg-fuschia-200',
    draggingColor: 'bg-fuschia-600',
  },
  [CourseLevel.INTERMEDIATE]: {
    color: 'bg-lime-500',
    disabledColor: 'bg-lime-200',
    draggingColor: 'bg-lime-600',
  },
}
