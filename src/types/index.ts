import { GraphQLErrorExtensions } from 'graphql'
import { DeepNonNullable } from 'ts-essentials'

import {
  Accreditors_Enum,
  Course_Bild_Module,
  Course_Delivery_Type_Enum,
  Course_Evaluation_Question_Group_Enum,
  Course_Level_Enum,
  CourseLevel as Course_Level,
  Course_Renewal_Cycle_Enum,
  Course_Source_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  GetEvaluationsSummaryQuery,
  Grade_Enum,
  CertificateStatus,
  Course_Exception_Enum,
  Course_Trainer_Type_Enum,
  CourseTrainerType as GeneratedCourseTrainerType,
  FindProfilesQuery,
} from '@app/generated/graphql'
import { TimeZoneDataType } from '@app/hooks/useTimeZones'
import { StepsEnum } from '@app/modules/course/pages/CreateCourse/types'
import { AttendedCourseData } from '@app/pages/Resources/utils'

export type Base = {
  id: string
  createdAt: string
  updatedAt?: string
}

export type Course = {
  // TODO: Delete this after Arlo migration
  arloReferenceId?: string
  id: number
  createdAt: string
  updatedAt?: string
  name: string
  residingCountry: string
  level: Course_Level_Enum
  deliveryType: Course_Delivery_Type_Enum
  type: Course_Type_Enum
  course_code: string
  min_participants: number
  max_participants: number
  free_course_materials?: number
  status: Course_Status_Enum
  reaccreditation: boolean
  organization?: Organization
  bildModules?: Array<Course_Bild_Module>
  bookingContact?: Profile
  bookingContactInviteData?: {
    firstName: string
    lastName: string
    email: string
  }
  bookingContactProfileId?: string
  organizationKeyContact?: Profile
  organizationKeyContactInviteData?: Pick<Profile, 'email'> & {
    firstName: string
    lastName: string
  }
  organizationKeyContactProfileId?: string
  schedule: CourseSchedule[]
  trainers?: CourseTrainer[]
  gradingConfirmed: boolean
  gradingStarted: boolean
  aolCostOfCourse?: number
  aolCountry?: string
  aolRegion?: string
  go1Integration: boolean
  conversion: boolean
  renewalCycle?: Course_Renewal_Cycle_Enum
  dates: {
    aggregate: {
      start: { date: string }
      end: { date: string }
    }
  }
  modulesAgg: {
    aggregate: {
      count: number
    }
  }
  participantsAgg: {
    aggregate: {
      count: number
    }
  }
  moduleGroupIds: {
    module: { moduleGroup: { id: string }; submodule: { id: string } }
  }[]
  certificateCount?: { aggregate: { count: number } }
  participantSubmittedEvaluationCount?: { aggregate: { count: number } }
  description?: string
  freeSpaces?: number
  accountCode?: string
  cancellationRequest?: {
    id: string
    reason: string
  }
  modulesDuration?: number
  special_instructions?: string
  parking_instructions?: string
  accreditedBy: Accreditors_Enum
  displayOnWebsite?: boolean
  price?: number
  priceCurrency?: string
  includeVAT?: boolean
  bildStrategies: Array<{
    strategyName: string
  }>
  orders?: Array<{
    order: {
      id?: string
      xeroInvoiceNumber?: string
      salesRepresentativeId?: string
      salesRepresentative?: Profile
      source?: Course_Source_Enum
    }
  }>
  courseParticipants?: {
    attended?: boolean | null
    grade?: Grade_Enum | null
    healthSafetyConsent: boolean
    order?: {
      bookingContactProfileId?: string | null
    }
  }[]
  curriculum: unknown
  courseExceptions: {
    exception: Course_Exception_Enum
  }[]
} & Omit<Base, 'id'>

export type CourseModule = {
  covered?: boolean
  course: Course
  module: Module
  submodules: Module[]
} & Base

export type CourseCertificate = {
  number: string
  courseId: string
  expiryDate: string
  certificationDate: string
  courseName: string
  courseLevel: Course_Level_Enum
  participant?: CourseParticipant
  profileId: string
  profile: Profile
  status: CertificateStatus
  blendedLearning: boolean
  reaccreditation: boolean
  courseAccreditedBy: Accreditors_Enum
} & Base

export type Address = {
  line1: string
  line2: string
  city: string
  state: string
  postCode: string
  country: string
  countryCode: string
  type: string
} & Base

