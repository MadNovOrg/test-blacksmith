import { differenceInDays, differenceInWeeks } from 'date-fns'
import { difference, isDate } from 'lodash-es'

import { Course_Level_Enum } from '@app/generated/graphql'
import { InviteStatus, SetCourseTrainerInput } from '@app/types'

export const getCancellationTermsFee = (
  courseStartDate: Date | string
): number => {
  const start = isDate(courseStartDate)
    ? courseStartDate
    : new Date(courseStartDate)
  const diff = differenceInDays(start, new Date())
  if (diff < 7) {
    return 100
  } else if (diff < 15) {
    return 75
  } else if (diff < 29) {
    return 50
  } else if (diff < 57) {
    return 25
  } else {
    return 0
  }
}

export const getReschedulingTermsFee = (
  startDate: Date,
  level: Course_Level_Enum
): number => {
  const diffInWeeks = differenceInWeeks(startDate, new Date())

  if (
    [
      Course_Level_Enum.Level_1,
      Course_Level_Enum.Level_2,
      Course_Level_Enum.Advanced,
      Course_Level_Enum.BildRegular,
    ].includes(level)
  ) {
    if (diffInWeeks < 2) {
      return 25
    } else if (diffInWeeks < 4) {
      return 15
    } else {
      return 0
    }
  }

  if (
    [
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.BildIntermediateTrainer,
      Course_Level_Enum.BildAdvancedTrainer,
    ].includes(level)
  ) {
    if (diffInWeeks < 1) {
      return 50
    } else if (diffInWeeks < 4) {
      return 25
    } else {
      return 0
    }
  }

  throw new Error('Not supported course level')
}

export type CourseDiff = {
  type: 'date' | 'venue'
  oldValue: string | Date[]
  newValue: string | Date[]
}

export function getChangedTrainers(
  currentTrainers: Omit<SetCourseTrainerInput, 'course_id'>[],
  newTrainers: Pick<SetCourseTrainerInput, 'profile_id' | 'type'>[]
): [Omit<SetCourseTrainerInput, 'course_id'>[], string[]] {
  const trainersToDelete = difference(
    currentTrainers.map(t => t.profile_id),
    newTrainers.map(t => t.profile_id)
  )
  const trainersToAdd: Omit<SetCourseTrainerInput, 'course_id'>[] = []

  const currentTrainersMap = new Map(
    currentTrainers.map(t => [t.profile_id, t])
  )

  newTrainers.forEach(t => {
    const existingTrainer = currentTrainersMap.get(t.profile_id)

    if (!existingTrainer) {
      trainersToAdd.push({ ...t, status: InviteStatus.PENDING })
    }

    if (existingTrainer && existingTrainer.type !== t.type) {
      trainersToDelete.push(t.profile_id)

      trainersToAdd.push({ ...t, status: InviteStatus.PENDING })
    }
  })

  return [trainersToAdd, trainersToDelete]
}
