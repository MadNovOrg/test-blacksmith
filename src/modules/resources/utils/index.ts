import { isPast, isFuture, parseISO } from 'date-fns'

import { Course_Level_Enum, Grade_Enum } from '@app/generated/graphql'

export enum TrainerCoursesEnum {
  Level1BS = 'LEVEL_1_BS',
  IntermediateTrainer = 'INTERMEDIATE_TRAINER',
  AdvancedTrainer = 'ADVANCED_TRAINER',
  BildIntermediateTrainer = 'BILD_INTERMEDIATE_TRAINER',
  BildAdvancedTrainer = 'BILD_ADVANCED_TRAINER',
  FoundationTrainer = 'FOUNDATION_TRAINER',
  FoundationTrainerPlus = 'FOUNDATION_TRAINER_PLUS',
}

enum NonTrainerCoursesEnum {
  Level1 = 'LEVEL_1',
  Level2 = 'LEVEL_2',
  BildRegular = 'BILD_REGULAR',
  Advanced = 'ADVANCED',
  Level1NP = 'LEVEL_1_NP',
}

export type AttendedCourseData = {
  start:
    | {
        aggregate: {
          date: {
            start: string | undefined
          }
        }
      }
    | undefined
  end:
    | {
        aggregate: {
          date: {
            end: string | undefined
          }
        }
      }
    | undefined
  level?: TrainerCoursesEnum | NonTrainerCoursesEnum | Course_Level_Enum
}

export interface ICourseCategoryUserAttends {
  grade: Grade_Enum | null | undefined
  course: AttendedCourseData
}

interface ICourseCategoryUserAttendsReturnType {
  attendsNonTrainer: boolean | undefined
  attendsTrainer: boolean | undefined
}

const trainerCoursesList = Object.values(TrainerCoursesEnum)
const nonTrainerCoursesList = Object.values(NonTrainerCoursesEnum)

const courseCategoryUserAttends = (
  participantCourses?: ICourseCategoryUserAttends[],
): ICourseCategoryUserAttendsReturnType | null => {
  // return early if user doesn't attend any course
  if (participantCourses?.length === 0) {
    return null
  }

  const attendsNonTrainerCourse = participantCourses?.some(participantCourse =>
    nonTrainerCoursesList.includes(
      participantCourse.course.level as NonTrainerCoursesEnum,
    ),
  )

  const attendsTrainerCourse = participantCourses?.some(participantCourse =>
    trainerCoursesList.includes(
      participantCourse.course.level as TrainerCoursesEnum,
    ),
  )

  return {
    attendsNonTrainer: attendsNonTrainerCourse,
    attendsTrainer: attendsTrainerCourse,
  }
}

const onGoingTrainerCourseLevelsUserAttends = (
  userCourses?: ICourseCategoryUserAttends[],
): (TrainerCoursesEnum | never[])[] | undefined => {
  const ongoingTrainerCourses = userCourses?.filter(({ course }) =>
    Object.values(TrainerCoursesEnum).includes(
      course.level as TrainerCoursesEnum,
    ),
  )

  const onGoingCourses = ongoingTrainerCourses?.map(({ course }) => {
    const courseIsOngoing =
      isPast(parseISO(course.start?.aggregate?.date?.start ?? '')) &&
      isFuture(parseISO(course.end?.aggregate?.date?.end ?? ''))

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

const hasCourseInProgress = (
  participantCourses?: ICourseCategoryUserAttends[],
): boolean => {
  return (
    participantCourses?.some(participantCourse => {
      const courseStart = parseISO(
        participantCourse?.course?.start?.aggregate?.date?.start ?? '',
      )
      const courseEnd = parseISO(
        participantCourse?.course?.end?.aggregate?.date?.end ?? '',
      )

      return isPast(courseStart) && isFuture(courseEnd)
    }) ?? false
  )
}

const hasGotPassForTrainerCourse = (
  coursesList?: ICourseCategoryUserAttends[],
): boolean | undefined => {
  const attendedTrainerCourses = coursesList?.filter(attendedCourse =>
    trainerCoursesList.includes(
      attendedCourse.course.level as TrainerCoursesEnum,
    ),
  )

  return attendedTrainerCourses?.some(
    course =>
      course.grade === Grade_Enum.Pass ||
      course.grade === Grade_Enum.AssistOnly,
  )
}

export {
  courseCategoryUserAttends,
  onGoingTrainerCourseLevelsUserAttends,
  hasGotPassForTrainerCourse,
  hasCourseInProgress,
}
