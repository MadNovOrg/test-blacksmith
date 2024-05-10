import { isPast, isFuture, parseISO } from 'date-fns'

import { Grade_Enum } from '@app/generated/graphql'

export enum TrainerCoursesEnum {
  Level1BS = 'LEVEL_1_BS',
  IntermediateTrainer = 'INTERMEDIATE_TRAINER',
  AdvancedTrainer = 'ADVANCED_TRAINER',
  BildIntermediateTrainer = 'BILD_INTERMEDIATE_TRAINER',
  BildAdvancedTrainer = 'BILD_ADVANCED_TRAINER',
  FoundationTrainerPlus = 'FOUNDATION_TRAINER_PLUS',
}

enum NonTrainerCoursesEnum {
  Level1 = 'LEVEL_1',
  Level2 = 'LEVEL_2',
  BildRegular = 'BILD_REGULAR',
  Advanced = 'ADVANCED',
}

type AttendedCourseData = {
  start?: string | undefined
  end?: string | undefined
  level?: TrainerCoursesEnum | NonTrainerCoursesEnum
}

export interface ICourseCategoryUserAttends {
  grade?: Grade_Enum | null | undefined
  course: AttendedCourseData
}

interface ICourseCategoryUserAttendsReturnType {
  attendsNonTrainer: boolean | undefined
  attendsTrainer: boolean | undefined
}

interface ITrainerCourseProgress {
  started: boolean | null
  ended: boolean | null
}

const trainerCoursesList = Object.values(TrainerCoursesEnum)
const nonTrainerCoursesList = Object.values(NonTrainerCoursesEnum)

const courseCategoryUserAttends = (
  participantCourses?: ICourseCategoryUserAttends[]
): ICourseCategoryUserAttendsReturnType | null => {
  // return early if user doesn't attend any course
  if (participantCourses?.length === 0) {
    return null
  }

  const attendsNonTrainerCourse = participantCourses?.some(participantCourse =>
    nonTrainerCoursesList.includes(
      participantCourse.course.level as NonTrainerCoursesEnum
    )
  )

  const attendsTrainerCourse = participantCourses?.some(participantCourse =>
    trainerCoursesList.includes(
      participantCourse.course.level as TrainerCoursesEnum
    )
  )

  return {
    attendsNonTrainer: attendsNonTrainerCourse,
    attendsTrainer: attendsTrainerCourse,
  }
}

const onGoingTrainerCourseLevelsUserAttends = (
  userCourses?: ICourseCategoryUserAttends[]
): (TrainerCoursesEnum | never[])[] | undefined => {
  const onGoingCourses = userCourses?.map(({ course }) => {
    const courseIsOngoing =
      isPast(parseISO(course.start ?? '')) &&
      isFuture(parseISO(course.end ?? ''))

    if (courseIsOngoing) {
      return course.level as TrainerCoursesEnum
    }

    return null
  })

  return (
    (onGoingCourses?.filter(level => level) as TrainerCoursesEnum[]) ||
    undefined
  )
}

const trainerCourseProgress = (
  participantCourses?: ICourseCategoryUserAttends[]
): ITrainerCourseProgress | null => {
  const attendedTrainerCourses = participantCourses?.filter(attendedCourse =>
    trainerCoursesList.includes(
      attendedCourse.course.level as TrainerCoursesEnum
    )
  )

  const started = attendedTrainerCourses?.some(participantCourse =>
    isPast(parseISO(participantCourse.course.start ?? ''))
  )
  const ended = attendedTrainerCourses?.some(participantCourse =>
    isPast(parseISO(participantCourse.course.end ?? ''))
  )

  return {
    started: started ? started : null,
    ended: ended ? ended : null,
  }
}

const hasGotPassForTrainerCourse = (
  coursesList?: ICourseCategoryUserAttends[]
): boolean | undefined => {
  const attendedTrainerCourses = coursesList?.filter(attendedCourse =>
    trainerCoursesList.includes(
      attendedCourse.course.level as TrainerCoursesEnum
    )
  )

  return attendedTrainerCourses?.some(
    course =>
      course.grade === Grade_Enum.Pass || course.grade === Grade_Enum.AssistOnly
  )
}

export {
  courseCategoryUserAttends,
  onGoingTrainerCourseLevelsUserAttends,
  hasGotPassForTrainerCourse,
  trainerCourseProgress,
}
