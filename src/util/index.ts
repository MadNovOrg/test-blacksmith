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
  Certificate_Status_Enum,
  InsertOrgLeadMutationVariables,
  Course as GeneratedCourseType,
  Course_Delivery_Type_Enum,
  Resource_Packs_Type_Enum,
  GetResourcePackPricingsQuery,
  Resource_Packs_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { ResourcePacksOptions } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/types'
import { matchResourcePacksCourseFieldsToSelectOption } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/utils'
import { useBildStrategies } from '@app/modules/course/hooks/useBildStrategies'
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
  t: TFunction,
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

export enum Shards {
  ANZ = 'ANZ',
  UK = 'UK',
}

export function getSWRLoadingStatus(
  data?: object,
  error?: Error,
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

export const MCMAmount: Record<Currency, number> = {
  [Currency.Gbp]: 12.5,
  [Currency.Eur]: 15,
  [Currency.Usd]: 16,
  [Currency.Aud]: 20,
  [Currency.Nzd]: 20,
}

export const CurrencySymbol: Record<Currency, string> = {
  [Currency.Gbp]: '£',
  [Currency.Eur]: '€',
  [Currency.Usd]: '$',
  [Currency.Aud]: 'AUD$',
  [Currency.Nzd]: 'NZD$',
}
export const ANZMillageRate: Record<string, number[]> = {
  //Values defined in ticket https://behaviourhub.atlassian.net/browse/TTHP-4533
  [Currency.Aud]: [0.5, 0.25],
  [Currency.Nzd]: [0.55, 0.27],
}

export const VAT = '(+VAT)'
export const GST = '(+GST)'

export const courseStarted = (course: Course | GeneratedCourseType) =>
  isPast(new Date(course.schedule[0]?.start))
export const courseEnded = (course: Course | GeneratedCourseType) =>
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
      new Date(format(endDate, 'yyyy-mm-dd')),
    )
  ) {
    return courseStarted(course)
  }

  return isAfter(new Date(), lastDay)
}

export const getCourseLeadTrainer = find<Course_Trainer>(
  propEq('type', Course_Trainer_Type_Enum.Leader),
)

export const getCourseAssistants = filter<Course_Trainer>(
  propEq('type', Course_Trainer_Type_Enum.Assistant),
)

export const getCourseModerator = find<Course_Trainer>(
  propEq('type', Course_Trainer_Type_Enum.Moderator),
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
  courseModules: NonNullish<Course_Participant_Module>[],
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
  t: TFunction,
  isUKRegion: boolean,
) => {
  const courseLevelLabel = t(`common.course-levels.${courseData.level}`)

  return `${t(
    `common.course-name-prefix-${isUKRegion ? 'UK' : 'ANZ'}`,
  )}: ${courseLevelLabel} ${
    courseData.reaccreditation ? t('common.reaccreditation') : ''
  }`
}

export const generateBildCourseName = (
  allStrategies: ReturnType<typeof useBildStrategies>['strategies'],
  courseData: Pick<Course, 'level' | 'reaccreditation' | 'conversion'> & {
    bildStrategies: Record<BildStrategies, boolean>
  },
  t: TFunction,
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
      strategy =>
        courseData.bildStrategies[strategy as BildStrategies] === true,
    )

    const strategyAbbreviations = chosenStrategies
      .map(strategy => allStrategies.find(s => s.name === strategy)?.shortName)
      .filter(Boolean)
      .join('')

    return `BILD Certified Course: ${strategyAbbreviations}`
  }
}

export const getResourcePackPrice = (
  resourcePackPricing:
    | GetResourcePackPricingsQuery['resource_packs_pricing'][0]
    | undefined,
  currency: Currency | string | null | undefined,
): number => {
  if (!resourcePackPricing) return 0
  const orgPricing = resourcePackPricing.org_resource_packs_pricings?.[0]

  return currency === Currency.Nzd
    ? orgPricing?.NZD_price ?? resourcePackPricing.NZD_price
    : orgPricing?.AUD_price ?? resourcePackPricing.AUD_price
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
  type: Course_Trainer_Type_Enum,
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
  strategies: Record<BildStrategies, boolean>,
) {
  return Object.keys(strategies).filter(
    strategyName => strategies[strategyName as BildStrategies],
  ) as BildStrategies[]
}

