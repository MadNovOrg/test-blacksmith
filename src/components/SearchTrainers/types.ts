import type { InviteStatus, CourseSchedule } from '@app/types'

export type SearchTrainersSchedule = Partial<
  Pick<CourseSchedule, 'start' | 'end'>
>

export type SearchTrainerBookings = {
  profile_id: string
  status: InviteStatus
  course: {
    schedule: Array<{
      start: string
      end: string
    }>
  }
}
