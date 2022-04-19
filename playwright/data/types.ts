import {
  CourseDeliveryType,
  CourseLevel,
  CourseStatus,
  CourseType,
} from '../../src/types'

export type User = {
  givenName: string
  familyName: string
  email: string
  password: string
  organization?: Organization
}

export type Email = {
  from: string
  subject: string
  html: string
}

export type Course = {
  id?: number
  name: string
  description: string
  organization?: Organization
  level: CourseLevel
  deliveryType: CourseDeliveryType
  type: CourseType
  status: CourseStatus
  reaccreditation: boolean
  schedule: CourseSchedule[]
  go1Integration?: boolean
  min_participants: number
  max_participants: number
}

export type CourseSchedule = {
  name: string
  type: string
  start: Date
  end: Date
  venue?: string
}

export type Organization = {
  id?: string
  name: string
}

export type CourseTableRow = {
  'Course Name': string
  Organization: string
  'Course Type': string
  Start: string
  End: string
  Status: string
  '': string
}

export type ModuleGroup = {
  id?: string
  name: string
  duration: string
}

export type AttendeesTableRow = {
  Name: string
  Contact: string
  Organisation: string
  Documents: string
}
