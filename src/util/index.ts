import { Auth } from 'aws-amplify'
import {
  differenceInCalendarDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  formatDistanceToNow,
  isPast,
  parse,
} from 'date-fns'
import { TFunction } from 'i18next'
import { FieldError, Merge } from 'react-hook-form'

import {
  Course_Status_Enum,
  Grade_Enum,
  Profile,
  XeroInvoiceStatus,
} from '@app/generated/graphql'
import {
  Address,
  AdminOnlyCourseStatus,
  AllCourseStatuses,
  AttendeeOnlyCourseStatus,
  CertificateStatus,
  Course,
  CourseInput,
  CourseLevel,
  CourseParticipantModule,
  CourseTrainer,
  CourseTrainerType,
  CourseType,
  SearchTrainer,
  SetCourseTrainerInput,
  SortOrder,
  TimeDifferenceAndContext,
} from '@app/types'

export { formatCourseVenue, formatCourseVenueName } from './formatCourseVenue'
export { getOrderDueDate, isOrderDueDateImmediate } from './orderDueDate'

export const INPUT_DATE_FORMAT = 'dd/MM/yyyy'
export const INPUT_TIME_FORMAT = 'HH:mm'
export const DATE_MASK = '__/__/____'
export const TIME_MASK = '__:__ _M'
export const DEFAULT_ACCOMMODATION_COST_PER_NIGHT = 95.0

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

export const getCourseLeadTrainer = (trainers: CourseTrainer[]) => {
  return trainers.find(t => t.type === CourseTrainerType.Leader)
}

export const getCourseAssistants = (trainers: CourseTrainer[]) => {
  return trainers.filter(t => t.type === CourseTrainerType.Assistant)
}

export const getCourseModerator = (trainers: CourseTrainer[]) => {
  return trainers.find(t => t.type === CourseTrainerType.Moderator)
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
  const courseLevelLabel = t(`common.course-levels.${courseData.level}`)

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
  [CourseLevel.Level_1]: 'L1',
  [CourseLevel.Level_2]: 'L2',
  [CourseLevel.Advanced]: 'ADV',
  [CourseLevel.BildAct]: 'ACT',
  [CourseLevel.IntermediateTrainer]: 'INT-T',
  [CourseLevel.AdvancedTrainer]: 'ADV-T',
  [CourseLevel.BildActTrainer]: 'ACT-T',
}

export const getCertificateNumberPrefix = (
  type: CourseType,
  level: CourseLevel,
  courseId: string
): string => {
  return `${COURSE_TYPE_TO_PREFIX[type]}-${COURSE_LEVEL_TO_PREFIX[level]}-${courseId}`
}

export const requiredMsg = (t: TFunction, name: string) => {
  return t('validation-errors.required-field', { name: t(name) })
}

export const profileToInput = (course: Course, type: CourseTrainerType) => {
  return (p: Pick<SearchTrainer, 'id'>): SetCourseTrainerInput => ({
    course_id: course.id,
    profile_id: p.id,
    type,
  })
}

export function extractTime(date: Date | string | null) {
  try {
    return format(new Date(date || Date.now()), 'HH:mm')
  } catch (e) {
    return ''
  }
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
    startDateTime: new Date(course.schedule[0].start),
    startDate: new Date(course.schedule[0].start),
    startTime: extractTime(course.schedule[0].start),
    endDateTime: new Date(course.schedule[0].end),
    endDate: new Date(course.schedule[0].end),
    endTime: extractTime(course.schedule[0].end),
    courseCost: course.aolCostOfCourse ?? null,
    usesAOL: Boolean(course.aolCostOfCourse),
    aolCountry: course.aolCountry ?? null,
    aolRegion: course.aolRegion ?? null,
    freeSpaces: course.freeSpaces ?? null,
    salesRepresentative: course.salesRepresentative ?? null,
    accountCode: course.accountCode ?? null,
    notes: course.notes ?? null,
    specialInstructions: course.special_instructions ?? '',
    parkingInstructions: course.parking_instructions ?? '',
  }
}

