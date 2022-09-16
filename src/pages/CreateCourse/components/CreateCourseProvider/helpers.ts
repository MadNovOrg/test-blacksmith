import { CourseType } from '@app/types'

export const getCourseType = (
  profileId: string,
  queryType: string | null,
  isFirstPage = true
): CourseType => {
  if (queryType) {
    return queryType as CourseType
  }

  const lastCourseType = localStorage.getItem(
    `${profileId}-last-draft-course-type`
  )
  if (lastCourseType && !isFirstPage) {
    return lastCourseType as CourseType
  }

  return CourseType.OPEN
}