export const convertScheduleDateToLocalTime = (
  courseStartDate: string,
  courseEndDate: string,
  timeZone = 'Europe/London',
) => {
  const timeZoneSchedule = {
    start: utcToZonedTime(new Date(courseStartDate), timeZone),
    end: utcToZonedTime(new Date(courseEndDate), timeZone),
  }

  return timeZoneSchedule
}

export const getBookingContact = (
  course: Pick<Course, 'bookingContact' | 'bookingContactInviteData'>,
) => {
  if (course.bookingContact) {
    const { email, givenName, familyName, id, country, countryCode } =
      course.bookingContact

    return {
      email,
      firstName: givenName,
      lastName: familyName,
      profileId: id,
      residingCountry: country,
      residingCountryCode: countryCode,
    }
  }

  if (course.bookingContactInviteData) {
    const { email, firstName, lastName, residingCountry, residingCountryCode } =
      course.bookingContactInviteData
    return {
      email,
      firstName,
      lastName,
      residingCountry,
      residingCountryCode,
    }
  }

  return null
}

export const getOrgKeyContact = (
  course: Pick<
    Course,
    'organizationKeyContact' | 'organizationKeyContactInviteData'
  >,
) => {
  if (course.organizationKeyContact) {
    const { email, givenName, familyName, id, country, countryCode } =
      course.organizationKeyContact

    return {
      email,
      firstName: givenName,
      lastName: familyName,
      profileId: id,
      residingCountry: country,
      residingCountryCode: countryCode,
    }
  }

  if (course.organizationKeyContactInviteData) {
    const { email, firstName, lastName, residingCountry, residingCountryCode } =
      course.organizationKeyContactInviteData
    return {
      email,
      firstName,
      lastName,
      residingCountry,
      residingCountryCode,
    }
  }

  return null
}

export const courseToCourseInput = (course: Course): CourseInput => {
  const timeZoneSchedule = convertScheduleDateToLocalTime(
    course.schedule[0].start,
    course.schedule[0].end,
    course.schedule[0].timeZone,
  )

  return {
    id: course.id,
    type: course.type,
    deliveryType: course.deliveryType,
    organization: course.organization ?? null,
    arloReferenceId: course.arloReferenceId ?? undefined,
    bookingContact: getBookingContact(course),
    organizationKeyContact: getOrgKeyContact(course),
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
              new Date(course.schedule[0].start),
            ) /
            1000 /
            60,
          timeZoneId: course.schedule[0].timeZone,
        }
      : undefined,
    venue: course.schedule[0].venue ?? null,
    minParticipants: course.min_participants,
    maxParticipants: course.max_participants,
    freeCourseMaterials: course.free_course_materials,
    startDateTime: timeZoneSchedule.start,
    startDate: timeZoneSchedule.start,
    startTime: extractTime(timeZoneSchedule.start),
    endDateTime: timeZoneSchedule.end,
    endDate: timeZoneSchedule.end,
    endTime: extractTime(timeZoneSchedule.end),
    courseCost: course.aolCostOfCourse ?? null,
    usesAOL: Boolean(
      course.aolCostOfCourse !== null &&
        course.aolCostOfCourse !== undefined &&
        course.aolCostOfCourse >= 0,
    ),
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
    tenderCourse: Boolean(course.is_tender),
    resourcePacksType: course.resourcePacksType
      ? matchResourcePacksCourseFieldsToSelectOption({
          resourcePacksDeliveryType: course.resourcePacksDeliveryType ?? null,
          resourcePacksType: course.resourcePacksType,
        })
      : undefined,
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
  profileId: string,
): T | undefined => {
  return (trainers ?? []).find(t => t.profile.id === profileId)
}

export async function userExistsInCognito(email: string) {
  return Auth.signIn(email, '123')
    .then(() => true)
    .catch(err => err.code === 'NotAuthorizedException')
}

export const AustraliaCountryCode = 'AU'
export const NewZealandCountryCode = 'NZ'

export const CourseTypeOrgRPPricings = [
  Course_Type_Enum.Closed,
  Course_Type_Enum.Indirect,
]