export const normalizeAddr = (addr: Address | undefined) => {
  if (!addr) return null

  return [addr.line1, addr.line2, addr.city, addr.country, addr.postCode]
}

export const findCourseTrainer = <T extends { profile: Profile['id'] }>(
  trainers: T[] | undefined,
  profileId: string
): T | undefined => {
  return (trainers ?? []).find(t => t.profile.id === profileId)
}

export function userExistsInCognito(email: string) {
  return Auth.signIn(email, '123')
    .then(() => true)
    .catch(err => err.code === 'NotAuthorizedException')
}

export function renderOrgAddress(org?: {
  address: {
    line1: string
    line2: string
    city: string
    state: string
    postCode: string
    country: string
  }
}) {
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
export function getFieldError(
  err: Merge<FieldError, (FieldError | undefined)[]>
) {
  const error = err as (FieldError & FieldError[]) | undefined

  if (error?.length) {
    return error.filter(Boolean)[0].message
  }

  return error?.message
}

export const INVOICE_STATUS_COLOR: Record<
  XeroInvoiceStatus,
  'success' | 'default' | 'error' | 'warning'
> = {
  [XeroInvoiceStatus.Authorised]: 'warning',
  [XeroInvoiceStatus.Deleted]: 'default',
  [XeroInvoiceStatus.Draft]: 'default',
  [XeroInvoiceStatus.Overdue]: 'error',
  [XeroInvoiceStatus.Paid]: 'success',
  [XeroInvoiceStatus.Submitted]: 'warning',
  [XeroInvoiceStatus.Unknown]: 'default',
  [XeroInvoiceStatus.Voided]: 'default',
}

// more on this logic [here](https://github.com/TeamTeach/application/wiki/Organisations)
export function getProfileCertificationLevels(
  certificates: { courseLevel: string; status: CertificateStatus }[]
): (CourseLevel | null)[] {
  const levels = []

  const advancedTrainer = certificates.find(
    c => c.courseLevel === CourseLevel.AdvancedTrainer
  )
  if (advancedTrainer) {
    levels.push(CourseLevel.AdvancedTrainer)
    if (advancedTrainer.status !== CertificateStatus.EXPIRED_RECENTLY) {
      return levels
    }
  }

  if (certificates.find(c => c.courseLevel === CourseLevel.Advanced)) {
    levels.push(CourseLevel.Advanced)
  }

  const hierarchy = [
    CourseLevel.IntermediateTrainer,
    CourseLevel.Level_2,
    CourseLevel.Level_1,
  ]
  for (const level of hierarchy) {
    const certificate = certificates.find(c => c.courseLevel === level)
    if (certificate) {
      levels.push(level)
      if (certificate.status !== CertificateStatus.EXPIRED_RECENTLY) {
        return levels
      }
    }
  }

  return levels.length > 0 ? levels : [null]
}

export const getTimeDifferenceAndContext = (
  end: Date,
  start: Date
): TimeDifferenceAndContext => {
  const result: TimeDifferenceAndContext = {
    count: differenceInDays(end, start) + 1,
    context: 'days',
  }
  if (result.count === 1) {
    result.count = differenceInHours(end, start)
    result.context = 'hours'
  }

  if (result.count === 0) {
    result.count = differenceInMinutes(end, start)
    result.context = 'minutes'
  }

  if (result.count === 0) {
    result.context = 'none'
  }

  return result
}

export const getCourseDurationMessage = (
  courseDuration: TimeDifferenceAndContext,
  t: TFunction
) => {
  const { context, count } = courseDuration

  let courseDurationMessage
  if (context == 'days' && count === 1) {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_days_one'
    )
  } else if (context == 'days') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_days_other',
      { count }
    )
  } else if (context == 'hours' && count === 1) {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_hours_one',
      { count }
    )
  } else if (context == 'hours') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_hours_other',
      { count }
    )
  } else if (context == 'minutes') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_minutes_other',
      { count }
    )
  } else {
    courseDurationMessage = t('pages.course-participants.course-duration_none')
  }
  return courseDurationMessage
}

