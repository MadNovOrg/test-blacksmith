import type {
  Profile,
  InviteStatus,
  CourseSchedule,
  SearchTrainerAvailability,
} from '@app/types'

export type SearchTrainer = {
  availability?: SearchTrainerAvailability
} & Pick<Profile, 'id' | 'fullName' | 'avatar'>

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
