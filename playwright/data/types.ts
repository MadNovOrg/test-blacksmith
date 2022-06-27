import {
  CourseDeliveryType,
  CourseLevel,
  CourseStatus,
  CourseTrainer,
  CourseType,
  Venue,
} from '@app/types'

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
  id: number
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
  contactProfile?: User
  gradingConfirmed: boolean
  trainers?: CourseTrainer[]
  participants_aggregate?: {
    aggregate?: {
      count: number
    }
  }
}

export type CourseSchedule = {
  start: Date
  end: Date
  venue?: Venue
  virtualLink?: string
}

export type Organization = {
  id?: string
  name: string
}

export type CourseTableRow = {
  Name: string
  Type: string
  Start: string
  End: string
  Status: string
  Venue: string
  'Trainer(s)': string
  'Regist.'?: string
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
