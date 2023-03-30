import { Course_Source_Enum, Course_Status_Enum } from '@app/generated/graphql'
import {
  CourseDeliveryType,
  CourseLevel,
  CourseTrainer,
  CourseType,
  PaymentMethod,
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
  cancellationRequest?: {
    id: string
    reason: string
  }
  course_code?: string
  description: string
  organization?: Organization
  level: CourseLevel
  deliveryType: CourseDeliveryType
  type: CourseType
  status: Course_Status_Enum
  reaccreditation: boolean
  schedule: CourseSchedule[]
  go1Integration?: boolean
  min_participants: number
  max_participants: number
  freeSpaces?: number
  contactProfile?: User
  gradingConfirmed: boolean
  salesRepresentative?: User
  source?: Course_Source_Enum
  trainers?: CourseTrainer[]
  invoiceDetails?: InvoiceDetails
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
  'Startsorted descending': string
  End: string
  Status: string
  Venue: string
  'Trainer(s)': string
  Registrations?: string
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

export type InvoiceDetails = {
  organisation: string
  firstName: string
  lastName: string
  email: string
  phone: string
  purchaseOrder?: string
}

export type OrderCreation = {
  billingAddress: string
  billingEmail: string
  billingFamilyName: string
  billingGivenName: string
  billingPhone: string
  clientPurchaseOrder?: string
  courseId: number
  organizationId: string
  paymentMethod: PaymentMethod
  promoCodes?: string[]
  quantity: number
  registrants: string[]
  user?: string[]
  profileId: string
}