export const getCourseBeginsForMessage = (course: Course, t: TFunction) => {
  const courseStartDate = new Date(course.schedule[0].start)
  const courseBeginsFor = courseStarted(course)
    ? 0
    : differenceInCalendarDays(new Date(), new Date(courseStartDate))
  let courseBeginsForMessage
  if (courseEnded(course)) {
    courseBeginsForMessage = t('pages.course-participants.course-ended')
  } else if (courseStarted(course)) {
    courseBeginsForMessage = t('pages.course-participants.course-began')
  } else if (courseBeginsFor === 0) {
    courseBeginsForMessage = t('pages.course-participants.course-begins-today')
  } else if (courseBeginsFor === -1) {
    courseBeginsForMessage = t(
      'pages.course-participants.until-course-begins_days_one'
    )
  } else {
    courseBeginsForMessage = t(
      'pages.course-participants.until-course-begins_days_other',
      {
        count: differenceInCalendarDays(
          new Date(course.schedule[0].start),
          now()
        ),
      }
    )
  }
  return courseBeginsForMessage
}

export const getTrainerCarCostPerMile = (miles = 0) => miles * 0.6

export const getTrainerSubsistenceCost = (nights = 0) => nights * 30

export const getVatAmount = (amount = 0) => amount * 0.2

export const roundToTwoDecimals = (value = 0) => Math.round(value * 100) / 100

export const max = (...values: number[] | number[][]) => {
  const data = values.flat()
  return data.reduce((acc, n) => (n > acc ? n : acc), data[0])
}

export const min = (...values: number[] | number[][]) => {
  const data = values.flat()
  return data.reduce((acc, n) => (n < acc ? n : acc), data[0])
}

export const buildNestedSort = (sortBy: string, sortDir: SortOrder) => {
  let orderBy: { [key: string]: object | string } = {}
  sortBy
    .split('.')
    .reverse()
    .forEach((part, index) => {
      if (index === 0) {
        orderBy = { [part]: sortDir as string }
      } else {
        orderBy = { [part]: orderBy }
      }
    })
  return orderBy
}

export const getCourseStatus = (courseData: {
  schedule: { end: Date }[]
  evaluation_answers_aggregate?: {
    aggregate?: { count: number } | null
  }
  status?: Course_Status_Enum | null
  cancellationRequest?: { id: string } | null
  participants: {
    attended?: boolean | null
    healthSafetyConsent: boolean
    grade?: Grade_Enum | null
  }[]
}) => {
  const courseEnded = isPast(new Date(courseData.schedule[0].end))
  const participant = courseData.participants[0]
  const evaluated = Boolean(
    courseData.evaluation_answers_aggregate?.aggregate?.count
  )

  let courseStatus: AllCourseStatuses = Course_Status_Enum.Scheduled
  if (courseData.status === Course_Status_Enum.Cancelled) {
    courseStatus = Course_Status_Enum.Cancelled
  } else if (courseData.cancellationRequest) {
    courseStatus = AdminOnlyCourseStatus.CancellationRequested
  } else {
    if (courseEnded) {
      courseStatus = Course_Status_Enum.Completed
    }
    if (participant) {
      // user participated in the course
      if (!participant.attended && courseEnded) {
        courseStatus = AttendeeOnlyCourseStatus.NotAttended
      } else if (!participant.healthSafetyConsent) {
        courseStatus = AttendeeOnlyCourseStatus.InfoRequired
      } else if (
        courseData.evaluation_answers_aggregate &&
        !evaluated &&
        courseEnded
      ) {
        courseStatus = Course_Status_Enum.EvaluationMissing
      } else if (!participant.grade && courseEnded) {
        courseStatus = Course_Status_Enum.GradeMissing
      }
    }
  }
  return courseStatus
}

export function isNotNullish<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null && arg !== undefined
}
