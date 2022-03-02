import { CourseLevel } from '@app/types'

export const COURSE_COLOR: Record<
  CourseLevel,
  'navy' | 'purple' | 'fuschia' | 'lime'
> = {
  [CourseLevel.LEVEL_1]: 'navy',
  [CourseLevel.LEVEL_2]: 'purple',
  [CourseLevel.ADVANCED]: 'fuschia',
  [CourseLevel.INTERMEDIATE]: 'lime',
}
