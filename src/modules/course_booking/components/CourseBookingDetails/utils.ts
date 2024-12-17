import { t } from 'i18next'

import {
  Course_Level_Enum,
  Course_Source_Enum,
  Course_Type_Enum,
  FindProfilesQuery,
  PaymentMethod,
} from '@app/generated/graphql'
import { InvoiceDetails, Profile } from '@app/types'

import { ParticipantInput, Sector, BookingContact } from '../BookingContext'

type Level =
  | Course_Level_Enum.Advanced
  | Course_Level_Enum.IntermediateTrainer
  | Course_Level_Enum.FoundationTrainerPlus
  | Course_Level_Enum.AdvancedTrainer
  | Course_Level_Enum.BildIntermediateTrainer
  | Course_Level_Enum.BildAdvancedTrainer
export const showAttendeeTranslationOptions = (
  reaccreditation: boolean,
  conversion: boolean,
  attendees: number,
  courseLevel?: Course_Level_Enum,
) => {
  const getTranslationKey = (baseKey: string, levelKey: string) => {
    if (reaccreditation) {
      return `${baseKey}.${levelKey}.reaccreditation`
    }
    if (conversion) {
      return `${baseKey}.${levelKey}.conversion`
    }
    return `${baseKey}.${levelKey}.default`
  }

  const baseKey = 'pages.book-course.attendee-with-valid-certificate.levels'

  const courseLevelMap: Record<Level, string> = {
    [Course_Level_Enum.Advanced]: 'advanced',
    [Course_Level_Enum.IntermediateTrainer]: 'intermediate-trainer',
    [Course_Level_Enum.FoundationTrainerPlus]: 'foundation-trainer-plus',
    [Course_Level_Enum.AdvancedTrainer]: 'advanced-trainer',
    [Course_Level_Enum.BildIntermediateTrainer]: 'bild-intermediate-trainer',
    [Course_Level_Enum.BildAdvancedTrainer]: 'bild-advanced-trainer',
  }

  if (courseLevel && courseLevelMap[courseLevel as Level]) {
    const levelKey = courseLevelMap[courseLevel as Level]
    return {
      attendees,
      levels: t(getTranslationKey(baseKey, levelKey)),
    }
  }

  return {}
}

export const isAttendeeValidCertificateMandatory = (
  courseLevel?: Course_Level_Enum,
  courseType?: Course_Type_Enum,
  courseResidingCountry?: string | null,
) =>
  courseType === Course_Type_Enum.Open &&
  courseResidingCountry?.includes('GB') &&
  courseLevel &&
  [
    Course_Level_Enum.Advanced,
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.FoundationTrainerPlus,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ].includes(courseLevel)

export type FormInputs = {
  isInternalUserBooking: boolean
  quantity: number
  participants: ParticipantInput[]
  orgId: string
  orgName: string
  sector: Sector
  source: Course_Source_Enum | ''
  salesRepresentative: Profile | null | FindProfilesQuery['profiles'][0]
  bookingContact: BookingContact
  paymentMethod: PaymentMethod

  invoiceDetails?: InvoiceDetails

  courseLevel: Course_Level_Enum
  courseType: Course_Type_Enum
  attendeeValidCertificate?: boolean
}