export const Resource_Pack_Type_By_DeliveryType: Record<
  Course_Delivery_Type_Enum,
  Resource_Packs_Type_Enum
> = {
  [Course_Delivery_Type_Enum.Virtual]: Resource_Packs_Type_Enum.DigitalWorkbook,
  [Course_Delivery_Type_Enum.F2F]: Resource_Packs_Type_Enum.PrintWorkbook,
  [Course_Delivery_Type_Enum.Mixed]: Resource_Packs_Type_Enum.PrintWorkbook,
}

export const Resource_Packs_Type_By_Resource_Pack_Options: Record<
  ResourcePacksOptions,
  Resource_Packs_Type_Enum
> = {
  [ResourcePacksOptions.DigitalWorkbook]:
    Resource_Packs_Type_Enum.DigitalWorkbook,
  [ResourcePacksOptions.PrintWorkbookStandard]:
    Resource_Packs_Type_Enum.PrintWorkbook,
  [ResourcePacksOptions.PrintWorkbookExpress]:
    Resource_Packs_Type_Enum.PrintWorkbook,
}

export const getResourcePacksType = (
  type: Course_Type_Enum,
  deliveryType: Course_Delivery_Type_Enum,
  resourcePacksOptions?: ResourcePacksOptions,
) => {
  return type === Course_Type_Enum.Indirect && resourcePacksOptions
    ? Resource_Packs_Type_By_Resource_Pack_Options[resourcePacksOptions]
    : Resource_Pack_Type_By_DeliveryType[deliveryType]
}

export const Resource_Pack_Delivery_Type: Record<
  ResourcePacksOptions,
  Resource_Packs_Delivery_Type_Enum | null
> = {
  [ResourcePacksOptions.DigitalWorkbook]: null,
  [ResourcePacksOptions.PrintWorkbookStandard]:
    Resource_Packs_Delivery_Type_Enum.Standard,
  [ResourcePacksOptions.PrintWorkbookExpress]:
    Resource_Packs_Delivery_Type_Enum.Express,
}

