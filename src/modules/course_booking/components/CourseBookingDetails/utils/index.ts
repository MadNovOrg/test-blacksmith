import { t } from 'i18next'
import isEmail from 'validator/lib/isEmail'

import {
  Course_Level_Enum,
  Course_Source_Enum,
  Course_Type_Enum,
  FindProfilesQuery,
  PaymentMethod,
} from '@app/generated/graphql'
import { formSchema as invoiceDetailsFormSchema } from '@app/modules/course/components/CourseForm/components/InvoiceForm'
import { yup, schemas } from '@app/schemas'
import { InvoiceDetails, Profile } from '@app/types'
import { requiredMsg, isValidUKPostalCode } from '@app/util'

import { ParticipantInput, Sector, BookingContact } from '../../BookingContext'

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

export const getSchema = ({
  isAddressInfoRequired,
}: {
  isAddressInfoRequired: boolean
}) => {
  return yup.object({
    quantity: yup.number().required(),

    participants: yup
      .array()
      .of(
        yup.object({
          firstName: yup.string().required(requiredMsg(t, 'first-name')),
          lastName: yup.string().required(requiredMsg(t, 'last-name')),
          email: schemas
            .email(t)
            .required(requiredMsg(t, 'email'))
            .test('is-email', t('validation-errors.email-invalid'), email => {
              return isEmail(email)
            }),
          ...(isAddressInfoRequired
            ? {
                addressLine1: yup.string().required(requiredMsg(t, 'line1')),
                addressLine2: yup.string(),
                city: yup.string().required(requiredMsg(t, 'city')),
                country: yup.string().required(requiredMsg(t, 'country')),
                postCode: yup
                  .string()
                  .required(requiredMsg(t, 'post-code'))
                  .test(
                    'is-uk-postcode',
                    t('validation-errors.invalid-postcode'),
                    isValidUKPostalCode,
                  ),
              }
            : {}),
        }),
      )
      .length(yup.ref('quantity'), t('validation-errors.max-registrants'))
      .required(requiredMsg(t, 'emails')),

    orgId: yup
      .string()
      .required(requiredMsg(t, 'org-name'))
      .typeError(requiredMsg(t, 'org-name')),

    orgName: yup.string(),

    source: yup.string().when('isInternalUserBooking', {
      is: true,
      then: s => s.oneOf(Object.values(Course_Source_Enum)).required(),
      otherwise: s => s.nullable(),
    }),

    salesRepresentative: yup
      .object()
      .when(['source', 'isInternalUserBooking'], ([source, condition]) => {
        return condition && source.startsWith('SALES_')
          ? yup.object().required()
          : yup.object().nullable()
      }),

    bookingContact: yup.object({
      firstName: yup.string().required(requiredMsg(t, 'first-name')),
      lastName: yup.string().required(requiredMsg(t, 'last-name')),
      email: schemas
        .email(t)
        .required(requiredMsg(t, 'email'))
        .test('is-email', t('validation-errors.email-invalid'), email => {
          return isEmail(email)
        }),
      residingCountry: yup.string(),
      residingCountryCode: yup
        .string()
        .required(requiredMsg(t, 'residing-country')),
    }),

    paymentMethod: yup.string().oneOf(Object.values(PaymentMethod)).required(),

    invoiceDetails: yup
      .object()
      .when('paymentMethod', ([paymentMethod], schema) => {
        return paymentMethod === PaymentMethod.Invoice
          ? invoiceDetailsFormSchema(t)
          : schema
      }),

    courseLevel: yup.string(),
    courseType: yup.string(),
    attendeeValidCertificate: yup
      .boolean()
      .when(['courseLevel', 'courseType'], {
        is: isAttendeeValidCertificateMandatory,
        then: schema =>
          schema.oneOf([true], t('validation-errors.this-field-is-required')),
        otherwise: schema => schema,
      }),
  })
}
