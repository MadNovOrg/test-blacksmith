import { Accreditors_Enum, Course_Type_Enum } from '@app/generated/graphql'

export const getCourseType = (
  profileId: string,
  queryType: string | null,
  isFirstPage = true
): Course_Type_Enum => {
  if (queryType) {
    return queryType as Course_Type_Enum
  }

  const lastCourseType = localStorage.getItem(
    `${profileId}-last-draft-course-type`
  )
  if (lastCourseType && !isFirstPage) {
    return lastCourseType as Course_Type_Enum
  }

  return Course_Type_Enum.Open
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