export function renderOrgAddress(org?: {
  address: {
    line1: string
    line2: string
    city: string
    state: string
    postCode: string
    country: string
    region?: string
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
    org.address.region,
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
  err: Merge<FieldError, (FieldError | undefined)[]>,
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

const getCertificateStatusHierarchy = (): Record<
  Certificate_Status_Enum,
  number
> => {
  const certificateStatusHierarchy: Record<Certificate_Status_Enum, number> = {
    [Certificate_Status_Enum.Active]: 0,
    [Certificate_Status_Enum.OnHold]: 0,
    [Certificate_Status_Enum.ExpiringSoon]: 0,
    [Certificate_Status_Enum.ExpiredRecently]: 0,
    [Certificate_Status_Enum.Expired]: 0,
    [Certificate_Status_Enum.Revoked]: 0,
    [Certificate_Status_Enum.Inactive]: 0,
  }

  Object.keys(certificateStatusHierarchy).forEach((key, index) => {
    certificateStatusHierarchy[key as Certificate_Status_Enum] = index + 1
  })

  return certificateStatusHierarchy
}

const getCertificateLevelHierarchy = () => {
  const certificateLevelHierarchy: Record<Course_Level_Enum, number> = {
    [Course_Level_Enum.BildAdvancedTrainer]: 0,
    [Course_Level_Enum.AdvancedTrainer]: 0,
    [Course_Level_Enum.Advanced]: 0,
    [Course_Level_Enum.BildIntermediateTrainer]: 0,
    [Course_Level_Enum.IntermediateTrainer]: 0,
    [Course_Level_Enum.FoundationTrainerPlus]: 0,
    [Course_Level_Enum.FoundationTrainer]: 0,
    [Course_Level_Enum.BildRegular]: 0,
    [Course_Level_Enum.Level_2]: 0,
    [Course_Level_Enum.Level_1]: 0,
    [Course_Level_Enum.Level_1Bs]: 0,
    [Course_Level_Enum.Level_1Np]: 0,
  }

  Object.keys(certificateLevelHierarchy).forEach((key, index) => {
    certificateLevelHierarchy[key as Course_Level_Enum] = index + 1
  })

  return certificateLevelHierarchy
}

export function getCertificatesChain(
  certificates: {
    id?: string
    level: Course_Level_Enum
    note?: string
    status: Certificate_Status_Enum
  }[],
) {
  const isActiveStatus = (status: Certificate_Status_Enum) =>
    ![
      Certificate_Status_Enum.Expired,
      Certificate_Status_Enum.Inactive,
      Certificate_Status_Enum.Revoked,
    ].includes(status)

  const isTrulyActiveStatus = (status: Certificate_Status_Enum) =>
    [
      Certificate_Status_Enum.Active,
      Certificate_Status_Enum.OnHold,
      Certificate_Status_Enum.ExpiringSoon,
    ].includes(status)

  const filtered = certificates.filter(cert => isActiveStatus(cert.status))

  if (!filtered.length) return []

  const certificateStatusHierarchy = getCertificateStatusHierarchy()
  const hierarchy = getCertificateLevelHierarchy()

  const bestByLevel = new Map<Course_Level_Enum, (typeof certificates)[0]>()
  for (const cert of filtered) {
    const current = bestByLevel.get(cert.level)
    if (
      !current ||
      certificateStatusHierarchy[cert.status] <
        certificateStatusHierarchy[current.status]
    ) {
      bestByLevel.set(cert.level, cert)
    }
  }
  const deduped = Array.from(bestByLevel.values())

  const hasActiveAdvancedTrainer = deduped.some(
    cert =>
      (cert.level === Course_Level_Enum.BildAdvancedTrainer ||
        cert.level === Course_Level_Enum.AdvancedTrainer) &&
      isTrulyActiveStatus(cert.status),
  )

  const sorted = [...deduped].sort((a, b) => {
    const levelDiff = hierarchy[a.level] - hierarchy[b.level]
    if (levelDiff !== 0) return levelDiff
    return (
      certificateStatusHierarchy[a.status] -
      certificateStatusHierarchy[b.status]
    )
  })

  const result: typeof certificates = []

  let advancedCerts: typeof certificates = []
  if (!hasActiveAdvancedTrainer) {
    advancedCerts = sorted.filter(
      cert => cert.level === Course_Level_Enum.Advanced,
    )
  }

  function chainCertificates(sortedCerts: typeof certificates) {
    const chainResult: typeof certificates = []

    const highestTrulyActive = sortedCerts.find(cert =>
      isTrulyActiveStatus(cert.status),
    )

    if (highestTrulyActive) {
      chainResult.push(highestTrulyActive)
    } else {
      const highestExpiredRecently = sortedCerts.find(
        cert => cert.status === Certificate_Status_Enum.ExpiredRecently,
      )

      if (highestExpiredRecently) {
        chainResult.push(highestExpiredRecently)

        const currentLevelHierarchy = hierarchy[highestExpiredRecently.level]
        const nextHigherActive = sortedCerts.find(
          cert =>
            hierarchy[cert.level] < currentLevelHierarchy &&
            isTrulyActiveStatus(cert.status),
        )

        if (nextHigherActive) {
          chainResult.push(nextHigherActive)
        }
      }
    }

    return chainResult
  }

  if (advancedCerts.length > 0) {
    const chainedAdvanced = chainCertificates(advancedCerts)
    result.push(...chainedAdvanced)
  }

  const otherCerts =
    advancedCerts.length > 0
      ? sorted.filter(cert => cert.level !== Course_Level_Enum.Advanced)
      : sorted

  const chainedOthers = chainCertificates(otherCerts)

  chainedOthers.forEach(cert => {
    if (!result.some(r => r.level === cert.level && r.status === cert.status)) {
      result.push(cert)
    }
  })

  return result.sort(
    (a, b) =>
      certificateStatusHierarchy[a.status] -
      certificateStatusHierarchy[b.status],
  )
}

export const getTimeDifferenceAndContext = (
  end: Date,
  start: Date,
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
  t: TFunction,
) => {
  const { context, count } = courseDuration

  let courseDurationMessage
  if (context == 'days' && count === 1) {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_days_one',
    )
  } else if (context == 'days') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_days_other',
      { count },
    )
  } else if (context == 'hours' && count === 1) {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_hours_one',
      { count },
    )
  } else if (context == 'hours') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_hours_other',
      { count },
    )
  } else if (context == 'minutes') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_minutes_other',
      { count },
    )
  } else {
    courseDurationMessage = t('pages.course-participants.course-duration_none')
  }
  return courseDurationMessage
}

