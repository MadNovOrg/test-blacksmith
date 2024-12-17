import { Course_Status_Enum } from '@app/generated/graphql'

export const attendanceDisabledStatuses = [
  Course_Status_Enum.Cancelled,
  Course_Status_Enum.Declined,
  Course_Status_Enum.Draft,
]

export const getAttendanceDisabled = (courseStatus: Course_Status_Enum) =>
  attendanceDisabledStatuses.includes(courseStatus)