export type ContactDetail = {
  type: string
  value: string
}

export type Organization = {
  name: string
  tags: string[]
  contactDetails: ContactDetail[]
  members_aggregate: { [key: string]: { [key: string]: number } }
  attributes: { [name: string]: string }
  address: Address
  preferences: { [name: string]: string }
  region: string
  sector: string
  organizationType: string
  go1Licenses?: number
} & Base

export type OrganizationMember = {
  isAdmin: boolean
  position?: string
  profile: Profile
  organization: Organization
} & Base

export type OrganizationInvite = {
  email: string
  status: InviteStatus
  isAdmin: boolean
  organization: {
    id: string
    name: string
  }
  profile?: Profile
} & Base

export type Profile = {
  email: string
  id: string
  givenName: string
  familyName: string
  fullName: string
  phone: string
  phoneCountryCode?: string
  dob: string
  jobTitle: string
  avatar: string
  title: string
  tags: string[] | null
  dietaryRestrictions: string | null
  disabilities: string | null
  addresses: { [key: string]: string }[]
  attributes: string[]
  contactDetails: { [key: string]: string }[]
  preferences: { [key: string]: string }[]
  organizations: Array<{
    isAdmin: boolean
    position?: string
    organization: Organization
  }>
  roles: Array<{ role: Role }> // roles assigned in profile_role
  trainer_role_types: Array<{ trainer_role_type: TrainerRoleType }>
  lastActivity?: Date
  certificates?: Omit<CourseCertificate, 'profile' | 'participant'>[] // circular refs
  courses?: {
    grade?: Grade_Enum | null | undefined
    course:
      | {
          start?: string
          end?: string
          level?: Course_Level_Enum
        }
      | AttendedCourseData
  }[]
  archived?: boolean
  country?: string
  countryCode?: string
} & Base

export type Role = {
  id: string
  name: RoleName
}

export type TrainerRoleType = {
  id: string
  name: TrainerRoleTypeName
}

export enum PaymentMethod {
  CC = 'CC',
  INVOICE = 'INVOICE',
}

export enum RoleName {
  ANONYMOUS = 'anonymous',
  FINANCE = 'finance',
  LD = 'ld',
  SALES_ADMIN = 'sales-admin',
  SALES_REPRESENTATIVE = 'sales-representative',
  TRAINER = 'trainer',
  TT_ADMIN = 'tt-admin',
  TT_OPS = 'tt-ops',
  UNVERIFIED = 'unverified',
  USER = 'user',
  BOOKING_CONTACT = 'booking-contact',
  ORGANIZATION_KEY_CONTACT = 'organization-key-contact',
}

export enum TrainerRoleTypeName {
  PRINCIPAL = 'principal',
  SENIOR = 'senior',
  SENIOR_ASSIST = 'senior-assist',
  EMPLOYER_TRAINER = 'employer-trainer',
  TRAINER_ETA = 'trainer-eta',
  AOL_ETA = 'aol-eta',
  BILD_SENIOR = 'bild-senior',
  EMPLOYER_AOL = 'employer-aol',
  SPECIAL_AGREEMENT_AOL = 'special-agreement-aol',
  MODERATOR = 'moderator',
  ASSISTANT = 'assistant',
}

