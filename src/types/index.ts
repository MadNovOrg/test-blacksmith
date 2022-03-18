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
  email: string
} & Base

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

export type CourseParticipant = {
  id: string
  bookingDate?: Date
  invoiceID?: string
  registrationId?: string
  course: Course
  profile: Profile
  attended?: boolean
  go1EnrolmentStatus: BlendedLearningStatus
}

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
