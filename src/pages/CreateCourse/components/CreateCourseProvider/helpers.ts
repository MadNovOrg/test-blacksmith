import { Accreditors_Enum } from '@app/generated/graphql'
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

export const getCourseAccreditor = (
  profileId: string,
  queryType: string | null,
  isFirstPage = true
): Accreditors_Enum => {
  if (queryType) {
    return queryType as Accreditors_Enum
  }

  const lastCourseAccreditor = localStorage.getItem(
    `${profileId}-last-draft-course-accreditor`
  )
  if (lastCourseAccreditor && !isFirstPage) {
    return lastCourseAccreditor as Accreditors_Enum
  }

  return Accreditors_Enum.Icm
}
