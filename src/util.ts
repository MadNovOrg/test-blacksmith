import { differenceInDays, format, formatDistanceToNow, isPast } from 'date-fns'
import { TFunction } from 'i18next'

import { Course, CourseLevel, CourseParticipantModule } from '@app/types'

export const INPUT_DATE_FORMAT = 'yyyy-MM-dd'
export const DATE_MASK = '____-__-__'

export const noop = () => {
  // empty
}

export const formatDateWithTime = (value: string | Date): string => {
  if (!value) return ''
  return format(
    typeof value === 'string' ? new Date(value) : value,
    'yyyy-MM-dd HH:mm'
  )
}

export const formatDateRange = (dateFrom: Date, dateTo: Date): string => {
  if (!dateFrom || !dateTo) {
    return ``
  }
  const sameYear = dateFrom.getFullYear() === dateTo.getFullYear()
  const sameMonth = sameYear && dateFrom.getMonth() === dateTo.getMonth()
  const sameDay = sameMonth && dateFrom.getDate() === dateTo.getDate()
  if (sameDay) {
    return format(dateFrom, 'do LLLL')
  }
  if (sameMonth) {
    return `${format(dateFrom, 'do')}-${format(dateTo, 'do')} ${format(
      dateTo,
      'LLLL'
    )}`
  }
  if (sameYear) {
    return `${format(dateFrom, 'do LLLL')} - ${format(dateTo, 'do LLLL')}`
  }
  return `${format(dateFrom, 'do LLLL y')} - ${format(dateTo, 'do LLLL y')}`
}

export const formatDateForInput = (value: string | Date) => {
  return format(
    typeof value === 'string' ? new Date(value) : value,
    INPUT_DATE_FORMAT
  )
}

export const formatDateForDraft = (
  value: string | Date,
  wordToAppend: string
) => {
  const date = typeof value === 'string' ? new Date(value) : value

  if (differenceInDays(Date.now(), date) >= 1) {
    return format(date, 'MMMM d, yyyy')
  }

  return `${formatDistanceToNow(date)} ${wordToAppend}`
}

export const formatDurationShort = (durationInMinutes: number) => {
  const hours = Math.floor(durationInMinutes / 60)
  const minutes = durationInMinutes - hours * 60
  if (hours) {
    const hoursPart = `${hours}${hours > 1 ? 'hrs' : 'hr'}`
    if (minutes) {
      return `${hoursPart} ${minutes}mins`
    }
    return hoursPart
  } else {
    return `${minutes}mins`
  }
}

export const getPercentage = (x: number, y: number) => {
  if (!x || !y) return 0
  return (x / y) * 100
}

export const now = () => new Date()

export function capitalize(str: string): string {
  const lower = str.toLowerCase()

  return str.charAt(0).toUpperCase() + lower.slice(1)
}

export enum LoadingStatus {
  IDLE,
  SUCCESS,
  FETCHING,
  ERROR,
}

export function getSWRLoadingStatus(
  data?: object,
  error?: Error
): LoadingStatus {
  let status: LoadingStatus = LoadingStatus.IDLE

  if (!data && !error) {
    status = LoadingStatus.FETCHING
  }

  if (error) {
    status = LoadingStatus.ERROR
  }

  if (data && !error) {
    status = LoadingStatus.SUCCESS
  }

  return status
}

export const courseStarted = (course: Course) =>
  isPast(new Date(course.schedule[0].start))
export const courseEnded = (course: Course) =>
  isPast(new Date(course.schedule[0].end))

export const transformModulesToGroups = (
  courseModules: CourseParticipantModule[]
): Array<{
  id: string
  name: string
  modules: Array<{ id: string; name: string; completed: boolean }>
}> => {
  const groups: Record<
    string,
    {
      id: string
      name: string
      modules: Array<{ id: string; name: string; completed: boolean }>
    }
  > = {}

  courseModules.forEach(courseModule => {
    const moduleGroup = groups[courseModule.module.moduleGroup.id]

    if (!moduleGroup) {
      groups[courseModule.module.moduleGroup.id] = {
        id: courseModule.module.moduleGroup.id,
        name: courseModule.module.moduleGroup.name,
        modules: [],
      }
    }

    groups[courseModule.module.moduleGroup.id].modules.push({
      id: courseModule.module.id,
      name: courseModule.module.name,
      completed: courseModule.completed,
    })
  })

  return Object.values(groups)
}

export const generateCourseName = (
  courseData: Pick<Course, 'level' | 'reaccreditation'>,
  t: TFunction
) => {
  let courseLevelLabel = t(`common.course-levels.${courseData.level}`)

  if (courseData.level === CourseLevel.ADVANCED) {
    courseLevelLabel = `${courseLevelLabel} ${t('common.modules')}`
  }

  return `${t('common.course-name-prefix')}: ${courseLevelLabel} ${
    courseData.reaccreditation ? t('common.reaccreditation') : null
  }`
}