export enum CourseState {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum CourseLevel {
  Level_1 = 'LEVEL_1',
  Level_2 = 'LEVEL_2',
  Advanced = 'ADVANCED',
  BildRegular = 'BILD_REGULAR',
  IntermediateTrainer = 'INTERMEDIATE_TRAINER',
  AdvancedTrainer = 'ADVANCED_TRAINER',
  BildIntermediateTrainer = 'BILD_INTERMEDIATE_TRAINER',
  BildAdvancedTrainer = 'BILD_ADVANCED_TRAINER',
}

export enum BildStrategies {
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
  NonRestrictiveTertiary = 'NON_RESTRICTIVE_TERTIARY',
  RestrictiveTertiaryIntermediate = 'RESTRICTIVE_TERTIARY_INTERMEDIATE',
  RestrictiveTertiaryAdvanced = 'RESTRICTIVE_TERTIARY_ADVANCED',
}

export type CourseTrainer = {
  id: string
  type: Course_Trainer_Type_Enum | GeneratedCourseTrainerType
  status: InviteStatus
  profile: Profile & {
    levels: {
      courseLevel: Course_Level
      expiryDate: string
    }[]
  }
}

export enum CourseTrainerType {
  Leader = 'LEADER',
  Assistant = 'ASSISTANT',
  Moderator = 'MODERATOR',
}

export enum Color {
  NAVY = 'navy',
  LIME = 'lime',
  TEAL = 'teal',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  FUSCHIA = 'fuschia',
}

export enum OfstedRating {
  GOOD = 'GOOD',
  OUTSTANDING = 'OUTSTANDING',
  REQUIRES_IMPROVEMENT = 'REQUIRES_IMPROVEMENT',
  INADEQUATE = 'INADEQUATE',
  SERIOUS_WEAKNESSES = 'SERIOUS_WEAKNESSES',
  SPECIAL_MEASURES = 'SPECIAL_MEASURES',
  INSUFFICIENT_EVIDENCE = 'INSUFFICIENT_EVIDENCE',
}

export type Module = {
  name: string
  description: string
  level: Course_Level_Enum
  type: string
  moduleGroup: ModuleGroup
  submodules: Array<{
    id: string
    name: string
  }>
} & Base

export type ModuleGroupDuration = {
  courseDeliveryType: Course_Delivery_Type_Enum
  reaccreditation: boolean
  duration: number
} & Base

export type ModuleGroup = {
  name: string
  level: Course_Level_Enum
  mandatory: boolean
  modules: Module[]
  duration: {
    aggregate: {
      sum: {
        duration: number
      }
    }
  }
  color: Color
} & Base

export enum AvailabilityType {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  ANNUAL_LEAVE = 'annual_leave',
  SICK_LEAVE = 'sick_leave',
  COMPASSIONATE_LEAVE = 'compassionate_leave',
}

export type Availability = {
  type: AvailabilityType
  start: Date
  end: Date
  description?: string
} & Base

export type Venue = {
  id: string
  name: string
  addressLineOne: string
  addressLineTwo?: string
  city: string
  postCode: string
  country?: string
  geoCoordinates?: string | null
  googlePlacesId?: string
  countryCode?: string
}

export type TrainerSchedule = {
  id: string
  name: string
  start: string
  end: string
  type: string
  course: Course
  venue: Venue
} & Base

export type CourseSchedule = {
  start: string
  end: string
  course?: Course
  venue?: Venue
  virtualLink?: string
  virtualAccountId?: string
  timeZone?: string
} & Base

export type CourseParticipantModule = {
  id: string
  completed: boolean
  module: Module
}

export type CourseParticipant = {
  bookingDate?: Date
  invoiceID?: string
  registrationId?: string
  course: Course
  order?: Order | null
  profile: Profile
  attended?: boolean
  go1EnrolmentStatus: BlendedLearningStatus
  go1EnrolmentProgress: number | null
  grade?: Grade_Enum
  gradingFeedback?: string
  dateGraded?: string
  gradingModules: CourseParticipantModule[]
  certificate?: CourseCertificate
  certificateChanges?: CourseCertificateChangelog[]
  healthSafetyConsent?: boolean
  completed_evaluation: boolean
} & Base

export enum BlendedLearningStatus {
  'ASSIGNED' = 'ASSIGNED',
  'NOT_STARTED' = 'NOT_STARTED',
  'COMPLETED' = 'COMPLETED',
  'IN_PROGRESS' = 'IN_PROGRESS',
}

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export type CourseInvite = {
  id: string
  email: string
  status: InviteStatus
  createdAt: Date
  note: string
  expiresIn?: Date
}

export type SortOrder = 'asc' | 'desc'

type GqlErrorInit = {
  code?: string
  message?: string
  extensions?: GraphQLErrorExtensions
  cause?: Error
}

export class GqlError extends Error {
  code?: string
  extensions?: GraphQLErrorExtensions

