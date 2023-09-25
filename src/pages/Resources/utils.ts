import { isPast, parseISO } from 'date-fns'

import { Grade_Enum, Course_Level_Enum } from '@app/generated/graphql'

enum TrainerCourses {
  IntermediateTrainer = 'INTERMEDIATE_TRAINER',
  AdvancedTrainer = 'ADVANCED_TRAINER',
  BildIntermediateTrainer = 'BILD_INTERMEDIATE_TRAINER',
  BildAdvancedTrainer = 'BILD_ADVANCED_TRAINER',
}

enum NonTrainerCourses {
  Level1 = 'LEVEL_1',
  Level2 = 'LEVEL_2',
  BildRegular = 'BILD_REGULAR',
  Advanced = 'ADVANCED',
}

interface ICourseCategoryUserAttends {
  grade?: Grade_Enum | null | undefined
  course: {
    start?: string | undefined
    end?: string | undefined
    level?: Course_Level_Enum
  }
}

interface ICourseCategoryUserAttendsReturnType {
  attendsNonTrainer: boolean | undefined
  attendsTrainer: boolean | undefined
}

interface ITrainerCourseProgress {
  started: boolean | null
  ended: boolean | null
}

const trainerCoursesList = Object.values(TrainerCourses)
const nonTrainerCoursesList = Object.values(NonTrainerCourses)

const courseCategoryUserAttends = (
  participantCourses?: ICourseCategoryUserAttends[]
): ICourseCategoryUserAttendsReturnType | null => {
  // return early if user doesn't attend any course
  if (participantCourses?.length === 0) {
    return null
  }

  const attendsNonTrainerCourse = participantCourses?.some(participantCourse =>
    nonTrainerCoursesList.includes(
      participantCourse.course.level as unknown as NonTrainerCourses
    )
  )

  const attendsTrainerCourse = participantCourses?.some(participantCourse =>
    trainerCoursesList.includes(
      participantCourse.course.level as unknown as TrainerCourses
    )
  )

  return {
    attendsNonTrainer: attendsNonTrainerCourse,
    attendsTrainer: attendsTrainerCourse,
  }
}

const trainerCourseProgress = (
  participantCourses?: ICourseCategoryUserAttends[]
): ITrainerCourseProgress | null => {
  const attendedTrainerCourses = participantCourses?.filter(attendedCourse =>
    trainerCoursesList.includes(
      attendedCourse.course.level as unknown as TrainerCourses
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
      attendedCourse.course.level as unknown as TrainerCourses
    )
  )

  return attendedTrainerCourses?.some(
    course =>
      course.grade === Grade_Enum.Pass || course.grade === Grade_Enum.AssistOnly
  )
}

export {
  courseCategoryUserAttends,
  hasGotPassForTrainerCourse,
  trainerCourseProgress,
}