export const getCourseBeginsForMessage = (
  course: Course | GeneratedCourseType,
  t: TFunction,
) => {
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
      'pages.course-participants.until-course-begins_days_one',
    )
  } else {
    courseBeginsForMessage = t(
      'pages.course-participants.until-course-begins_days_other',
      {
        count: differenceInCalendarDays(
          new Date(course.schedule[0].start),
          now(),
        ),
      },
    )
  }
  return courseBeginsForMessage
}

export const getTrainerCarCostPerMile = (miles = 0) => miles * 0.6

export const getANZCarCost = (km: number, currency: Currency) => {
  const milageRate = ANZMillageRate[currency]
  const extraKm = km - 200 // First 200 km are taxed more than additional km
  if (extraKm > 0) return 200 * milageRate[0] + extraKm * milageRate[1]
  return km * milageRate[0]
}

export const getMandatoryCourseMaterialsCost = (
  mandatoryCourseMaterials: number,
  currency: Currency,
) => mandatoryCourseMaterials * MCMAmount[currency]

export const getFreeCourseMaterialsCost = (
  freeCourseMaterials: number,
  currency: Currency,
) => freeCourseMaterials * MCMAmount[currency] * -1

export const getTrainerSubsistenceCost = (nights = 0, isUKCountry = true) =>
  isUKCountry ? nights * 30 : 0

export const getVatAmount = (amount = 0) => amount * 0.2
// Equivalent to UK VAT ( GST -> Goods and Service Tax) which is 10%
export const getGSTAmount = (amount = 0) => amount * 0.1

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
    courseData.evaluation_answers_aggregate?.aggregate?.count,
  )

  let courseStatus: AllCourseStatuses = Course_Status_Enum.Scheduled

  if (courseData.status === Course_Status_Enum.Cancelled) {
    return Course_Status_Enum.Cancelled
  }

  if (courseData.cancellationRequest) {
    return AdminOnlyCourseStatus.CancellationRequested
  }

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
  t: TFunction,
) {
  return t('currency', { amount, currency: currency })
}

export const GRACE_PERIOD_PER_LEVEL = {
  [Course_Level_Enum.Level_1]: 0,
  [Course_Level_Enum.Level_2]: 0,
  [Course_Level_Enum.FoundationTrainer]: 3,
  [Course_Level_Enum.FoundationTrainerPlus]: 3,
  [Course_Level_Enum.Advanced]: 0,
  [Course_Level_Enum.BildRegular]: 0,
  [Course_Level_Enum.IntermediateTrainer]: 3,
  [Course_Level_Enum.AdvancedTrainer]: 1,
  [Course_Level_Enum.BildIntermediateTrainer]: 0,
  [Course_Level_Enum.BildAdvancedTrainer]: 0,
  [Course_Level_Enum.Level_1Bs]: 0,
  [Course_Level_Enum.Level_1Np]: 0,
}

export function expiryDateWithGracePeriod(
  level: Course_Level_Enum,
  expiryDate: Date,
) {
  return addMonths(expiryDate, GRACE_PERIOD_PER_LEVEL[level])
}

export const DEFAULT_PAGINATION_LIMIT = 12
export const DEFAULT_PAGINATION_ROW_OPTIONS = [12, 24, 50, 100]

