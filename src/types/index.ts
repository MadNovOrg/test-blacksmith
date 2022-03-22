type Base = {
  id: string
  createdAt: string
  updatedAt?: string
}

export type Course = {
  name: string
  level: CourseLevel
  deliveryType: CourseDeliveryType
  type: CourseType
  min_participants: number
  max_participants: number
  status: CourseStatus
  reaccreditation: boolean
  organization: Organization
  schedule: CourseSchedule[]
  trainer?: Profile
  gradingConfirmed: boolean
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
  moduleGroupIds: { module: { moduleGroup: { id: string } } }[]
} & Base

export type CourseModule = {
  covered?: boolean
  course: Course
  module: Module
} & Base

export type Address = {
  line1: string
  line2: string
  city: string
  state: string
  postCode: string
  country: string
  type: string
} & Base

export type ContactDetail = {
  type: string
  value: string
}

export type Organization = {
  name: string
  tags: string[]
  status: string
  contactDetails: ContactDetail[]
  members_aggregate: { [key: string]: { [key: string]: number } }
  attributes: { [name: string]: string }
  addresses: Address[]
  preferences: { [name: string]: string }
} & Base

export type Profile = {
  givenName: string
  familyName: string
  title: string
  tags: string[] | null
  status: string
  addresses: { [key: string]: string }[]
  attributes: string[]
  contactDetails: { [key: string]: string }[]
  preferences: { [key: string]: string }[]
  organizations: Array<{ organization: Organization }>
  roles: Array<{ role: Role }>
  email: string
} & Base

export type Role = {
  name: string
}

export enum RoleName {
  ADMIN = 'admin',
  ORG_ADMIN = 'org-admin',
  TT_OPS = 'tt-ops',
  TRAINER = 'trainer',
  USER = 'user',
}

export enum CourseType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  INDIRECT = 'INDIRECT',
}

export enum CourseStatus {
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum CourseLevel {
  LEVEL_1 = 'LEVEL_1',
  LEVEL_2 = 'LEVEL_2',
  ADVANCED = 'ADVANCED',
  INTERMEDIATE = 'INTERMEDIATE',
}

export enum CourseDeliveryType {
  F2F = 'F2F',
  BLENDED = 'BLENDED',
  VIRTUAL = 'VIRTUAL',
}

export enum Color {
  NAVY = 'navy',
  LIME = 'lime',
  TEAL = 'teal',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  FUSCHIA = 'fuschia',
}

export type Module = {
  name: string
  description: string
  level: CourseLevel
  type: string
  moduleGroup: ModuleGroup
} & Base

export type ModuleGroupDuration = {
  courseDeliveryType: CourseDeliveryType
  reaccreditation: boolean
  duration: number
} & Base

export type ModuleGroup = {
  name: string
  level: CourseLevel
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
  address: {
    addressLineOne: string
    addressLineTwo: string
    city: string
    country: string
  }
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
  name: string
  type: string
  start: Date
  end: Date
  course?: Course
  venue: Venue
} & Base

export enum Grade {
  PASS = 'PASS',
  OBSERVE_ONLY = 'OBSERVE_ONLY',
  FAIL = 'FAIL',
}

export type CourseParticipantGrading = {
  grade: Grade
  feedback: string
} & Base

export type CourseParticipant = {
  bookingDate?: Date
  invoiceID?: string
  registrationId?: string
  course: Course
  profile: Profile
  attended?: boolean
  go1EnrolmentStatus: BlendedLearningStatus
  gradings: CourseParticipantGrading[]
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
}

export type SortOrder = 'asc' | 'desc'

export type GqlError = {
  code: string
  message: string
}

export type BlogPost = {
  id: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
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

export enum CourseEvaluationQuestionType {
  BOOLEAN = 'BOOLEAN',
  TEXT = 'TEXT',
  RATING = 'RATING',
  BOOLEAN_REASON_Y = 'BOOLEAN_REASON_Y',
  BOOLEAN_REASON_N = 'BOOLEAN_REASON_N',
}

export type CourseEvaluationQuestion = {
  id: string
  type: CourseEvaluationQuestionType
  questionKey: string
  group: CourseEvaluationQuestionGroup
  displayOrder: number
  required: number
}
