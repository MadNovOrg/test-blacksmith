type Base = {
  id: string
  createdAt: string
  updatedAt: string
}

export type Course = {
  name: string
  date: Date
  orgName: string
  color: string
} & Base

export type CourseModule = {
  name: string
  description: string
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
  durations?: ModuleGroupDuration[]
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
  address: string[]
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
