import { yupResolver } from '@hookform/resolvers/yup'
import { isBefore, isPast } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import isEmail from 'validator/lib/isEmail'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Source_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCurrencies } from '@app/hooks/useCurrencies/useCurrencies'
import { priceFieldIsMandatory } from '@app/modules/course/pages/CreateCourse/utils'
import { schemas, yup } from '@app/schemas'
import { CourseInput } from '@app/types'
import { extractTime, requiredMsg } from '@app/util'

import { schema as renewalCycleSchema } from '../components/RenewalCycleRadios/RenewalCycleRadios'
import {
  defaultStrategies,
  schema as strategiesSchema,
  validateStrategies,
} from '../components/StrategyToggles/StrategyToggles'
import { hasRenewalCycle, Countries_Code, getAccountCode } from '../helpers'
interface Props {
  courseInput?: CourseInput
  isCreation: boolean
  courseType: Course_Type_Enum
  trainerRatioNotMet?: boolean
  currentNumberOfParticipantsAndInvitees?: number
}

const accountCodeValue = getAccountCode()

export const useCourseCreationFormSchema = ({
  courseInput,
  isCreation,
  courseType,
  trainerRatioNotMet,
  currentNumberOfParticipantsAndInvitees = 0,
}: Props) => {
  const { t } = useTranslation()
  const { acl, profile } = useAuth()
  const { countriesCodesWithUKs, isUKCountry, isAustraliaCountry } =
    useWorldCountries()
  const { defaultCurrency } = useCurrencies(courseInput?.residingCountry)
  const hideMCM = useFeatureFlagEnabled('hide-mcm')
  const defaultResidingCountry = () => {
    if (acl.isAustralia()) {
      return Countries_Code.AUSTRALIA
    }
    return Countries_Code.DEFAULT_RESIDING_COUNTRY
  }

  const isCourseInUK = isUKCountry(
    courseInput?.residingCountry ?? defaultResidingCountry(),
  )

  const residingCountry =
    acl.isUK() && acl.isTrainer() && profile?.countryCode
      ? profile?.countryCode
      : defaultResidingCountry()

  const isOpenCourse = courseType === Course_Type_Enum.Open
  const isClosedCourse = courseType === Course_Type_Enum.Closed
  const isIndirectCourse = courseType === Course_Type_Enum.Indirect
  const hasMinParticipants = courseType === Course_Type_Enum.Open
  const hasOrg = [Course_Type_Enum.Closed, Course_Type_Enum.Indirect].includes(
    courseType,
  )

  const formSchema = useMemo(
    () =>
      yup
        .object({
          accreditedBy: yup
            .mixed()
            .oneOf([Accreditors_Enum.Bild, Accreditors_Enum.Icm]),
          ...(hasOrg
            ? {
                organization: yup
                  .object()
                  .required(t('components.course-form.organisation-required')),
              }
            : null),
          ...(isOpenCourse
            ? {
                displayOnWebsite: yup.bool().required().default(true),
              }
            : null),
          ...(isClosedCourse
            ? {
                bookingContact: yup.object({
                  profileId: yup.string(),
                  firstName: yup
                    .string()
                    .required(requiredMsg(t, 'first-name')),
                  lastName: yup.string().required(requiredMsg(t, 'last-name')),
                  email: schemas.email(t).required(requiredMsg(t, 'email')),
                }),
                freeSpaces: yup
                  .number()
                  .typeError(t('components.course-form.free-spaces-required'))
                  .min(0, t('components.course-form.free-spaces-required'))
                  .max(
                    yup.ref('maxParticipants', {}),
                    t('components.course-form.free-spaces-less-equal'),
                  )
                  .required(t('components.course-form.free-spaces-required')),
                salesRepresentative: yup.object().required(),
                source: yup
                  .string()
                  .oneOf(Object.values(Course_Source_Enum))
                  .required(),
                accountCode: yup.string().required(),
              }
            : null),
          //TODO: Delete this after Arlo migration ------ search for Delete this after Arlo migration to find every occurence that needs to be deleted //
          ...(!isIndirectCourse
            ? {
                arloReferenceId: yup.string(),
              }
            : null),
          ...(isIndirectCourse
            ? {
                organizationKeyContact: yup.object({
                  profileId: yup.string(),
                  firstName: yup
                    .string()
                    .required(requiredMsg(t, 'first-name')),
                  lastName: yup.string().required(requiredMsg(t, 'surname')),
                  email: schemas
                    .email(t)
                    .required(requiredMsg(t, 'email'))
                    .test(
                      'is-email',
                      t('validation-errors.email-invalid'),
                      email => {
                        return isEmail(email)
                      },
                    ),
                }),
              }
            : null),
          courseLevel: yup
            .string()
            .required(t('components.course-form.course-level-required')),
          blendedLearning: yup.bool(),
          reaccreditation: yup.bool(),
          residingCountry: yup
            .string()
            .test(
              'is-valid-value',
              requiredMsg(t, 'components.course-form.residing-country'),
              value => {
                return countriesCodesWithUKs.includes(
                  value as WorldCountriesCodes,
                )
              },
            ),
          deliveryType: yup
            .mixed()
            .oneOf([
              Course_Delivery_Type_Enum.F2F,
              Course_Delivery_Type_Enum.Virtual,
              Course_Delivery_Type_Enum.Mixed,
            ]),
          venue: yup
            .object()
            .nullable()
            .when('deliveryType', {
              is: (deliveryType: Course_Delivery_Type_Enum) =>
                deliveryType === Course_Delivery_Type_Enum.F2F ||
                deliveryType === Course_Delivery_Type_Enum.Mixed,
              then: schema =>
                schema.required(t('components.course-form.venue-required')),
            }),
          startDate: yup
            .date()
            .nullable()
            .typeError(t('components.course-form.start-date-format'))
            .test(
              'not-in-the-past',
              t('components.course-form.start-date-in-the-past'),
              value => {
                if (
                  !isCreation &&
                  value &&
                  courseInput?.startDate &&
                  isPast(new Date(courseInput?.startDate))
                )
                  return !isBefore(value, courseInput?.startDate)
                if (value) return !isPast(value)
              },
            )
            .required(t('components.course-form.start-date-required')),
          startTime: yup
            .string()
            .required(t('components.course-form.start-time-required')),
          endDate: yup
            .date()
            .nullable()
            .typeError(t('components.course-form.end-date-format'))
            .test(
              'not-in-the-past',
              t('components.course-form.end-date-in-the-past'),
              value => {
                if (value) return !isPast(value)
              },
            )
            .required(t('components.course-form.end-date-required')),
          endTime: yup
            .string()
            .required(t('components.course-form.end-time-required')),
          ...(hasMinParticipants
            ? {
                minParticipants: yup
                  .number()
                  .typeError(
                    t('components.course-form.min-participants-required'),
                  )
                  .positive(
                    t('components.course-form.min-participants-positive'),
                  )
                  .required(
                    t('components.course-form.min-participants-required'),
                  )
                  .max(
                    yup.ref('maxParticipants', {}),
                    t('components.course-form.min-participants-less-than'),
                  ),
              }
            : null),
          timeZone: yup
            .object()
            .required(t('components.course-form.timezone-required')),
          maxParticipants: yup
            .number()
            .typeError(t('components.course-form.max-participants-required'))
            .positive(t('components.course-form.max-participants-positive'))
            .required(t('components.course-form.max-participants-required'))
            .test(
              'attendees-exceeded',
              isCreation
                ? t(
                    'components.course-form.attendees-number-exceeds-trainer-ratio-message',
                  )
                : `${t('components.course-form.max-participants-exceeded')} ${
                    courseInput?.maxParticipants
                  }`,
              maxParticipantsValue => {
                if (isCreation) {
                  return !trainerRatioNotMet || !acl.isTrainer()
                }

                const isBildCourse =
                  courseInput?.accreditedBy === Accreditors_Enum.Bild
                const initialParticipantsCount = courseInput?.maxParticipants
                const updatedParticipantsCount = maxParticipantsValue
                if (
                  acl.isTrainer() &&
                  !isCreation &&
                  isBildCourse &&
                  initialParticipantsCount &&
                  updatedParticipantsCount > initialParticipantsCount
                ) {
                  return false
                } else {
                  return true
                }
              },
            )
            .test(
              'min-required-max-participants',
              t('components.course-form.min-required-max-participants'),
              maxParticipantsVal => {
                if (isCreation) return true

                if (
                  maxParticipantsVal &&
                  currentNumberOfParticipantsAndInvitees
                ) {
                  return (
                    maxParticipantsVal >= currentNumberOfParticipantsAndInvitees
                  )
                }

                return true
              },
            ),
          usesAOL: yup.boolean(),
          aolCountry: yup
            .string()
            .nullable()
            .when('usesAOL', {
              is: true,
              then: schema => schema.required('Provide AOL Country'),
            }),
          aolRegion: yup
            .string()
            .nullable()
            .when('usesAOL', {
              is: true,
              then: schema => schema.required('Provide AOL Region'),
            }),
          courseCost: yup
            .number()
            .typeError(
              t('components.course-form.course-cost-positive-number-error'),
            )

            .when('usesAOL', {
              is: true,
              then: schema =>
                schema
                  .required(
                    t('components.course-form.course-cost-required-error'),
                  )
                  .min(
                    0,
                    t(
                      'components.course-form.course-cost-positive-number-error',
                    ),
                  ),
              otherwise: schema =>
                schema
                  .allowEmptyNumberField()
                  .nullable()
                  .positive(
                    t(
                      'components.course-form.course-cost-positive-number-error',
                    ),
                  ),
            }),
          specialInstructions: yup.string().nullable().default(''),
          parkingInstructions: yup.string().nullable().default(''),
          ...(isClosedCourse && (acl.isUK() || !hideMCM)
            ? {
                freeCourseMaterials: yup
                  .number()
                  .typeError(
                    t(
                      'components.course-form.free-course-materials.errors.is-required',
                    ),
                  )
                  .required(
                    t(
                      'components.course-form.free-course-materials.errors.is-required',
                    ),
                  )
                  .min(
                    0,
                    t(
                      'components.course-form.free-course-materials.errors.is-negative',
                    ),
                  )
                  .max(
                    yup.ref('maxParticipants', {}),
                    t(
                      `components.course-form.free-course-materials.errors.more-fcm-than-attendees-${
                        isCreation ? 'create' : 'edit'
                      }`,
                    ),
                  ),
              }
            : null),
          bildStrategies: strategiesSchema.when(
            ['accreditedBy', 'conversion'],
            {
              is: (accreditedBy: Accreditors_Enum, conversion: boolean) =>
                accreditedBy === Accreditors_Enum.Bild && conversion === false,
              then: s => validateStrategies(s, t),
              otherwise: s => s,
            },
          ),
          conversion: yup.boolean(),
          renewalCycle: renewalCycleSchema.when(['startDate', 'courseLevel'], {
            is: (startDate: Date, courseLevel: Course_Level_Enum) =>
              hasRenewalCycle({
                courseType,
                startDate,
                courseLevel,
                isAustralia: acl.isAustralia(),
              }),
            then: s =>
              s.required(t('components.course-form.renewal-cycle-required')),
            otherwise: s => s.nullable(),
          }),
          priceCurrency: yup.string().when('residingCountry', {
            is: (residingCountry: WorldCountriesCodes) => {
              if (acl.isAustralia() && isAustraliaCountry(residingCountry))
                return false
              return !isIndirectCourse && !isUKCountry(residingCountry)
            },
            then: schema =>
              schema.required(requiredMsg(t, 'common.currency-word')),
          }),
          includeVAT: yup
            .bool()
            .nullable()
            .when('residingCountry', {
              is: (residingCountry: WorldCountriesCodes) => {
                if (acl.isAustralia() && isAustraliaCountry(residingCountry))
                  return false
                return !isUKCountry(residingCountry)
              },
              then: schema =>
                schema.required(requiredMsg(t, 'vat')).default(false),
            }),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .when((values: CourseInput[], schema: any) => {
          const showPriceField = () => {
            if (
              acl.isAustralia() &&
              isAustraliaCountry(values[0].residingCountry)
            ) {
              return false
            }
            return priceFieldIsMandatory({
              accreditedBy: values[0].accreditedBy as Accreditors_Enum,
              blendedLearning: values[0].blendedLearning,
              maxParticipants: values[0].maxParticipants ?? 0,
              courseLevel: values[0].courseLevel as Course_Level_Enum,
              courseType,
              residingCountry: values[0].residingCountry as Countries_Code,
            })
          }
          if (showPriceField()) {
            return schema.shape({
              price: yup
                .number()
                .positive(t('components.course-form.price-number-error'))
                .typeError(t('components.course-form.price-number-error'))
                .required(),
            })
          }
        }),

    [
      hasOrg,
      t,
      isOpenCourse,
      isClosedCourse,
      isIndirectCourse,
      hideMCM,
      hasMinParticipants,
      isCreation,
      courseInput?.maxParticipants,
      courseInput?.startDate,
      courseInput?.accreditedBy,
      countriesCodesWithUKs,
      currentNumberOfParticipantsAndInvitees,
      acl,
      trainerRatioNotMet,
      courseType,
      isUKCountry,
      isAustraliaCountry,
    ],
  )
  const defaultValues = useMemo<Omit<CourseInput, 'id'>>(
    () => ({
      accreditedBy: courseInput?.accreditedBy ?? Accreditors_Enum.Icm,
      arloReferenceId: courseInput?.arloReferenceId ?? undefined,
      displayOnWebsite: courseInput?.displayOnWebsite ?? true,
      organization: courseInput?.organization ?? null,
      salesRepresentative: courseInput?.salesRepresentative ?? null,
      bookingContact: courseInput?.bookingContact ?? {
        firstName: '',
        lastName: '',
        email: '',
      },
      organizationKeyContact: courseInput?.organizationKeyContact ?? {
        firstName: '',
        lastName: '',
        email: '',
      },
      courseLevel: courseInput?.courseLevel ?? '',
      blendedLearning: courseInput?.blendedLearning ?? false,
      reaccreditation: courseInput?.reaccreditation ?? false,
      deliveryType: courseInput?.deliveryType ?? Course_Delivery_Type_Enum.F2F,
      venue: courseInput?.venue ?? null,
      zoomMeetingUrl: courseInput?.zoomMeetingUrl ?? null,
      zoomProfileId: courseInput?.zoomProfileId ?? null, // need to be schedule [0]
      startDateTime: courseInput?.startDateTime
        ? new Date(courseInput.startDateTime)
        : null,
      startDate: courseInput?.startDateTime
        ? new Date(courseInput.startDateTime)
        : null,
      startTime: courseInput?.startDateTime
        ? extractTime(courseInput.startDateTime)
        : '09:00',
      endDateTime: courseInput?.endDateTime
        ? new Date(courseInput.endDateTime)
        : null,
      endDate: courseInput?.endDateTime
        ? new Date(courseInput.endDateTime)
        : null,
      endTime: courseInput?.endDateTime
        ? extractTime(courseInput?.endDateTime)
        : '17:00',
      minParticipants: courseInput?.minParticipants ?? null,
      maxParticipants: courseInput?.maxParticipants ?? null,
      freeCourseMaterials: courseInput?.freeCourseMaterials ?? null,
      freeSpaces: courseInput?.freeSpaces ?? null,
      usesAOL: courseInput?.usesAOL ?? false,
      aolCountry:
        courseInput?.aolCountry ??
        courseInput?.residingCountry ??
        residingCountry,
      aolRegion: courseInput?.aolRegion ?? null,
      courseCost: courseInput?.courseCost ?? null,
      accountCode: courseInput?.accountCode ?? accountCodeValue,
      type: courseType,
      specialInstructions: courseInput?.specialInstructions ?? '',
      parkingInstructions: courseInput?.parkingInstructions ?? '',
      source: courseInput?.source ?? '',
      bildStrategies: courseInput?.bildStrategies ?? defaultStrategies,
      conversion: courseInput?.conversion ?? false,
      price: courseInput?.price,
      priceCurrency: courseInput?.priceCurrency ?? defaultCurrency,
      timeZone: courseInput?.timeZone,
      includeVAT:
        courseInput?.includeVAT ??
        (isCreation &&
          ((acl.isAustralia() && isAustraliaCountry(residingCountry)) ||
            isCourseInUK)),
      renewalCycle: courseInput?.renewalCycle,
      residingCountry: courseInput?.residingCountry ?? residingCountry,
    }),
    [
      courseInput?.accreditedBy,
      courseInput?.arloReferenceId,
      courseInput?.displayOnWebsite,
      courseInput?.organization,
      courseInput?.salesRepresentative,
      courseInput?.bookingContact,
      courseInput?.organizationKeyContact,
      courseInput?.courseLevel,
      courseInput?.blendedLearning,
      courseInput?.reaccreditation,
      courseInput?.deliveryType,
      courseInput?.venue,
      courseInput?.zoomMeetingUrl,
      courseInput?.zoomProfileId,
      courseInput?.startDateTime,
      courseInput?.endDateTime,
      courseInput?.minParticipants,
      courseInput?.maxParticipants,
      courseInput?.freeCourseMaterials,
      courseInput?.freeSpaces,
      courseInput?.usesAOL,
      courseInput?.aolCountry,
      courseInput?.residingCountry,
      courseInput?.aolRegion,
      courseInput?.courseCost,
      courseInput?.accountCode,
      courseInput?.specialInstructions,
      courseInput?.parkingInstructions,
      courseInput?.source,
      courseInput?.bildStrategies,
      courseInput?.conversion,
      courseInput?.price,
      courseInput?.priceCurrency,
      courseInput?.timeZone,
      courseInput?.includeVAT,
      courseInput?.renewalCycle,
      residingCountry,
      courseType,
      isCreation,
      isCourseInUK,
      defaultCurrency,
      acl,
      isAustraliaCountry,
    ],
  )
  const methods = useForm<CourseInput>({
    resolver: yupResolver(formSchema),
    mode: 'all',
    defaultValues,
  })

  return { methods }
}
