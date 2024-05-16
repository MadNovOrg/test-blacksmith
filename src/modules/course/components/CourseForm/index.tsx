import { yupResolver } from '@hookform/resolvers/yup'
import { Stack } from '@mui/material'
import { isBefore, isDate, isPast, isValid as isValidDate } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react'
import {
  Controller,
  FormProvider,
  FormState,
  useForm,
  UseFormReset,
  UseFormTrigger,
  useWatch,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useUpdateEffect, useEffectOnce } from 'react-use'
import { noop } from 'ts-essentials'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { defaultCurrency } from '@app/components/CurrencySelector'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Source_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import {
  priceFieldIsMandatory,
  courseWithManualPrice,
} from '@app/modules/course/pages/CreateCourse/utils'
import { schemas, yup } from '@app/schemas'
import { CourseInput } from '@app/types'
import { extractTime, requiredMsg } from '@app/util'

import { AttendeesSection } from './AttendeesSection'
import {
  RenewalCycleRadios,
  schema as renewalCycleSchema,
} from './components/RenewalCycleRadios/RenewalCycleRadios'
import {
  defaultStrategies,
  schema as strategiesSchema,
  validateStrategies,
} from './components/StrategyToggles/StrategyToggles'
import BildCourseFinanceSection from './FormFinanceSection/BildCourseFinanceSection'
import ClosedCourseFinanceSection from './FormFinanceSection/ClosedCourseFinanceSection'
import OpenCourseFinanceSection from './FormFinanceSection/OpenCourseFinanceSection'
import { GeneralDetailsSection } from './GeneralDetailsSection'
import {
  Countries_Code,
  displayClosedCourseSalesRepr,
  getAccountCode,
  getDefaultSpecialInstructions,
  hasRenewalCycle,
  isEndDateTimeBeforeStartDateTime,
} from './helpers'

export type DisabledFields = Partial<keyof CourseInput>

interface Props {
  type?: Course_Type_Enum
  courseInput?: CourseInput
  disabledFields?: Set<DisabledFields>
  isCreation?: boolean
  onChange?: (input: { data?: CourseInput; isValid?: boolean }) => void
  methodsRef?: RefObject<{
    trigger: UseFormTrigger<CourseInput>
    formState: FormState<CourseInput>
    reset: UseFormReset<CourseInput>
  }>
  trainerRatioNotMet?: boolean
  allowCourseEditWithoutScheduledPrice?: Dispatch<SetStateAction<boolean>>
}

const accountCodeValue = getAccountCode()

