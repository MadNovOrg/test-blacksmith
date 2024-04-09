import { Auth } from 'aws-amplify'
import {
  addMonths,
  differenceInCalendarDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  formatDistanceToNow,
  isAfter,
  isEqual,
  isPast,
  parse,
} from 'date-fns'
import { getTimezoneOffset, utcToZonedTime } from 'date-fns-tz'
import { TFunction } from 'i18next'
import { find, prop, propEq, map, pipe, filter } from 'lodash/fp'
import { FieldError, Merge } from 'react-hook-form'

import {
  Course_Participant,
  Course_Participant_Module,
  Course_Status_Enum,
  Course_Level_Enum,
  Currency,
  Grade_Enum,
  Profile,
  Xero_Invoice_Status_Enum,
  Course_Trainer,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  Submodule,
  Submodule_Aggregate,
  CertificateStatus,
  CourseLevel,
} from '@app/generated/graphql'
import { useBildStrategies } from '@app/hooks/useBildStrategies'
import {
  Address,
  AdminOnlyCourseStatus,
  AllCourseStatuses,
  AttendeeOnlyCourseStatus,
  BildStrategies,
  Course,
  CourseInput,
  CourseParticipant,
  NonNullish,
  Organization,
  SearchTrainer,
  SetCourseTrainerInput,
  SortOrder,
  TimeDifferenceAndContext,
  TrainerRoleTypeName,
  TrainerRoleType,
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

export const asyncNoop = async () => {
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
  isPast(new Date(course.schedule[0]?.start))
export const courseEnded = (course: Course) =>
  isPast(new Date(course.schedule[0]?.end))

export const isLastCourseDay = (course: Course): boolean => {
  const startDate = new Date(course.schedule[0].start)
  const endDate = new Date(course.schedule[0].end)

  const lastDay = new Date(endDate)

  lastDay.setHours(8)
  lastDay.setMinutes(0)
  lastDay.setSeconds(0)
  lastDay.setMilliseconds(0)

  if (
    isEqual(
      new Date(format(startDate, 'yyyy-mm-dd')),
      new Date(format(endDate, 'yyyy-mm-dd'))
    )
  ) {
    return courseStarted(course)
  }

  return isAfter(new Date(), lastDay)
}

export const getCourseLeadTrainer = find<Course_Trainer>(
  propEq('type', Course_Trainer_Type_Enum.Leader)
)

export const getCourseAssistants = filter<Course_Trainer>(
  propEq('type', Course_Trainer_Type_Enum.Assistant)
)

export const getCourseModerator = find<Course_Trainer>(
  propEq('type', Course_Trainer_Type_Enum.Moderator)
)

export const getParticipantOrgIds = pipe<
  /**
   * TODO Remove CourseParticipant after refactor
   * @see https://behaviourhub.atlassian.net/browse/TTHP-2215
   */
  [Course_Participant | CourseParticipant | Pick<CourseParticipant, 'profile'>],
  Organization[],
  string[]
>(prop('profile.organizations'), map(prop('organization.id')))

export const transformModulesToGroups = (
  courseModules: NonNullish<Course_Participant_Module>[]
): Array<{
  id: string
  name: string
  modules: Array<{
    id: string
    name: string
    completed: boolean
    submodules: Submodule[]
    submodules_aggregate: Submodule_Aggregate
  }>
}> => {
  const groups: Record<
    string,
    {
      id: string
      name: string
      modules: Array<{
        id: string
        name: string
        completed: boolean
        submodules: Submodule[]
        submodules_aggregate: Submodule_Aggregate
      }>
    }
  > = {}

  courseModules.forEach(courseModule => {
    if (!courseModule.module.moduleGroup) return
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
      submodules: courseModule.module.submodules,
      submodules_aggregate: courseModule.module.submodules_aggregate,
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

export const generateBildCourseName = (
  allStrategies: ReturnType<typeof useBildStrategies>['strategies'],
  courseData: Pick<Course, 'level' | 'reaccreditation' | 'conversion'> & {
    bildStrategies: Record<BildStrategies, boolean>
  },
  t: TFunction
) => {
  if (
    courseData.level === Course_Level_Enum.BildIntermediateTrainer ||
    courseData.level === Course_Level_Enum.BildAdvancedTrainer
  ) {
    const bildTrainerCourseName = t(`common.course-levels.${courseData.level}`)
    let suffix = ''

    if (courseData.reaccreditation) {
      suffix = t('common.reaccreditation')
    } else if (courseData.conversion) {
      suffix = t('common.conversion')
    }

    return `${bildTrainerCourseName} ${suffix}`.trim()
  } else {
    const chosenStrategies = Object.keys(courseData.bildStrategies).filter(
      strategy => courseData.bildStrategies[strategy as BildStrategies] === true
    )

    const strategyAbbreviations = chosenStrategies
      .map(strategy => allStrategies.find(s => s.name === strategy)?.shortName)
      .filter(Boolean)
      .join('')

    return `BILD Certified Course: ${strategyAbbreviations}`
  }
}

export const COURSE_TYPE_TO_PREFIX = {
  [Course_Type_Enum.Open]: 'OP',
  [Course_Type_Enum.Closed]: 'CL',
  [Course_Type_Enum.Indirect]: 'INDR',
}

export const requiredMsg = (t: TFunction, name: string) => {
  return t('validation-errors.required-field', { name: t(name) })
}

export const profileToInput = (
  course: Course,
  type: Course_Trainer_Type_Enum
) => {
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

export function bildStrategiesToRecord(strategies: Course['bildStrategies']) {
  const bildStrategies: Record<string, boolean> = {}

  strategies.forEach(strategy => {
    bildStrategies[strategy.strategyName] = true
  })

  return bildStrategies
}

export function bildStrategiesToArray(
  strategies: Record<BildStrategies, boolean>
) {
  return Object.keys(strategies).filter(
    strategyName => strategies[strategyName as BildStrategies]
  ) as BildStrategies[]
}

export const convertScheduleDateToLocalTime = (
  courseStartDate: string,
  courseEndDate: string,
  timeZone = 'Europe/London'
) => {
  const timeZoneSchedule = {
    start: utcToZonedTime(new Date(courseStartDate), timeZone),
    end: utcToZonedTime(new Date(courseEndDate), timeZone),
  }

  return timeZoneSchedule
}

export const courseToCourseInput = (course: Course): CourseInput => {
  const timeZoneSchedule = convertScheduleDateToLocalTime(
    course.schedule[0].start,
    course.schedule[0].end,
    course.schedule[0].timeZone
  )

  return {
    id: course.id,
    type: course.type,
    deliveryType: course.deliveryType,
    organization: course.organization ?? null,
    arloReferenceId: course.arloReferenceId ?? undefined,
    bookingContact: course.bookingContact
      ? {
          profileId: course.bookingContact.id,
          firstName: course.bookingContact.givenName,
          lastName: course.bookingContact.familyName,
          email: course.bookingContact.email,
        }
      : course.bookingContactInviteData
      ? {
          firstName: course.bookingContactInviteData.firstName,
          lastName: course.bookingContactInviteData.lastName,
          email: course.bookingContactInviteData.email,
        }
      : null,
    organizationKeyContact: course.organizationKeyContact
      ? {
          profileId: course.organizationKeyContact.id,
          firstName: course.organizationKeyContact?.givenName,
          lastName: course.organizationKeyContact?.familyName,
          email: course.organizationKeyContact?.email,
        }
      : course?.organizationKeyContactInviteData
      ? {
          firstName: course.organizationKeyContactInviteData?.firstName,
          lastName: course.organizationKeyContactInviteData?.lastName,
          email: course.organizationKeyContactInviteData?.email,
        }
      : null,
    blendedLearning: course.go1Integration,
    reaccreditation: course.reaccreditation,
    courseLevel: course.level,
    zoomMeetingUrl: course.schedule[0].virtualLink ?? null,
    zoomProfileId: course.schedule[0].virtualAccountId ?? null,
    timeZone: course.schedule[0].timeZone
      ? {
          rawOffset:
            getTimezoneOffset(
              course.schedule[0].timeZone,
              new Date(course.schedule[0].start)
            ) /
            1000 /
            60,
          timeZoneId: course.schedule[0].timeZone,
        }
      : undefined,
    venue: course.schedule[0].venue ?? null,
    minParticipants: course.min_participants,
    maxParticipants: course.max_participants,
    startDateTime: timeZoneSchedule.start,
    startDate: timeZoneSchedule.start,
    startTime: extractTime(timeZoneSchedule.start),
    endDateTime: timeZoneSchedule.end,
    endDate: timeZoneSchedule.end,
    endTime: extractTime(timeZoneSchedule.end),
    courseCost: course.aolCostOfCourse ?? null,
    usesAOL: Boolean(course.aolCostOfCourse),
    aolCountry: course.aolCountry ?? null,
    aolRegion: course.aolRegion ?? null,
    freeSpaces: course.freeSpaces ?? null,
    accountCode: course.accountCode ?? null,
    specialInstructions: course.special_instructions ?? '',
    parkingInstructions: course.parking_instructions ?? '',
    salesRepresentative: course.orders?.[0]?.order.salesRepresentative ?? null,
    source: course.orders?.[0]?.order.source ?? '',
    bildStrategies: bildStrategiesToRecord(course.bildStrategies),
    accreditedBy: course.accreditedBy,
    conversion: course.conversion,
    price: course.price ?? null,
    priceCurrency: course.priceCurrency,
    includeVAT: course.includeVAT,
    displayOnWebsite: course.displayOnWebsite,
    renewalCycle: course.renewalCycle,
    residingCountry: course.residingCountry,
  }
}

export const normalizeAddr = (addr: Address | undefined) => {
  if (!addr) return null

  return [addr.line1, addr.line2, addr.city, addr.country, addr.postCode]
}

export const isValidUKPostalCode = (postcode: string) => {
  const regex =
    /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[ 0-9]{4}$/
  return regex.test(postcode)
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
  Xero_Invoice_Status_Enum,
  'success' | 'default' | 'error' | 'warning'
> = {
  [Xero_Invoice_Status_Enum.Authorised]: 'warning',
  [Xero_Invoice_Status_Enum.Deleted]: 'default',
  [Xero_Invoice_Status_Enum.Draft]: 'default',
  [Xero_Invoice_Status_Enum.Overdue]: 'error',
  [Xero_Invoice_Status_Enum.Paid]: 'success',
  [Xero_Invoice_Status_Enum.Submitted]: 'warning',
  [Xero_Invoice_Status_Enum.Voided]: 'default',
}

// more on this logic [here](https://github.com/TeamTeach/hub/wiki/Organisations)
export function getProfileCertificationLevels(
  certificates: { courseLevel: string; status: CertificateStatus }[]
): (Course_Level_Enum | CourseLevel | null)[] {
  const levels = []

  const advancedTrainer = certificates?.find(
    c => c.courseLevel === Course_Level_Enum.AdvancedTrainer
  )
  if (advancedTrainer) {
    levels.push(Course_Level_Enum.AdvancedTrainer)
    if (advancedTrainer.status !== CertificateStatus.ExpiredRecently) {
      return levels
    }
  }

  if (certificates?.find(c => c.courseLevel === Course_Level_Enum.Advanced)) {
    levels.push(Course_Level_Enum.Advanced)
  }

  // There is no specification on how the rule should be for BILD.
  //So here is just a logic to show the higher one treating BILD as separate certification
  if (
    certificates?.find(
      c => c.courseLevel === Course_Level_Enum.BildAdvancedTrainer
    )
  ) {
    levels.push(Course_Level_Enum.BildAdvancedTrainer)
  } else {
    const bildHierarchy = [
      Course_Level_Enum.BildIntermediateTrainer,
      Course_Level_Enum.BildRegular,
    ]

    for (const level of bildHierarchy) {
      const certificate = certificates?.find(c => c.courseLevel === level)
      if (certificate) {
        levels.push(level)
        if (certificate.status !== CertificateStatus.ExpiredRecently) {
          break
        }
      }
    }
  }

  const hierarchy = [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.Level_2,
    Course_Level_Enum.Level_1,
  ]
  for (const level of hierarchy) {
    const certificate = certificates?.find(c => c.courseLevel === level)
    if (certificate) {
      levels.push(level)
      if (certificate.status !== CertificateStatus.ExpiredRecently) {
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

export const getTrainerSubsistenceCost = (nights = 0, isUKCountry = true) =>
  isUKCountry ? nights * 30 : 0

export const getVatAmount = (amount = 0) => amount * 0.2

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

export function formatCurrency(
  {
    amount,
    currency = Currency.Gbp,
  }: {
    amount: number
    currency?: Currency | string
  },
  t: TFunction
) {
  return t('currency', { amount, currency: currency })
}

export const GRACE_PERIOD_PER_LEVEL = {
  [Course_Level_Enum.Level_1]: 0,
  [Course_Level_Enum.Level_2]: 0,
  [Course_Level_Enum.ThreeDaySafetyResponseTrainer]: 3,
  [Course_Level_Enum.Advanced]: 0,
  [Course_Level_Enum.BildRegular]: 0,
  [Course_Level_Enum.IntermediateTrainer]: 3,
  [Course_Level_Enum.AdvancedTrainer]: 1,
  [Course_Level_Enum.BildIntermediateTrainer]: 0,
  [Course_Level_Enum.BildAdvancedTrainer]: 0,
  [Course_Level_Enum.Level_1Mva]: 0,
}

export function expiryDateWithGracePeriod(
  level: Course_Level_Enum,
  expiryDate: Date
) {
  return addMonths(expiryDate, GRACE_PERIOD_PER_LEVEL[level])
}

export const DEFAULT_PAGINATION_LIMIT = 12
export const DEFAULT_PAGINATION_ROW_OPTIONS = [12, 24, 50, 100]

/*
 * Map of required certificate for leading a certain course level.
 * key -> desired course level
 * value -> array of possible certificates that will meet the requirement
 *
 * Example: For leading Advanced Modules course you have to have either
 *          Advanced Trainer certificate OR BILD Advanced Trainer.
 */
export const REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL = {
  [Course_Level_Enum.Advanced]: [
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.AdvancedTrainer]: [
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.BildAdvancedTrainer]: [
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.BildIntermediateTrainer]: [
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.BildRegular]: [
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.IntermediateTrainer]: [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.Level_1]: [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.Level_1Mva]: [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.Level_2]: [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
  [Course_Level_Enum.ThreeDaySafetyResponseTrainer]: [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
  ],
}

export const customFeeFormat = (num: number) => {
  let [integerPart, fractionalPart] = num.toString().split('.')

  if (integerPart.length > 4) integerPart = integerPart.slice(0, 4)
  if (fractionalPart && fractionalPart.length > 2)
    fractionalPart = fractionalPart.slice(0, 2)

  return Number(
    fractionalPart ? integerPart.concat('.', fractionalPart) : integerPart
  )
}

export const validUserSignature = (
  fullName?: string,
  signature?: string
): boolean => {
  if (fullName && signature) {
    const splitFullName = fullName
      .split(' ')
      .filter(name => name.length)
      .map(name => name.trim().toLowerCase())

    const splitSignature = signature
      .split(' ')
      .filter(name => name.length)
      .map(name => name.trim().toLowerCase())

    if (splitFullName.length !== splitSignature.length) return false

    return JSON.stringify(splitFullName) === JSON.stringify(splitSignature)
  }

  return false
}

export function checkIsETA(trainer_role_types: TrainerRoleType[]) {
  return (
    trainer_role_types.some(t => t.name === TrainerRoleTypeName.TRAINER_ETA) ??
    false
  )
}

export function checkIsEmployerAOL(trainer_role_types: TrainerRoleType[]) {
  return (
    trainer_role_types.some(t => t.name === TrainerRoleTypeName.EMPLOYER_AOL) ??
    false
  )
}

export const ALL_ORGS = 'all'
export const UKTimezone = 'Europe/London'