  constructor({ code, message, extensions, cause }: GqlErrorInit = {}) {
    super(message, {
      cause,
    })
    this.code = code
    this.extensions = extensions
  }
}

export type WPBlogPost = {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  featured_media: number
  categories: number[]
}

export type WPCategory = {
  id: number
  name: string
}

export type WPMedia = {
  id: number
  source_url: string
  alt_text: string
}

export type BlogPost = {
  id: number
  title: string
  content: string
  excerpt: string
  date: string
  featured_media?: WPMedia
  category?: WPCategory
}

export enum Grade {
  PASS = 'PASS',
  FAIL = 'FAIL',
  OBSERVE_ONLY = 'OBSERVE_ONLY',
  ASSIST_ONLY = 'ASSIST_ONLY',
}

export type CourseEvaluationAnswer = {
  question_id: string
  notes: string | undefined
  course_evaluation_id: string
  answer: string
}

export enum CourseEvaluationQuestionGroup {
  TRAINING_RATING = 'TRAINING_RATING',
  TRAINING_RELEVANCE = 'TRAINING_RELEVANCE',
  TRAINER_STANDARDS = 'TRAINER_STANDARDS',
  MATERIALS_AND_VENUE = 'MATERIALS_AND_VENUE',
}

export type SetCourseTrainerInput = {
  course_id: number
  profile_id: string
  type: Course_Trainer_Type_Enum | GeneratedCourseTrainerType
  status?: InviteStatus
}

export type SetCourseTrainerVars = {
  courseId: number
  trainers: SetCourseTrainerInput[]
}

export enum SearchTrainerAvailability {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
}

export type SearchTrainer = {
  availability?: SearchTrainerAvailability
  levels: {
    courseLevel: Course_Level_Enum
    expiryDate: string
  }[]
} & Pick<Profile, 'id' | 'fullName' | 'avatar' | 'trainer_role_types'>

export type CourseCertificateChangelog = {
  oldGrade: Grade
  newGrade: Grade
  payload: { note?: string }
  author: Profile
  participant: CourseParticipant
} & Base

export type CourseInput = {
  accountCode: string | null
  accreditedBy: Accreditors_Enum | null
  aolCountry: string | null
  aolRegion: string | null
  arloReferenceId?: string
  bildStrategies: Record<BildStrategies, boolean> | null
  blendedLearning: boolean

  bookingContact: {
    email: string
    firstName: string
    lastName: string
    profileId?: string
  } | null

  conversion: boolean
  courseCost: number | null
  courseLevel: Course_Level_Enum | Course_Level | ''
  deliveryType: Course_Delivery_Type_Enum
  displayOnWebsite?: boolean
  endDate: Date | null
  endDateTime: Date | null
  endTime: string
  freeSpaces: number | null
  gradingConfirmed?: boolean | null
  id: number
  includeVAT?: boolean | null
  maxParticipants: number | null
  minParticipants: number | null
  organization: Organization | null
  freeCourseMaterials?: number | null

  organizationKeyContact: {
    email: string
    firstName: string
    lastName: string
    profileId?: string
  } | null

  parkingInstructions: string
  price: number | null | undefined
  priceCurrency?: string
  reaccreditation: boolean
  renewalCycle?: Course_Renewal_Cycle_Enum
  residingCountry?: string
  salesRepresentative: Profile | null | FindProfilesQuery['profiles'][0]
  source: Course_Source_Enum | ''
  specialInstructions: string
  startDate: Date | null
  startDateTime: Date | null
  startTime: string
  timeZone?: TimeZoneDataType
  type: Course_Type_Enum | null
  usesAOL: boolean
  venue: Venue | null
  zoomMeetingUrl: string | null
  zoomProfileId: string | null
}

export type ValidCourseInput = DeepNonNullable<
  Omit<CourseInput, 'courseLevel' | 'source'> & {
    courseLevel: Course_Level_Enum
    source: Course_Source_Enum
  }
>

export type Order = {
  id: string
  createdAt: Date
  courseId: number
  profileId: string
  quantity: number
  registrants: string[]
  paymentMethod: PaymentMethod
  orderTotal: number
  orderDue: number
  currency: Currency | null
  stripePaymentId: string | null
  xeroInvoiceNumber: string | null
  course: Partial<Course>
  organization: Partial<Organization>
  promoCodes?: string[]
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  DELETED = 'DELETED',
  AUTHORISED = 'AUTHORISED',
  PAID = 'PAID',
  VOIDED = 'VOIDED',
}

export enum Currency {
  GBP = 'GBP',
}

export type LegacyCertificate = {
  originalRecord: never
  number: string
  courseName: string
  legacyId: number
  email: string
  firstName: string
  lastName: string
  expiryDate: Date
  certificationDate: Date
} & Base

export type CourseEvaluationGroupedQuestion = Record<
  Course_Evaluation_Question_Group_Enum,
  Record<string, GetEvaluationsSummaryQuery['answers']>
>

export type CourseEvaluationUngroupedQuestion = Record<
  string,
  GetEvaluationsSummaryQuery['answers']
>

export type CourseEvaluationInjuryQuestion = {
  yes: number
  no: number
}

export enum PromoCodeStatus {
  ACTIVE = 'ACTIVE',
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
  DENIED = 'DENIED',
  DISABLED = 'DISABLED',
}

export enum AttendeeOnlyCourseStatus {
  InfoRequired = 'INFO_REQUIRED',
  NotAttended = 'NOT_ATTENDED',
  AwaitingGrade = 'AWAITING_GRADE',
}

export enum AdminOnlyCourseStatus {
  CancellationRequested = 'CANCELLATION_REQUESTED',
}

export type TrainerInput = {
  profile_id: string
  type: Course_Trainer_Type_Enum
  fullName?: string
  status?: InviteStatus
  trainer_role_types: { trainer_role_type?: { name?: string } | null }[]
  levels: {
    courseLevel: Course_Level
    expiryDate: string
  }[]
}

export enum TransportMethod {
  CAR = 'CAR',
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FLIGHTS = 'FLIGHTS',
  NONE = 'NONE',
}

export type ExpensesInput = {
  transport: Array<{
    method: TransportMethod
    value?: number
    flightDays?: number
    accommodationRequired?: boolean
    accommodationNights?: number
    accommodationCost?: number
  }>
  miscellaneous?: Array<
    | {
        name: null
        value: null
      }
    | {
        name: string
        value: number
      }
  >
}

export type ElementProps<T> = {
  [prop in keyof T]?: T[prop]
}

export type Establishment = {
  id: string
  urn: string
  name: string
  localAuthority?: string
  addressLineOne?: string
  addressLineTwo?: string
  addressLineThree?: string
  town?: string
  county?: string
  postcode?: string
  headTitle?: string
  headFirstName?: string
  headLastName?: string
  headJobTitle?: string
  ofstedRating?: string
  ofstedLastInspection?: string
}

export type TimeDifferenceAndContext = {
  count: number
  context: 'days' | 'hours' | 'minutes' | 'none'
}

export enum CourseExpenseType {
  Transport = 'TRANSPORT',
  Miscellaneous = 'MISCELLANEOUS',
  Accommodation = 'ACCOMMODATION',
  Materials = 'MATERIALS',
}

export type CourseExpenseData =
  | {
      type: CourseExpenseType.Transport
      method: TransportMethod.NONE
    }
  | {
      type: CourseExpenseType.Transport
      method: TransportMethod.CAR
      mileage: number
    }
  | {
      type: CourseExpenseType.Transport
      method: TransportMethod.PUBLIC | TransportMethod.PRIVATE
      cost: number
    }
  | {
      type: CourseExpenseType.Transport
      method: TransportMethod.FLIGHTS
      cost: number
      flightDays: number
    }
  | {
      type: CourseExpenseType.Miscellaneous
      description: string
      cost: number
    }
  | {
      type: CourseExpenseType.Accommodation
      accommodationNights: number
      accommodationCost: number
    }
  | {
      type: CourseExpenseType.Materials
      cost: number
    }

export type Go1LicensingPrices = {
  subtotal: number
  vat: number
  amountDue: number
  allowancePrice: number
}

export type InvoiceDetails = {
  orgId: string
  orgName: string
  billingAddress: string
  firstName: string
  surname: string
  email: string
  phone: string
  purchaseOrder: string
}

export type Draft = {
  courseData?: ValidCourseInput
  trainers?: TrainerInput[]
  expenses?: Record<string, ExpensesInput>
  completedSteps?: StepsEnum[]
  currentStepKey?: StepsEnum | null
  savedAt?: Date
  go1Licensing?: {
    prices: Go1LicensingPrices
    invoiceDetails: InvoiceDetails
  }
  invoiceDetails?: InvoiceDetails
}

export type AllCourseStatuses =
  | Course_Status_Enum
  | AttendeeOnlyCourseStatus
  | AdminOnlyCourseStatus

export type NonNullish<T> = Exclude<T, undefined | null>

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: <T>(callback: () => Promise<T>) => void
        render: (
          id: string,
          options: {
            sitekey: string
            callback: (token: string) => unknown
            'expired-callback'?: () => void
            'error-callback'?: () => void
            action: string
          },
        ) => number
      }
    }
  }
}

export type BILDModule = {
  name: string
  mandatory?: boolean
  duration?: number
}

export type BILDModuleGroup = {
  name: string
  duration?: number
  modules: BILDModule[]
}

export type Strategy = {
  modules?: BILDModule[]
  groups?: BILDModuleGroup[]
}