export const CourseForm: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
  type: courseType = Course_Type_Enum.Open,
  courseInput,
  isCreation = true,
  disabledFields = new Set(),
  methodsRef,
  trainerRatioNotMet,
  allowCourseEditWithoutScheduledPrice = noop,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  // Used for:
  // - Open course residing country https://behaviourhub.atlassian.net/browse/TTHP-2915
  // - Closed course ICM residing country https://behaviourhub.atlassian.net/browse/TTHP-3529
  const residingCountryEnabled = useFeatureFlagEnabled(
    'course-residing-country'
  )
  const openIcmInternationalFinanceEnabled = useFeatureFlagEnabled(
    'open-icm-course-international-finance'
  )

  const isResidingCountryEnabled = useMemo(
    () => residingCountryEnabled,
    [residingCountryEnabled]
  )

  const isInternationalFinanceEnabled = useMemo(
    () => Boolean(openIcmInternationalFinanceEnabled),
    [openIcmInternationalFinanceEnabled]
  )

  const hasOrg = [Course_Type_Enum.Closed, Course_Type_Enum.Indirect].includes(
    courseType
  )
  const isOpenCourse = courseType === Course_Type_Enum.Open
  const isClosedCourse = courseType === Course_Type_Enum.Closed
  const isIndirectCourse = courseType === Course_Type_Enum.Indirect
  const hasMinParticipants = courseType === Course_Type_Enum.Open

  const minCourseStartDate = new Date()
  minCourseStartDate.setDate(minCourseStartDate.getDate() + 1)

  const { countriesCodesWithUKs, isUKCountry } = useWorldCountries()

  const isCourseInUK = isUKCountry(
    courseInput?.residingCountry ?? Countries_Code.DEFAULT_RESIDING_COUNTRY
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
                    t('components.course-form.free-spaces-less-equal')
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
                  email: schemas.email(t).required(requiredMsg(t, 'email')),
                }),
              }
            : null),
          courseLevel: yup
            .string()
            .required(t('components.course-form.course-level-required')),
          blendedLearning: yup.bool(),
          reaccreditation: yup.bool(),
          ...(isResidingCountryEnabled
            ? {
                residingCountry: yup
                  .string()
                  .oneOf(countriesCodesWithUKs)
                  .required(
                    requiredMsg(t, 'components.course-form.residing-country')
                  ),
              }
            : {}),
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
              }
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
              }
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
                    t('components.course-form.min-participants-required')
                  )
                  .positive(
                    t('components.course-form.min-participants-positive')
                  )
                  .required(
                    t('components.course-form.min-participants-required')
                  )
                  .max(
                    yup.ref('maxParticipants', {}),
                    t('components.course-form.min-participants-less-than')
                  ),
              }
            : null),
          ...(isResidingCountryEnabled
            ? {
                timeZone: yup
                  .object()
                  .required(t('components.course-form.timezone-required')),
              }
            : null),
          maxParticipants: yup
            .number()
            .typeError(t('components.course-form.max-participants-required'))
            .positive(t('components.course-form.max-participants-positive'))
            .required(t('components.course-form.max-participants-required'))
            .test(
              'attendees-exceeded',
              isCreation
                ? t(
                    'components.course-form.attendees-number-exceeds-trainer-ratio-message'
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
              }
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
              t('components.course-form.course-cost-positive-number-error')
            )

            .when('usesAOL', {
              is: true,
              then: schema =>
                schema
                  .required(
                    t('components.course-form.course-cost-required-error')
                  )
                  .min(
                    0,
                    t(
                      'components.course-form.course-cost-positive-number-error'
                    )
                  ),
              otherwise: schema =>
                schema
                  .allowEmptyNumberField()
                  .nullable()
                  .positive(
                    t(
                      'components.course-form.course-cost-positive-number-error'
                    )
                  ),
            }),
          specialInstructions: yup.string().nullable().default(''),
          parkingInstructions: yup.string().nullable().default(''),
          bildStrategies: strategiesSchema.when(
            ['accreditedBy', 'conversion'],
            {
              is: (accreditedBy: Accreditors_Enum, conversion: boolean) =>
                accreditedBy === Accreditors_Enum.Bild && conversion === false,
              then: s => validateStrategies(s, t),
              otherwise: s => s,
            }
          ),
          conversion: yup.boolean(),
          renewalCycle: renewalCycleSchema.when(['startDate', 'courseLevel'], {
            is: (startDate: Date, courseLevel: Course_Level_Enum) =>
              hasRenewalCycle({
                courseType,
                startDate,
                courseLevel,
              }),
            then: s =>
              s.required(t('components.course-form.renewal-cycle-required')),
            otherwise: s => s.nullable(),
          }),
          ...(isInternationalFinanceEnabled
            ? {
                priceCurrency: yup.string().when('residingCountry', {
                  is: (residingCountry: WorldCountriesCodes) =>
                    !isUKCountry(residingCountry),
                  then: schema =>
                    schema.required(requiredMsg(t, 'common.currency-word')),
                }),
                includeVAT: yup
                  .bool()
                  .nullable()
                  .when('residingCountry', {
                    is: (residingCountry: WorldCountriesCodes) =>
                      !isUKCountry(residingCountry),
                    then: schema =>
                      schema.required(requiredMsg(t, 'vat')).default(false),
                  }),
              }
            : {}),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .when((values: CourseInput[], schema: any) => {
          const showPriceField = priceFieldIsMandatory({
            accreditedBy: values[0].accreditedBy as Accreditors_Enum,
            blendedLearning: values[0].blendedLearning,
            maxParticipants: values[0].maxParticipants ?? 0,
            courseLevel: values[0].courseLevel as Course_Level_Enum,
            courseType,
            residingCountry: values[0].residingCountry as Countries_Code,
          })

          if (showPriceField) {
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
      acl,
      countriesCodesWithUKs,
      courseInput?.accreditedBy,
      courseInput?.maxParticipants,
      courseInput?.startDate,
      courseType,
      hasMinParticipants,
      hasOrg,
      isOpenCourse,
      isClosedCourse,
      isCreation,
      isIndirectCourse,
      isInternationalFinanceEnabled,
      isResidingCountryEnabled,
      isUKCountry,
      t,
      trainerRatioNotMet,
    ]
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
      freeSpaces: courseInput?.freeSpaces ?? null,
      usesAOL: Boolean(courseInput?.aolCountry) ?? false,
      aolCountry: courseInput?.aolCountry ?? null,
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
      includeVAT: courseInput?.includeVAT ?? (isCreation && isCourseInUK),
      renewalCycle: courseInput?.renewalCycle,
      ...(isResidingCountryEnabled
        ? {
            residingCountry:
              courseInput?.residingCountry ??
              Countries_Code.DEFAULT_RESIDING_COUNTRY,
          }
        : {}),
    }),
    [
      courseInput?.accountCode,
      courseInput?.accreditedBy,
      courseInput?.aolCountry,
      courseInput?.aolRegion,
      courseInput?.arloReferenceId,
      courseInput?.bildStrategies,
      courseInput?.blendedLearning,
      courseInput?.bookingContact,
      courseInput?.conversion,
      courseInput?.courseCost,
      courseInput?.courseLevel,
      courseInput?.deliveryType,
      courseInput?.displayOnWebsite,
      courseInput?.endDateTime,
      courseInput?.freeSpaces,
      courseInput?.includeVAT,
      courseInput?.maxParticipants,
      courseInput?.minParticipants,
      courseInput?.organization,
      courseInput?.organizationKeyContact,
      courseInput?.parkingInstructions,
      courseInput?.price,
      courseInput?.priceCurrency,
      courseInput?.reaccreditation,
      courseInput?.renewalCycle,
      courseInput?.residingCountry,
      courseInput?.salesRepresentative,
      courseInput?.source,
      courseInput?.specialInstructions,
      courseInput?.startDateTime,
      courseInput?.timeZone,
      courseInput?.venue,
      courseInput?.zoomMeetingUrl,
      courseInput?.zoomProfileId,
      courseType,
      isResidingCountryEnabled,
      isCourseInUK,
      isCreation,
    ]
  )

  const methods = useForm<CourseInput>({
    resolver: yupResolver(formSchema),
    mode: 'all',
    defaultValues,
  })
  const {
    register,
    setValue,
    watch,
    formState,
    control,
    trigger,
    resetField,
    setError,
    clearErrors,
    reset,
  } = methods

  const errors = formState.errors

  useImperativeHandle(
    methodsRef,
    () => ({
      trigger,
      formState,
      reset,
    }),
    [trigger, formState, reset]
  )

  const values = watch()
  const { deliveryType, courseLevel } = values

  const isBild = values.accreditedBy === Accreditors_Enum.Bild
  const isICM = values.accreditedBy === Accreditors_Enum.Icm

  const startDate = useWatch({ control, name: 'startDate' })
  const startTime = useWatch({ control, name: 'startTime' })
  const endDate = useWatch({ control, name: 'endDate' })
  const endTime = useWatch({ control, name: 'endTime' })

  /**
   * this flag shows 3 fields: priceCurrency, price & includesVAT
   * if the PostHog feature flag is enabled
   */
  const showInternationalFinanceSection = useMemo(
    () => isInternationalFinanceEnabled && !isUKCountry(values.residingCountry),
    [isInternationalFinanceEnabled, isUKCountry, values.residingCountry]
  )

  // CLOSED course shows two fields by default: Sales Representative & Source
  const showClosedCourseSalesRepr = useMemo(
    () =>
      values.accreditedBy && values.courseLevel
        ? displayClosedCourseSalesRepr({
            courseType,
            accreditedBy: values.accreditedBy,
            residingCountry: values.residingCountry as WorldCountriesCodes,
          })
        : false,
    [
      courseType,
      values.accreditedBy,
      values.courseLevel,
      values.residingCountry,
    ]
  )

  const courseHasManualPrice = useMemo(() => {
    return courseWithManualPrice({
      accreditedBy: values.accreditedBy as Accreditors_Enum,
      courseType,
      courseLevel: values.courseLevel as Course_Level_Enum,
      blendedLearning: values.blendedLearning,
      maxParticipants: values.maxParticipants ?? 0,
      residingCountry: values.residingCountry as WorldCountriesCodes,
      internationalFlagEnabled: isInternationalFinanceEnabled,
    })
  }, [
    courseType,
    isInternationalFinanceEnabled,
    values.accreditedBy,
    values.blendedLearning,
    values.courseLevel,
    values.maxParticipants,
    values.residingCountry,
  ])

  /**
   * flag to display Finance Section for CLOSED courses
   * it shows following fields: priceCurrency, price & includeVAT
   */
  const showCLOSEDcourseFinanceSection = useMemo(() => {
    return (
      isICM &&
      isClosedCourse &&
      (showInternationalFinanceSection ||
        showClosedCourseSalesRepr ||
        courseHasManualPrice)
    )
  }, [
    isICM,
    isClosedCourse,
    showInternationalFinanceSection,
    showClosedCourseSalesRepr,
    courseHasManualPrice,
  ])

  // flag to display Finance Section for OPEN courses
  const showOPENcourseFinanceSection = useMemo(() => {
    return isICM && isOpenCourse && showInternationalFinanceSection
  }, [isICM, isOpenCourse, showInternationalFinanceSection])

  /**
   * BILD course (both OPEN & CLOSED) shows price field only
   */
  const showBILDcourseFinanceSection = useMemo(
    () => (isOpenCourse || isClosedCourse) && isBild,
    [isBild, isClosedCourse, isOpenCourse]
  )

  const coursePrice = useCoursePrice({
    accreditedBy: values.accreditedBy,
    startDateTime: values.startDateTime ?? null,
    residingCountry:
      (values.residingCountry as WorldCountriesCodes) ??
      Countries_Code.DEFAULT_RESIDING_COUNTRY,
    courseType,
    courseLevel: values.courseLevel as Course_Level_Enum,
    reaccreditation: values.reaccreditation,
    blended: values.blendedLearning,
    maxParticipants: values.maxParticipants,
  })

  useEffectOnce(() => {
    setValue(
      'residingCountry',
      courseInput?.residingCountry ?? Countries_Code.DEFAULT_RESIDING_COUNTRY
    )

    const UKcountry = isUKCountry(
      courseInput?.residingCountry ?? Countries_Code.DEFAULT_RESIDING_COUNTRY
    )

    if (isCreation && UKcountry) {
      setValue('includeVAT', true)
    }
  })

  // this sets the course price for UK residing countries
  // based on its Type, LEVEL and blended & reaccreditation status
  useEffect(() => {
    if (isCreation && isUKCountry(values.residingCountry) && isICM) {
      setValue('price', coursePrice?.priceAmount)
      setValue('priceCurrency', coursePrice?.priceCurrency)
    }

    if (
      isCreation &&
      (isBild || (isClosedCourse && !isUKCountry(values.residingCountry)))
    ) {
      resetField('price')
    }
  }, [
    isCreation,
    isICM,
    isBild,
    setValue,
    resetField,
    isClosedCourse,
    isUKCountry,
    values.residingCountry,
    coursePrice?.priceAmount,
    coursePrice?.priceCurrency,
  ])

  useEffect(() => {
    if (!isCreation && courseHasManualPrice) {
      allowCourseEditWithoutScheduledPrice(true)
    }

    // do not allow editing a course if there's no scheduled price for it
    if (!isCreation && !courseHasManualPrice && !coursePrice) {
      allowCourseEditWithoutScheduledPrice(false)
    } else if (!isCreation && !courseHasManualPrice && coursePrice) {
      allowCourseEditWithoutScheduledPrice(true)
    }
  }, [
    isCreation,
    coursePrice,
    courseHasManualPrice,
    allowCourseEditWithoutScheduledPrice,
  ])

  // set VAT true for all UK countries
  useEffect(() => {
    if (isCreation && isUKCountry(values.residingCountry) && !isBild) {
      setValue('includeVAT', true)
    }
  }, [isCreation, isUKCountry, setValue, values.residingCountry, isBild])

  useEffect(() => {
    if (!isCreation) {
      trigger('maxParticipants')
      if (!trainerRatioNotMet) clearErrors('maxParticipants')
    }
  }, [trainerRatioNotMet, clearErrors, trigger, isCreation])

  useEffect(() => {
    // we need to update to default values if something change in the input
    if (isCreation) {
      const instructions = getDefaultSpecialInstructions(
        courseType,
        courseLevel as Course_Level_Enum,
        deliveryType,
        values.reaccreditation,
        values.conversion,
        t
      )

      setValue('specialInstructions', instructions)
    }
  }, [
    courseLevel,
    courseType,
    deliveryType,
    isCreation,
    setValue,
    t,
    values.reaccreditation,
    values.conversion,
  ])

  useEffect(() => {
    if (
      isEndDateTimeBeforeStartDateTime(startDate, startTime, endDate, endTime)
    ) {
      setError('endDateTime', {
        message: t('components.course-form.end-date-before-start-date'),
      })
    } else {
      clearErrors('endDateTime')
    }
  }, [clearErrors, endDate, endTime, setError, startDate, startTime, t])

  useEffect(() => {
    const s = watch(data => {
      onChange({
        data: data as CourseInput,
        isValid: formState.isValid,
      })
    })
    return () => s.unsubscribe()
  }, [formState.isValid, onChange, watch])

  useEffect(() => {
    onChange({
      isValid: formState.isValid,
    })
  }, [formState.isValid, onChange])

  useEffect(() => {
    if (
      values.startDateTime &&
      isDate(values.startDateTime) &&
      isValidDate(values.startDateTime)
    ) {
      setValue('accountCode', getAccountCode(values.startDateTime))
    }
  }, [values.startDateTime, setValue])

  useEffect(() => {
    const elements = Object.keys(errors)
      .map(name => document.getElementsByName(name)[0])
      .filter(el => !!el)

    elements.sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
    )

    if (elements.length > 0) {
      const errorElement = elements[0]
      if (!errorElement || !errorElement.scrollIntoView) return
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })

  useEffect(() => {
    if (values.courseLevel === Course_Level_Enum.BildRegular) {
      setValue('conversion', false)
    }
  }, [values.courseLevel, setValue])

  useUpdateEffect(() => {
    setValue('aolRegion', '')
  }, [setValue, values.aolCountry])

  return (
    <form>
      <FormProvider {...methods}>
        <Stack gap={6}>
          <GeneralDetailsSection
            disabledFields={disabledFields}
            isCreation={isCreation}
          />
          <AttendeesSection
            disabledFields={disabledFields}
            isCreation={isCreation}
          />

          {/* For level 1 MVA this input is hidden from UI, however it is set when we are sending request to create course*/}
          {startDate &&
          values.courseLevel &&
          hasRenewalCycle({
            courseType,
            startDate,
            courseLevel: values.courseLevel as Course_Level_Enum,
          }) ? (
            <Controller
              control={control}
              name="renewalCycle"
              render={({ field }) => (
                <RenewalCycleRadios
                  {...field}
                  error={errors.renewalCycle?.message}
                />
              )}
            />
          ) : null}

          {showOPENcourseFinanceSection ? (
            <OpenCourseFinanceSection
              isCreateCourse={isCreation}
              errors={errors}
              price={values.price}
              priceCurrency={values.priceCurrency}
              includeVAT={values.includeVAT}
              disabledFields={disabledFields}
              register={register}
              control={control}
            />
          ) : null}

          {showCLOSEDcourseFinanceSection ? (
            <ClosedCourseFinanceSection
              showPricingSection={courseHasManualPrice}
              isCreateCourse={isCreation}
              courseLevel={values.courseLevel as Course_Level_Enum}
              isBlended={values.blendedLearning}
              errors={errors}
              price={values.price}
              priceCurrency={values.priceCurrency}
              includeVAT={values.includeVAT}
              residingCountry={
                values.residingCountry ??
                Countries_Code.DEFAULT_RESIDING_COUNTRY
              }
              salesRepresentative={values.salesRepresentative}
              accountCode={values.accountCode}
              disabledFields={disabledFields}
              register={register}
              setValue={setValue}
              control={control}
            />
          ) : null}

          {showBILDcourseFinanceSection ? (
            <BildCourseFinanceSection
              showSalesRepr={isClosedCourse}
              errors={errors}
              price={values.price}
              priceCurrency={values.priceCurrency}
              includeVAT={values.includeVAT}
              salesRepresentative={values.salesRepresentative}
              disabledFields={disabledFields}
              register={register}
              setValue={setValue}
              control={control}
            />
          ) : null}
        </Stack>
      </FormProvider>
    </form>
  )
}
