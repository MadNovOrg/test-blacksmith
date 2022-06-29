import { Auth } from 'aws-amplify'
import {
  differenceInDays,
  format,
  formatDistanceToNow,
  isPast,
  parse,
} from 'date-fns'
import { TFunction } from 'i18next'
import { FieldError } from 'react-hook-form'

import {
  Address,
  Course,
  CourseInput,
  CourseLevel,
  CourseParticipantModule,
  CourseTrainer,
  CourseTrainerType,
  CourseType,
  Organization,
  SearchTrainer,
  SetCourseTrainerInput,
} from '@app/types'

export const INPUT_DATE_FORMAT = 'dd/MM/yyyy'
export const INPUT_TIME_FORMAT = 'hh:mm aa'
export const DATE_MASK = '__/__/____'
export const TIME_MASK = '__:__ _M'

export const noop = () => {
  // empty
}

export const dateInputValueParse = (value: string): Date => {
  return parse(value, INPUT_DATE_FORMAT, new Date())
}

export const dateInputValueFormat = (date: Date): string => {
  return format(date, INPUT_DATE_FORMAT)
}

export const formatDateForDraft = (
  value: string | Date,
  wordToAppend: string,
  t: TFunction
) => {
  const date = typeof value === 'string' ? new Date(value) : value

  if (differenceInDays(Date.now(), date) >= 1) {
    return t('dates.default', { date })
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
  IDLE = 'IDLE',
  SUCCESS = 'SUCCESS',
  FETCHING = 'FETCHING',
  ERROR = 'ERROR',
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

export const getCourseTrainer = (trainers: CourseTrainer[]) => {
  return trainers.find(t => t.type === CourseTrainerType.LEADER)
}

export const getCourseAssistants = (trainers: CourseTrainer[]) => {
  return trainers.filter(t => t.type === CourseTrainerType.ASSISTANT)
}

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
    courseData.reaccreditation ? t('common.reaccreditation') : ''
  }`
}

export const COURSE_TYPE_TO_PREFIX = {
  [CourseType.OPEN]: 'OP',
  [CourseType.CLOSED]: 'CL',
  [CourseType.INDIRECT]: 'INDR',
}

export const COURSE_LEVEL_TO_PREFIX = {
  [CourseLevel.LEVEL_1]: 'L1',
  [CourseLevel.LEVEL_2]: 'L2',
  [CourseLevel.ADVANCED]: 'ADV',
  [CourseLevel.BILD_ACT]: 'ACT',
  [CourseLevel.INTERMEDIATE_TRAINER]: 'INT-T',
  [CourseLevel.ADVANCED_TRAINER]: 'ADV-T',
  [CourseLevel.BILD_ACT_TRAINER]: 'ACT-T',
}

export const getCertificateNumberPrefix = (
  type: CourseType,
  level: CourseLevel,
  courseId: string
): string => {
  return `${COURSE_TYPE_TO_PREFIX[type]}-${COURSE_LEVEL_TO_PREFIX[level]}-${courseId}`
}

export const getNumberOfAssistants = (maxParticipants: number) => {
  return Math.floor((maxParticipants ?? 0) / 12)
}

export const requiredMsg = (t: TFunction, name: string) => {
  return t('validation-errors.required-field', { name: t(name) })
}

export const profileToInput = (course: Course, type: CourseTrainerType) => {
  return (p: SearchTrainer): SetCourseTrainerInput => ({
    course_id: course.id,
    profile_id: p.id,
    type,
  })
}

export const courseToCourseInput = (course: Course): CourseInput => {
  return {
    type: course.type,
    deliveryType: course.deliveryType,
    organization: course.organization ?? null,
    contactProfile: course.contactProfile ?? null,
    blendedLearning: course.go1Integration,
    reaccreditation: course.reaccreditation,
    courseLevel: course.level,
    zoomMeetingUrl: course.schedule[0].virtualLink ?? null,
    venue: course.schedule[0].venue ?? null,
    minParticipants: course.min_participants,
    maxParticipants: course.max_participants,
    startDateTime: course.schedule[0].start,
    endDateTime: course.schedule[0].end,
    courseCost: course.aolCostOfCourse ?? null,
    usesAOL: Boolean(course.aolCostOfCourse),
  }
}

export const normalizeAddr = (addr: Address | undefined) => {
  if (!addr) return null

  return [addr.line1, addr.line2, addr.city, addr.country, addr.postCode]
}

export const findCourseTrainer = (
  trainers: CourseTrainer[] | undefined,
  profileId: string
): CourseTrainer | undefined => {
  return (trainers ?? []).find(t => t.profile.id === profileId)
}

export function userExistsInCognito(email: string) {
  return Auth.signIn(email, '123')
    .then(() => true)
    .catch(err => err.code === 'NotAuthorizedException')
}

export function renderOrgAddress(org?: Organization) {
  if (!org?.address) return ''
  return [
    org.address.line1,
    org.address.line2,
    org.address.city,
    org.address.state,
    org.address.postCode,
    org.address.country,
  ]
    .filter(Boolean)
    .join(', ')
}

export function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.substr(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

export function getInitialsFromName(name: string) {
  const names = (name ?? '').split(' ')
  const [firstLetter = ''] = names[0]
  const [secondLetter = ''] = names.length > 1 ? names.slice(-1)[0] : []

  return firstLetter + secondLetter
}

/**
 * This is done as a workaround to the issue where RHF doesn't set types correctly for
 * fields with array of primitive types.
 * https://github.com/react-hook-form/react-hook-form/issues/725
 * https://github.com/react-hook-form/react-hook-form/issues/987
 * Although both these issues are marked as closed, there is no good solution to this
 * Hence the forced type `as FieldError & FieldError[]` is used
 */
export function getFieldError(err: FieldError[]) {
  const error = err as FieldError & FieldError[]

  if (error.length) {
    return error.filter(Boolean)[0].message
  }

  return error.message
}
