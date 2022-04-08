import type { Profile, CourseTrainerType } from '@app/types'

export type Trainer = Pick<Profile, 'id' | 'fullName' | 'avatar'>

export type SetCourseTrainerVars = {
  courseId: number
  trainers: SetCourseTrainerInput[]
}

export type SetCourseTrainerInput = {
  course_id: number
  profile_id: string
  type: CourseTrainerType
}