const DEFAULT_TRAINER_CERTIFICATES_FOR_LEVEL = {
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
  [Course_Level_Enum.FoundationTrainer]: [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
  ],
  [Course_Level_Enum.FoundationTrainerPlus]: [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
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
  [Course_Level_Enum.Level_1Bs]: [Course_Level_Enum.FoundationTrainerPlus],
  [Course_Level_Enum.Level_1Np]: [Course_Level_Enum.FoundationTrainer],
  [Course_Level_Enum.Level_2]: [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ],
}

/*
 * Map of required certificate for leading a certain course level.
 * course type -> key -> desired course level
 * value -> array of possible certificates that will meet the requirement
 *
 * Example: For leading Advanced Modules course you have to have either
 *          Advanced Trainer certificate OR BILD Advanced Trainer.
 */
export const REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL = {
  [Course_Type_Enum.Open]: DEFAULT_TRAINER_CERTIFICATES_FOR_LEVEL,
  [Course_Type_Enum.Indirect]: DEFAULT_TRAINER_CERTIFICATES_FOR_LEVEL,
  [Course_Type_Enum.Closed]: DEFAULT_TRAINER_CERTIFICATES_FOR_LEVEL,
}

export const REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL_ANZ = {
  [Course_Type_Enum.Open]: DEFAULT_TRAINER_CERTIFICATES_FOR_LEVEL,
  [Course_Type_Enum.Indirect]: {
    ...DEFAULT_TRAINER_CERTIFICATES_FOR_LEVEL,
    [Course_Level_Enum.Level_1Np]: [Course_Level_Enum.FoundationTrainer],
    [Course_Level_Enum.Level_1]: [
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.IntermediateTrainer,
    ],
    [Course_Level_Enum.Level_2]: [
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.IntermediateTrainer,
    ],
    [Course_Level_Enum.Advanced]: [Course_Level_Enum.AdvancedTrainer],
  },
  [Course_Type_Enum.Closed]: DEFAULT_TRAINER_CERTIFICATES_FOR_LEVEL,
}

export const customFeeFormat = (num: number) => {
  let [integerPart, fractionalPart] = num.toString().split('.')

  if (integerPart.length > 4) integerPart = integerPart.slice(0, 4)
  if (fractionalPart && fractionalPart.length > 2)
    fractionalPart = fractionalPart.slice(0, 2)

  return Number(
    fractionalPart ? integerPart.concat('.', fractionalPart) : integerPart,
  )
}

export const validUserSignature = (
  fullName?: string,
  signature?: string,
): boolean => {
  if (fullName && signature) {
    const splitFullName = fullName
      .split(' ')
      .filter(name => name.length)
      .map(name => name.trim().toLowerCase())
      .join('')

    const splitSignature = signature
      .split(' ')
      .filter(name => name.length)
      .map(name => name.trim().toLowerCase())
      .join('')

    return splitFullName === splitSignature
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

// Used to locally store organization data before account creation
export let organizationData: InsertOrgLeadMutationVariables
export const saveNewOrganizationDataInLocalState = (
  organization: InsertOrgLeadMutationVariables,
) => (organizationData = { ...organization })

export const ALL_ORGS = 'all'
export const MERGE = 'merge'
export const UKTimezone = 'Europe/London'

export const getTruthyObjectProps = <T>(obj: Record<string, unknown>) => {
  const props = new Set<T>()

  Object.keys(obj)
    .filter(key => Boolean(obj[key]))
    .forEach(key => {
      props.add(key as T)
    })

  return props
}

export const hasAtLeastOneItem = (obj: Record<string, unknown[]>): boolean => {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  const values = Object.values(obj)

  return values.some(value => Array.isArray(value) && value.length > 0)
}

export const blendedLearningLicensePrice = {
  AUD: 78,
  NZD: 88,
  GBP: 50,
}

export const getPricePerLicence = ({
  isAustralia,
  residingCountry,
}: {
  isAustralia?: boolean
  residingCountry?: string
}) => {
  if (isAustralia) {
    if (residingCountry && ['NZ'].includes(residingCountry)) {
      return blendedLearningLicensePrice.NZD
    }
    return blendedLearningLicensePrice.AUD
  }
  return blendedLearningLicensePrice.GBP
}

export const PROFILE_TABLE_SX = {
  '&&.MuiTableRow-root': {
    backgroundColor: 'grey.300',
  },
  '&& .MuiTableCell-root': {
    py: 1,
    color: 'grey.700',
    fontWeight: '600',
  },
}

export const PROFILE_TABLE_ROW_SX = {
  '&&.MuiTableRow-root': {
    backgroundColor: 'common.white',
  },
}

export function isDfeUrn(str: string) {
  const trimmed = str.trim()

  const regex = /^\d{6}$/

  return regex.test(trimmed)
}

export function isValidConnectID(str: string) {
  return /^(?:TTID-)?\d{7,}$/i.test(str)
}

export const isFullUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
