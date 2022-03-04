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
  address: { [key: string]: string }
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
  firstName?: string
  lastName?: string
  bookingDate?: Date
  organization?: Organization
  invoiceID?: string
  registrationId?: string
  organizationId?: string
  course: Course
  contactDetails: Record<string, string>[]
}
