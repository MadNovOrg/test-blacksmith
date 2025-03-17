import {
  Course_Source_Enum,
  Course_Status_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { CourseTrainer, PaymentMethod, Venue } from '@app/types'

import {
  Accreditors_Enum,
  Course_Renewal_Cycle_Enum,
} from '@qa/generated/graphql'

export type User = {
  id?: string
  email: string
  evaluationSubmitted?: boolean
  familyName: string
  givenName: string
  healthSafetyConsent?: boolean
  organization?: Organization
  password: string
  country: string
  countryCode: string
  job_title: string
}

export type Email = {
  from: string
  subject: string
  html: string
}

export type Course = {
  accreditedBy: Accreditors_Enum
  assistTrainer?: User
  bookingContactProfile?: User
  organizationKeyContactProfile?: User
  cancellationRequest?: { id: string; reason: string }
  course_code?: string
  createdAt?: Date
  curriculum?: unknown
  dates?: { aggregate: { start: { date: Date }; end: { date: Date } } }
  deliveryType: Course_Delivery_Type_Enum
  description: string
  freeSpaces?: number
  go1Integration?: boolean
  gradingConfirmed: boolean
  id: number
  invoiceDetails?: InvoiceDetails
  level: Course_Level_Enum
  max_participants: number
  min_participants: number
  freeCourseMaterials?: number
  moderator?: User
  name: string
  orders?: unknown
  organization?: Organization
  participants_aggregate?: { aggregate?: { count: number } }
  price?: number
  priceCurrency?: string
  reaccreditation: boolean
  salesRepresentative?: User
  schedule: CourseSchedule[]
  source?: Course_Source_Enum
  status: Course_Status_Enum
  trainers?: CourseTrainer[]
  type: Course_Type_Enum
  renewalCycle?: Course_Renewal_Cycle_Enum
  conversion?: boolean
}

export type CourseSchedule = {
  start: Date
  end: Date
  venue?: Venue
  virtualLink?: string
}

export type OrganisationAddress = {
  line1: string
  line2?: string
  city: string
  postCode: string
  region?: string
  country: string
  countryCode: string
}

export type OrganisationDetails = {
  name: string
  sector: string
  type: string
  phone: string
  email: string
  website?: string
}

export type OrganisationAdditionalDetails = {
  headFirstName?: string
  headSurname?: string
  headEmail?: string
  settingName?: string
}

export type Organization = {
  name: string
  address?: {
    line1: string
    line2: string
    city: string
    state: string
    postCode: string
    country: string
  }
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
  Email: string
  Organisation: string
  'H&S submitted': 'Yes' | 'No'
  [key: string]: string | boolean
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
  courseId?: number
  organizationId: string
  paymentMethod: PaymentMethod
  promoCodes?: string[]
  registrants: { email: string; firstName: string; lastName: string }[]
  salesRepresentativeId?: string
  source?: Course_Source_Enum.EmailEnquiry
}

export type CourseOrderCreation = {
  order_id: string
}
export type RegistrantAddress = {
  addresLine1: string
  addresLine2: string
  city: string
  postcode: string
  country: string
}

export type VirtualCourseRegistrant = {
  email: string
  address: RegistrantAddress
}

export type VirtualCourseBookingDetails = {
  organization: string
  bookingContactEmail: string
  registrants: VirtualCourseRegistrant[]
  invoiceDetails: InvoiceDetails
  orderId: string
}
export type TransferEligibleCourses = {
  courseId: number
  level: string
  type: string
  deliveryType: string
  reaccreditation: boolean
  courseCode: string
  venueName: string | null
  venueCity: string | null
  venueCountry: string | null
}

export enum ResourcePacksOptions {
  DigitalWorkbook = 'DigitalWorkbook',
  PrintWorkbookExpress = 'PrintWorkbookExpress',
  PrintWorkbookStandard = 'PrintWorkbookStandard',
}
