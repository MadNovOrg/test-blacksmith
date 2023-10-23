import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { isDate, isValid as isValidDate } from 'date-fns'
import { TFunction } from 'i18next'
import React, {
  memo,
  RefObject,
  useCallback,
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
import { useUpdateEffect } from 'react-use'
import { noop } from 'ts-essentials'
import { useQuery } from 'urql'
import { SchemaDescription } from 'yup'

import { CountryDropdown } from '@app/components/CountryDropdown'
import { FormPanel } from '@app/components/FormPanel'
import { NumericTextField } from '@app/components/NumericTextField'
import { CallbackOption, OrgSelector } from '@app/components/OrgSelector'
import { isHubOrg } from '@app/components/OrgSelector/utils'
import { ProfileSelector } from '@app/components/ProfileSelector'
import { RegionDropdown } from '@app/components/RegionDropdown'
import {
  Profile as UserSelectorProfile,
  UserSelector,
} from '@app/components/UserSelector'
import { VenueSelector } from '@app/components/VenueSelector'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Source_Enum,
  GetNotDetailedProfileQuery,
  GetNotDetailedProfileQueryVariables,
} from '@app/generated/graphql'
import { useCoursePrice } from '@app/hooks/useCoursePrice'
import { QUERY as GET_NOT_DETAILED_PROFILE } from '@app/queries/profile/get-not-detailed-profile'
import { schemas, yup } from '@app/schemas'
import theme from '@app/theme'
import {
  CourseDeliveryType,
  CourseInput,
  CourseLevel,
  CourseType,
  Organization,
  RoleName,
} from '@app/types'
import {
  bildStrategiesToArray,
  extractTime,
  INDIRECT_COURSE_MIN_ALLOWED_DATE,
  requiredMsg,
} from '@app/util'

import { InstructionAccordionField } from './components/AccordionTextField'
import { CourseDatePicker } from './components/CourseDatePicker'
import { CourseLevelDropdown } from './components/CourseLevelDropdown'
import { CourseTimePicker } from './components/CourseTimePicker'
import { SourceDropdown } from './components/SourceDropdown'
import {
  defaultStrategies,
  schema as strategiesSchema,
  StrategyToggles,
  validateStrategies,
} from './components/StrategyToggles'
import {
  canBeBlended,
  canBeBlendedBild,
  canBeConversion,
  canBeF2F,
  canBeF2FBild,
  canBeMixed,
  canBeMixedBild,
  canBeReacc,
  canBeReaccBild,
  canBeVirtual,
  canBeVirtualBild,
  courseNeedsManualPrice,
  getAccountCode,
  getDefaultSpecialInstructions,
  isEndDateTimeBeforeStartDateTime,
  makeDate,
} from './helpers'

export type DisabledFields = Partial<keyof CourseInput>

type ContactType = 'bookingContact' | 'organizationKeyContact'

const INDIRECT_COURSE_MIN_ALLOWED_DATE_FOR_YUP = new Date(
  new Date(INDIRECT_COURSE_MIN_ALLOWED_DATE.getTime()).setDate(
    INDIRECT_COURSE_MIN_ALLOWED_DATE.getDate() - 1
  )
)

interface Props {
  type?: CourseType
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
}

const accountCodeValue = getAccountCode()

const CourseForm: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
  type: courseType = CourseType.OPEN,
  courseInput,
  isCreation = true,
  disabledFields = new Set(),
  methodsRef,
  trainerRatioNotMet,
}) => {
  const { t } = useTranslation()
  const { activeRole, acl } = useAuth()

  const hasOrg = [CourseType.CLOSED, CourseType.INDIRECT].includes(courseType)
  const isClosedCourse = courseType === CourseType.CLOSED
  const isIndirectCourse = courseType === CourseType.INDIRECT
  const hasMinParticipants = courseType === CourseType.OPEN

  const minCourseStartDate = new Date()
  minCourseStartDate.setDate(minCourseStartDate.getDate() + 1)

  /**
   * TODO Remove after October 1 the PRODUCTION mode condition
   * @description PRODUCTION mode condition for minimal start date on
   * indirect course creation by trainer was added to be tested
   * the changes regarding rescheduling indirect course under
   * 2 weeks
   * @see https://behaviourhub.atlassian.net/jira/software/projects/TTHP/issues/TTHP-2410
   * @see https://behaviourhub.atlassian.net/jira/software/projects/TTHP/issues/TTHP-1484
   * @author ion.mereuta@amdaris.com
   */
  const minStartDateRestriction =
    courseType === CourseType.INDIRECT &&
    activeRole === RoleName.TRAINER &&
    import.meta.env.MODE === 'production'

  const schema = useMemo(
    () =>
      yup.object({
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
        ...(isClosedCourse
          ? {
              bookingContact: yup.object({
                profileId: yup.string(),
                firstName: yup.string().required(requiredMsg(t, 'first-name')),
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
        ...(courseType !== CourseType.INDIRECT
          ? {
              arloReferenceId: yup.string(),
            }
          : null),
        ...(isIndirectCourse
          ? {
              organizationKeyContact: yup.object({
                profileId: yup.string(),
                firstName: yup.string().required(requiredMsg(t, 'first-name')),
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
        deliveryType: yup
          .mixed()
          .oneOf([
            CourseDeliveryType.F2F,
            CourseDeliveryType.VIRTUAL,
            CourseDeliveryType.MIXED,
          ]),
        venue: yup
          .object()
          .nullable()
          .when('deliveryType', {
            is: (deliveryType: CourseDeliveryType) =>
              deliveryType === CourseDeliveryType.F2F ||
              deliveryType === CourseDeliveryType.MIXED,
            then: schema =>
              schema.required(t('components.course-form.venue-required')),
          }),
        startDate: yup
          .date()
          .nullable()
          .typeError(t('components.course-form.start-date-format'))
          .when([], {
            is: () => minStartDateRestriction,

            then: sd =>
              sd.min(
                INDIRECT_COURSE_MIN_ALLOWED_DATE_FOR_YUP,
                t('components.course-form.min-start-date')
              ),
          })
          .required(t('components.course-form.start-date-required')),
        startTime: yup
          .string()
          .required(t('components.course-form.start-time-required')),
        endDate: yup
          .date()
          .nullable()
          .typeError(t('components.course-form.end-date-format'))
          .when([], {
            is: () => minStartDateRestriction,

            then: sd =>
              sd.min(
                INDIRECT_COURSE_MIN_ALLOWED_DATE_FOR_YUP,
                t('components.course-form.min-end-date')
              ),
          })
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
                .positive(t('components.course-form.min-participants-positive'))
                .required(t('components.course-form.min-participants-required'))
                .max(
                  yup.ref('maxParticipants', {}),
                  t('components.course-form.min-participants-less-than')
                ),
            }
          : null),
        maxParticipants: yup
          .number()
          .typeError(t('components.course-form.max-participants-required'))
          .positive(t('components.course-form.max-participants-positive'))
          .required(t('components.course-form.max-participants-required'))
          .test(
            'attendees-exceeded',
            t(
              'components.course-form.attendees-number-exceeds-trainer-ratio-message'
            ),
            () => !trainerRatioNotMet || !acl.isTrainer()
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
          .allowEmptyNumberField()
          .nullable()
          .typeError(
            t('components.course-form.course-cost-positive-number-error')
          )
          .positive(
            t('components.course-form.course-cost-positive-number-error')
          ),
        specialInstructions: yup.string().nullable().default(''),
        parkingInstructions: yup.string().nullable().default(''),
        bildStrategies: strategiesSchema.when('accreditedBy', {
          is: Accreditors_Enum.Bild,
          then: s => validateStrategies(s, t),
          otherwise: s => s,
        }),
        conversion: yup.boolean(),
        price: yup
          .number()
          .positive(t('components.course-form.price-number-error'))
          .typeError(t('components.course-form.price-number-error'))
          .when(
            [
              'accreditedBy',
              'blendedLearning',
              'maxParticipants',
              'courseLevel',
            ],
            {
              is: (
                accreditedBy: Accreditors_Enum,
                blendedLearning: boolean,
                maxParticipants: number,
                courseLevel: CourseLevel
              ) =>
                courseNeedsManualPrice({
                  accreditedBy,
                  blendedLearning,
                  maxParticipants,
                  courseLevel,
                  courseType,
                }),
              then: s => s.required(),
              otherwise: s => s.nullable(),
            }
          ),
      }),

    [
      hasOrg,
      t,
      isClosedCourse,
      isIndirectCourse,
      hasMinParticipants,
      courseType,
      minStartDateRestriction,
      trainerRatioNotMet,
      acl,
    ]
  )

  const defaultValues = useMemo<Omit<CourseInput, 'id'>>(
    () => ({
      accreditedBy: courseInput?.accreditedBy ?? Accreditors_Enum.Icm,
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
      deliveryType: courseInput?.deliveryType ?? CourseDeliveryType.F2F,
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
      usesAOL: Boolean(courseInput?.courseCost) ?? false,
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
      price: courseInput?.price ?? null,
    }),
    [courseInput, courseType]
  )

  const methods = useForm<CourseInput>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues,
  })

  const {
    register,
    setValue,
    watch,
    getValues,
    formState,
    control,
    trigger,
    resetField,
    setError,
    clearErrors,
    reset,
  } = methods

  const errors = formState.errors

  const orgSelectorOnChange = useCallback(
    (org: CallbackOption) => {
      if (!org) {
        setValue('organization', null, {
          shouldValidate: true,
        })
        return
      }

      if (isHubOrg(org)) {
        setValue('organization', org as Organization, {
          shouldValidate: true,
        })
        return
      }
    },
    [setValue]
  )

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
  const deliveryType = values.deliveryType
  const courseLevel = values.courseLevel
  const isBlended = values.blendedLearning
  const isBild = values.accreditedBy === Accreditors_Enum.Bild

  const canBlended =
    values.accreditedBy === Accreditors_Enum.Icm
      ? canBeBlended(courseType, courseLevel, deliveryType)
      : canBeBlendedBild(courseType, values.bildStrategies)

  const canReacc =
    values.accreditedBy === Accreditors_Enum.Icm
      ? canBeReacc(courseType, courseLevel, deliveryType, isBlended)
      : canBeReaccBild(
          courseType,
          values.bildStrategies,
          values.blendedLearning,
          values.conversion
        )

  const canF2F =
    values.accreditedBy === Accreditors_Enum.Icm
      ? canBeF2F(courseType, courseLevel)
      : canBeF2FBild()

  const canVirtual =
    values.accreditedBy === Accreditors_Enum.Icm
      ? canBeVirtual(courseType, courseLevel)
      : canBeVirtualBild(courseType, values.bildStrategies)

  const canMixed =
    values.accreditedBy === Accreditors_Enum.Icm
      ? canBeMixed(courseType, courseLevel)
      : canBeMixedBild(
          courseType,
          values.courseLevel,
          values.bildStrategies
            ? bildStrategiesToArray(values.bildStrategies)
            : []
        )

  const conversionEnabled =
    isBild && canBeConversion(values.reaccreditation, values.courseLevel)

  const hasVenue = [CourseDeliveryType.F2F, CourseDeliveryType.MIXED].includes(
    deliveryType
  )
  const usesAOL =
    courseType === CourseType.INDIRECT && !isBild ? values.usesAOL : false
  const aolCountry = values.aolCountry
  const startDate = useWatch({ control, name: 'startDate' })
  const startTime = useWatch({ control, name: 'startTime' })
  const endDate = useWatch({ control, name: 'endDate' })
  const endTime = useWatch({ control, name: 'endTime' })

  const priceArgs = useMemo(
    () =>
      values.courseLevel === '' || values.accreditedBy !== Accreditors_Enum.Icm
        ? undefined
        : {
            type: courseType,
            courseLevel: values.courseLevel,
            reaccreditation: values.reaccreditation,
            blendedLearning: values.blendedLearning,
            accreditedBy: values.accreditedBy,
            price: values.price,
          },
    [
      courseType,
      values.accreditedBy,
      values.blendedLearning,
      values.courseLevel,
      values.price,
      values.reaccreditation,
    ]
  )

  const { price: automaticPrice } = useCoursePrice(priceArgs)

  const needsManualPrice =
    values.accreditedBy && values.courseLevel
      ? courseNeedsManualPrice({
          accreditedBy: values.accreditedBy,
          blendedLearning: values.blendedLearning,
          courseType,
          courseLevel: values.courseLevel,
          maxParticipants: values.maxParticipants ?? 0,
        })
      : false

  const resetSpecialInstructionsToDefault = useCallback(
    (
      type: CourseType,
      level: CourseLevel | '',
      deliveryType: CourseDeliveryType,
      reaccreditation: boolean,
      conversion: boolean,
      t: TFunction
    ) => {
      isCreation &&
        setValue(
          'specialInstructions',
          getDefaultSpecialInstructions(
            type,
            level,
            deliveryType,
            reaccreditation,
            conversion,
            t
          )
        )
    },
    [isCreation, setValue]
  )

  useEffect(() => {
    if (
      needsManualPrice &&
      automaticPrice &&
      !values.price &&
      values.accreditedBy === Accreditors_Enum.Icm
    ) {
      setValue('price', automaticPrice)
    }

    if (!needsManualPrice) {
      resetField('price')
    }
  }, [
    needsManualPrice,
    automaticPrice,
    values.price,
    setValue,
    resetField,
    values.accreditedBy,
  ])

  useEffect(() => {
    if (!isCreation) {
      trigger('maxParticipants')
      if (!trainerRatioNotMet) clearErrors('maxParticipants')
    }
  }, [trainerRatioNotMet, clearErrors, trigger, isCreation, activeRole])

  useEffect(() => {
    // we need to update to default values if something change in the input
    if (isCreation) {
      const instructions = getDefaultSpecialInstructions(
        courseType,
        courseLevel,
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
        data: {
          ...data,
          courseCost:
            typeof data.courseCost !== 'number' ? null : data.courseCost,
        } as CourseInput,
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
    const mustChange = !canBlended && values.blendedLearning
    mustChange && setValue('blendedLearning', false)
  }, [canBlended, setValue, values.blendedLearning])

  useEffect(() => {
    const mustChange = !canReacc && values.reaccreditation
    if (mustChange) {
      const newReaccreditationValue = false
      setValue('reaccreditation', newReaccreditationValue)
      resetSpecialInstructionsToDefault(
        courseType,
        courseLevel,
        CourseDeliveryType.F2F,
        newReaccreditationValue,
        values.conversion,
        t
      )
    }
  }, [
    canReacc,
    courseLevel,
    courseType,
    resetSpecialInstructionsToDefault,
    setValue,
    t,
    values.reaccreditation,
    values.conversion,
  ])

  useEffect(() => {
    const isVirtual = values.deliveryType === CourseDeliveryType.VIRTUAL
    const mustChange = !canVirtual && isVirtual
    if (mustChange) {
      setValue('deliveryType', CourseDeliveryType.F2F)
      resetSpecialInstructionsToDefault(
        courseType,
        courseLevel,
        CourseDeliveryType.F2F,
        values.reaccreditation,
        values.conversion,
        t
      )
    }
  }, [
    canVirtual,
    courseLevel,
    courseType,
    resetSpecialInstructionsToDefault,
    setValue,
    t,
    values.deliveryType,
    values.reaccreditation,
    values.conversion,
  ])

  useEffect(() => {
    const isMixed = values.deliveryType === CourseDeliveryType.MIXED
    const mustChange = !canMixed && isMixed
    if (mustChange) {
      setValue('deliveryType', CourseDeliveryType.F2F)
      resetSpecialInstructionsToDefault(
        courseType,
        courseLevel,
        CourseDeliveryType.F2F,
        values.reaccreditation,
        values.conversion,
        t
      )
    }
  }, [
    canMixed,
    courseLevel,
    courseType,
    resetSpecialInstructionsToDefault,
    setValue,
    t,
    values.deliveryType,
    values.reaccreditation,
    values.conversion,
  ])

  useEffect(() => {
    if (
      values.startDateTime &&
      isDate(values.startDateTime) &&
      isValidDate(values.startDateTime)
    ) {
      setValue('accountCode', getAccountCode(values.startDateTime))
    }
  }, [values.startDateTime, setValue])

  const retrieveDefaultSpecialInstructions = useCallback(
    () =>
      getDefaultSpecialInstructions(
        courseType,
        courseLevel,
        deliveryType,
        values.reaccreditation,
        values.conversion,
        t
      ),
    [
      courseLevel,
      courseType,
      deliveryType,
      t,
      values.reaccreditation,
      values.conversion,
    ]
  )

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
    if (values.courseLevel === CourseLevel.BildRegular) {
      setValue('conversion', false)
    }
  }, [values.courseLevel, setValue])

  const handleContactChange = useCallback(
    (field: 'bookingContact' | 'organizationKeyContact' = 'bookingContact') =>
      (value: string | UserSelectorProfile) => {
        const isEmail = typeof value === 'string'
        setValue(`${field}.profileId`, isEmail ? undefined : value?.id)
        setValue(
          `${field}.firstName`,
          isEmail || !value?.givenName ? '' : value.givenName,
          { shouldValidate: true }
        )
        setValue(
          `${field}.lastName`,
          isEmail || !value?.familyName ? '' : value.familyName,
          { shouldValidate: true }
        )
        setValue(`${field}.email`, isEmail ? value : value?.email ?? '', {
          shouldValidate: true,
        })
      },
    [setValue]
  )

  const contact = useMemo(
    () =>
      courseType === CourseType.CLOSED
        ? 'bookingContact'
        : courseType === CourseType.INDIRECT
        ? 'organizationKeyContact'
        : null,
    [courseType]
  )

  const [{ data: foundProfileData }, reexecuteQuery] = useQuery<
    GetNotDetailedProfileQuery,
    GetNotDetailedProfileQueryVariables
  >({
    query: GET_NOT_DETAILED_PROFILE,
    variables: {
      where: { email: { _eq: values[contact as ContactType]?.email } },
    },
    pause: true,
  })

  useUpdateEffect(() => {
    if (contact && foundProfileData?.profiles.length) {
      const contactChange = handleContactChange(contact)
      contactChange(foundProfileData?.profiles[0])
    }
  }, [foundProfileData])

  const onBlurUserSelector = useCallback(async () => {
    if (contact) {
      const isValidEmail =
        !errors[contact]?.email?.message && values[contact]?.email

      const isNotAlreadyFetched = Boolean(
        !foundProfileData?.profiles.length ||
          (foundProfileData?.profiles.length &&
            foundProfileData?.profiles[0].email !== values[contact]?.email)
      )

      if (isValidEmail && isNotAlreadyFetched) {
        await reexecuteQuery({ requestPolicy: 'network-only' })
      } else if (isValidEmail && !isNotAlreadyFetched) {
        const contactChange = handleContactChange(contact)
        contactChange(foundProfileData?.profiles[0] as UserSelectorProfile)
      }
    }
  }, [
    contact,
    errors,
    foundProfileData?.profiles,
    handleContactChange,
    reexecuteQuery,
    values,
  ])

  useEffect(() => {
    setValue('aolRegion', '')
  }, [setValue, values.aolCountry])

  const showTrainerOrgOnly =
    !values.usesAOL &&
    courseType === CourseType.INDIRECT &&
    activeRole === RoleName.TRAINER

  return (
    <form>
      <FormProvider {...methods}>
        <Typography variant="h5" fontWeight={500} gutterBottom>
          {t('components.course-form.general-details-title')}
        </Typography>
        <FormPanel mb={2}>
          {acl.canCreateBildCourse(courseType) ? (
            <FormControl
              variant="filled"
              sx={{ mb: theme.spacing(2) }}
              fullWidth
            >
              <InputLabel id="course-category-label">
                {t('course-category')}
              </InputLabel>
              <Controller
                name="accreditedBy"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={e => {
                      setValue('usesAOL', false)
                      setValue('aolCountry', '')
                      setValue('aolRegion', '')
                      setValue('price', null)

                      resetField('bildStrategies')

                      field.onChange(e)
                    }}
                    labelId="course-category-label"
                    disabled={disabledFields.has('accreditedBy')}
                  >
                    <MenuItem value={`${Accreditors_Enum.Icm}`}>ICM</MenuItem>
                    <MenuItem value={`${Accreditors_Enum.Bild}`}>BILD</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          ) : null}

          {courseType === CourseType.INDIRECT && !isBild ? (
            <>
              <Typography
                mt={2}
                fontWeight={600}
                color={isBild ? 'text.disabled' : undefined}
              >
                {t('components.course-form.aol-title')}
              </Typography>
              <Alert severity="info" sx={{ mt: 1 }}>
                {t('components.course-form.aol-info')}
              </Alert>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={e => {
                      setValue('usesAOL', e.target.checked, {
                        shouldValidate: true,
                      })
                      if (!e.target.checked) {
                        resetField('courseCost')
                      }
                    }}
                    checked={usesAOL}
                    disabled={disabledFields.has('usesAOL') || isBild}
                    data-testid="aol-checkbox"
                  />
                }
                label={t('components.course-form.aol-label')}
              />

              {usesAOL ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={6} sm={12}>
                      <FormControl
                        variant="filled"
                        sx={{ mb: theme.spacing(2) }}
                        fullWidth
                        disabled={disabledFields.has('aolCountry')}
                      >
                        <CountryDropdown
                          label={t('country')}
                          errormessage={errors.aolCountry?.message}
                          required
                          {...register('aolCountry')}
                          error={Boolean(errors.aolCountry?.message)}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={6} sm={12}>
                      <FormControl
                        variant="filled"
                        sx={{ mb: theme.spacing(2) }}
                        fullWidth
                      >
                        <Controller
                          name="aolRegion"
                          control={control}
                          render={({ field }) => (
                            <RegionDropdown
                              required
                              {...register('aolRegion')}
                              value={field.value}
                              onChange={field.onChange}
                              usesAOL={usesAOL}
                              country={aolCountry}
                              disabled={
                                !aolCountry || disabledFields.has('aolRegion')
                              }
                              error={Boolean(errors.aolRegion?.message)}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Typography mt={5} fontWeight={600}>
                    {t('components.course-form.course-cost')}
                  </Typography>
                  <Typography mb={1} variant="body2">
                    {t('components.course-form.course-cost-disclaimer')}
                  </Typography>
                  <TextField
                    type={'number'}
                    {...register('courseCost')}
                    variant="filled"
                    placeholder={t(
                      'components.course-form.course-cost-placeholder'
                    )}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">£</InputAdornment>
                      ),
                    }}
                    label={t('components.course-form.course-cost-title')}
                    error={Boolean(errors.courseCost)}
                    helperText={errors.courseCost?.message ?? ''}
                    disabled={disabledFields.has('courseCost')}
                  />
                </>
              ) : null}
            </>
          ) : null}

          {hasOrg ? (
            <>
              <Typography my={2} fontWeight={600}>
                {t('components.course-form.organization-label')}
              </Typography>
              <OrgSelector
                required
                {...register('organization')}
                autocompleteMode={showTrainerOrgOnly}
                showTrainerOrgOnly={showTrainerOrgOnly}
                error={errors.organization?.message}
                allowAdding
                value={values.organization ?? undefined}
                onChange={orgSelectorOnChange}
                textFieldProps={{
                  variant: 'filled',
                }}
                sx={{ marginBottom: 2 }}
                disabled={disabledFields.has('organization')}
              />
            </>
          ) : null}

          {isIndirectCourse ? (
            <>
              <Typography mb={2} fontWeight={600}>
                {t('components.course-form.organization-key-contact-label')}
              </Typography>

              <Grid container spacing={3} mb={3}>
                <Grid item md={12} xs={12}>
                  <UserSelector
                    {...register(`organizationKeyContact`)}
                    required
                    value={values.organizationKeyContact?.email ?? undefined}
                    onChange={handleContactChange('organizationKeyContact')}
                    onEmailChange={handleContactChange(
                      'organizationKeyContact'
                    )}
                    organisationId={getValues('organization')?.id ?? ''}
                    textFieldProps={{ variant: 'filled' }}
                    error={errors.organizationKeyContact?.email?.message}
                    disabled={
                      !getValues('organization') ||
                      disabledFields.has('organizationKeyContact')
                    }
                    onBlur={onBlurUserSelector}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    label={t('first-name')}
                    variant="filled"
                    placeholder={t('first-name-placeholder')}
                    {...register(`organizationKeyContact.firstName`)}
                    error={!!errors.organizationKeyContact?.firstName}
                    helperText={
                      errors.organizationKeyContact?.firstName?.message ?? ''
                    }
                    disabled={
                      !values.organization ||
                      disabledFields.has('organizationKeyContact') ||
                      !!values.organizationKeyContact?.profileId
                    }
                    InputLabelProps={{
                      shrink: !!values.organizationKeyContact?.firstName,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    label={t('surname')}
                    variant="filled"
                    placeholder={t('surname-placeholder')}
                    {...register(`organizationKeyContact.lastName`)}
                    error={!!errors.organizationKeyContact?.lastName}
                    helperText={
                      errors.organizationKeyContact?.lastName?.message ?? ''
                    }
                    disabled={
                      !getValues('organization') ||
                      disabledFields.has('organizationKeyContact') ||
                      !!getValues('organizationKeyContact')?.profileId
                    }
                    InputLabelProps={{
                      shrink: !!values.organizationKeyContact?.lastName,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </>
          ) : null}

          {isClosedCourse ? (
            <>
              <Typography mb={2} fontWeight={600}>
                {t('components.course-form.contact-person-label')}
              </Typography>

              <Grid container spacing={3} mb={3}>
                <Grid item md={12} xs={12}>
                  <UserSelector
                    {...register(`bookingContact`)}
                    required
                    value={values.bookingContact?.email ?? undefined}
                    onChange={handleContactChange()}
                    onEmailChange={handleContactChange()}
                    organisationId={getValues('organization')?.id ?? ''}
                    textFieldProps={{ variant: 'filled' }}
                    error={errors.bookingContact?.email?.message}
                    disabled={
                      !getValues('organization') ||
                      disabledFields.has('bookingContact')
                    }
                    onBlur={onBlurUserSelector}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    label={t('first-name')}
                    variant="filled"
                    placeholder={t('first-name-placeholder')}
                    {...register(`bookingContact.firstName`)}
                    error={!!errors.bookingContact?.firstName}
                    helperText={errors.bookingContact?.firstName?.message ?? ''}
                    disabled={
                      !values.organization ||
                      disabledFields.has('bookingContact') ||
                      !!values.bookingContact?.profileId
                    }
                    InputLabelProps={{
                      shrink: !!values.bookingContact?.firstName,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    label={t('surname')}
                    variant="filled"
                    placeholder={t('surname-placeholder')}
                    {...register(`bookingContact.lastName`)}
                    error={!!errors.bookingContact?.lastName}
                    helperText={errors.bookingContact?.lastName?.message ?? ''}
                    disabled={
                      !getValues('organization') ||
                      disabledFields.has('bookingContact') ||
                      !!getValues('bookingContact')?.profileId
                    }
                    InputLabelProps={{
                      shrink: !!values.bookingContact?.lastName,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </>
          ) : null}

          <Typography mb={2} fontWeight={600}>
            {t('components.course-form.course-level-section-title')}
          </Typography>
          <FormControl variant="filled" sx={{ mb: theme.spacing(2) }} fullWidth>
            <InputLabel id="course-level-dropdown">
              {t('components.course-form.course-level-placeholder')}
            </InputLabel>
            <Controller
              name="courseLevel"
              control={control}
              render={({ field }) => (
                <CourseLevelDropdown
                  {...register('courseLevel')}
                  value={field.value}
                  labelId="course-level-dropdown"
                  onChange={event => {
                    field.onChange(event)

                    resetSpecialInstructionsToDefault(
                      courseType,
                      event.target.value as CourseLevel,
                      deliveryType,
                      values.reaccreditation,
                      values.conversion,
                      t
                    )
                  }}
                  courseType={courseType}
                  courseAccreditor={values.accreditedBy ?? Accreditors_Enum.Icm}
                  disabled={disabledFields.has('courseLevel')}
                />
              )}
            />
            {values.courseLevel === CourseLevel.Level_1 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {t('components.course-form.course-level-one-info')}
              </Alert>
            )}
            {/* TODO: Delete this after Arlo migration to the hub - HAVENT USED THE translations file to have this easier to find by text search */}
            {acl.isInternalUser() && courseType !== CourseType.INDIRECT ? (
              <>
                <TextField
                  sx={{ mt: theme.spacing(2) }}
                  label={'Arlo reference'}
                  variant="filled"
                  {...register(`arloReferenceId`)}
                  fullWidth
                />
                <Alert severity="info" sx={{ mt: 2 }}>
                  This only applies to courses that have been migrated from Arlo
                </Alert>
              </>
            ) : null}
            {/* TODO: REMOVE THE ABOVE after Arlo migration to the hub */}
            {errors.courseLevel?.message ? (
              <FormHelperText error>
                {errors.courseLevel.message}
              </FormHelperText>
            ) : null}
          </FormControl>

          {isBild ? (
            <>
              <StrategyToggles
                courseLevel={values.courseLevel}
                disabled={disabledFields.has('bildStrategies')}
              />
              <FormHelperText error={Boolean(errors.bildStrategies?.message)}>
                {t('components.course-form.select-one-option')}
              </FormHelperText>
            </>
          ) : null}

          <Divider sx={{ my: 2 }} />

          <Controller
            name="blendedLearning"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                sx={{ mr: theme.spacing(5) }}
                disabled={!canBlended || disabledFields.has('blendedLearning')}
                control={
                  <Switch
                    {...field}
                    checked={values.blendedLearning}
                    data-testid="blendedLearning-switch"
                  />
                }
                label={t('components.course-form.blended-learning-label')}
              />
            )}
          />

          <Controller
            name="reaccreditation"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                disabled={!canReacc || disabledFields.has('reaccreditation')}
                control={
                  <Switch
                    {...field}
                    checked={values.reaccreditation}
                    data-testid="reaccreditation-switch"
                  />
                }
                label={t('components.course-form.reaccreditation-label')}
              />
            )}
          />

          {isBild &&
          [CourseType.CLOSED, CourseType.OPEN].includes(courseType) &&
          values.courseLevel !== CourseLevel.BildRegular ? (
            <Controller
              name="conversion"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  disabled={
                    !conversionEnabled || disabledFields.has('conversion')
                  }
                  control={
                    <Switch
                      {...field}
                      checked={values.conversion}
                      data-testid="conversion-switch"
                    />
                  }
                  label={t('components.course-form.conversion-label')}
                />
              )}
            />
          ) : null}

          {isBlended && courseType === CourseType.INDIRECT ? (
            <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
              {t('components.course-form.blended-learning-price-label')}
            </Alert>
          ) : null}

          <Typography mb={2} mt={2} fontWeight={600}>
            {t('components.course-form.delivery-type-section-title')}
          </Typography>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="delivery-type-radio"
              name="delivery-type-radio"
              value={deliveryType}
              onChange={e => {
                const deliveryType = e.target.value as CourseDeliveryType
                setValue('deliveryType', deliveryType)

                if (deliveryType === CourseDeliveryType.VIRTUAL) {
                  setValue('parkingInstructions', '')
                }
                trigger(['venue'])

                resetSpecialInstructionsToDefault(
                  courseType,
                  courseLevel,
                  deliveryType,
                  values.reaccreditation,
                  values.conversion,
                  t
                )
              }}
            >
              <FormControlLabel
                value={CourseDeliveryType.F2F}
                control={
                  <Radio
                    disabled={!canF2F || disabledFields.has('deliveryType')}
                  />
                }
                label={t('components.course-form.f2f-option-label')}
                data-testid={`delivery-${CourseDeliveryType.F2F}`}
              />
              <FormControlLabel
                value={CourseDeliveryType.VIRTUAL}
                control={
                  <Radio
                    disabled={!canVirtual || disabledFields.has('deliveryType')}
                  />
                }
                label={t('components.course-form.virtual-option-label')}
                data-testid={`delivery-${CourseDeliveryType.VIRTUAL}`}
              />
              <FormControlLabel
                value={CourseDeliveryType.MIXED}
                control={
                  <Radio
                    disabled={!canMixed || disabledFields.has('deliveryType')}
                  />
                }
                label={t('components.course-form.mixed-option-label')}
                data-testid={`delivery-${CourseDeliveryType.MIXED}`}
              />
            </RadioGroup>
          </FormControl>

          {hasVenue ? (
            <VenueSelector
              {...register('venue')}
              onChange={venue => {
                return setValue('venue', venue ?? null, {
                  shouldValidate: true,
                })
              }}
              value={values.venue ?? undefined}
              textFieldProps={{
                variant: 'filled',
                error: Boolean(errors.venue),
                required: Boolean(
                  !(schema.describe().fields.venue as SchemaDescription)
                    .optional
                ),
              }}
            />
          ) : null}

          <Controller
            name="specialInstructions"
            control={control}
            render={({ field }) => (
              <InstructionAccordionField
                title={t('components.course-form.special-instructions.title')}
                subtitle={
                  <Alert
                    severity="info"
                    sx={{
                      mt: 2,
                    }}
                  >
                    {t('components.course-form.special-instructions.subtitle')}
                  </Alert>
                }
                confirmResetTitle={t(
                  'components.course-form.special-instructions.modal-title'
                )}
                confirmResetMessage={t(
                  'components.course-form.special-instructions.modal-message'
                )}
                data-testid="course-form-special-instructions"
                defaultValue={retrieveDefaultSpecialInstructions()}
                value={field.value}
                onSave={field.onChange}
                editMode={false}
                maxLength={2000}
              />
            )}
          />
          {deliveryType === CourseDeliveryType.F2F ||
          deliveryType === CourseDeliveryType.MIXED ? (
            <Controller
              name="parkingInstructions"
              control={control}
              render={({ field }) => (
                <InstructionAccordionField
                  title={t('components.course-form.parking-instructions.title')}
                  confirmResetTitle={t(
                    'components.course-form.parking-instructions.modal-title'
                  )}
                  confirmResetMessage={t(
                    'components.course-form.parking-instructions.modal-message'
                  )}
                  data-testid="course-form-parking-instructions"
                  value={field.value}
                  onSave={field.onChange}
                  editMode={false}
                  maxLength={1000}
                />
              )}
            />
          ) : null}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Typography mb={2} mt={2} fontWeight={600}>
              {t('components.course-form.start-datepicker-section-title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CourseDatePicker
                      required
                      name={field.name}
                      label={t('components.course-form.start-date-placeholder')}
                      value={field.value}
                      minDate={
                        minStartDateRestriction
                          ? INDIRECT_COURSE_MIN_ALLOWED_DATE
                          : minCourseStartDate
                      }
                      maxDate={values.endDate || undefined}
                      onChange={newStartDate => {
                        field.onChange(newStartDate)
                        setValue(
                          'startDateTime',
                          makeDate(newStartDate, startTime)
                        )
                        trigger('endDate')
                      }}
                      onBlur={field.onBlur}
                      error={fieldState.error}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} sm={12}>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CourseTimePicker
                      required
                      name={field.name}
                      id="start"
                      label={t('components.course-form.start-time-placeholder')}
                      value={field.value}
                      onChange={newStartTime => {
                        field.onChange(newStartTime)
                        setValue(
                          'startDateTime',
                          makeDate(startDate, newStartTime)
                        )
                      }}
                      error={fieldState.error}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Typography mb={2} mt={2} fontWeight={600}>
              {t('components.course-form.end-datepicker-section-title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CourseDatePicker
                      required
                      name={field.name}
                      label={t('components.course-form.end-date-placeholder')}
                      value={field.value}
                      minDate={
                        values.startDate ??
                        (minStartDateRestriction
                          ? INDIRECT_COURSE_MIN_ALLOWED_DATE
                          : minCourseStartDate)
                      }
                      onChange={newEndDate => {
                        field.onChange(newEndDate)
                        setValue('endDateTime', makeDate(newEndDate, endTime))
                      }}
                      onBlur={field.onBlur}
                      error={
                        fieldState.error || errors.endDateTime
                          ? { ...fieldState.error, ...errors.endDateTime }
                          : undefined
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} sm={12}>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CourseTimePicker
                      required
                      name={field.name}
                      id="end"
                      label={t('components.course-form.end-time-placeholder')}
                      value={field.value}
                      onChange={newEndTime => {
                        field.onChange(newEndTime)
                        setValue('endDateTime', makeDate(endDate, newEndTime))
                      }}
                      error={fieldState.error}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </FormPanel>
        <Typography variant="h5" fontWeight={500} gutterBottom>
          {t('components.course-form.attendees-section-title')}
        </Typography>
        <FormPanel>
          <Typography fontWeight={600}>
            {t('components.course-form.attendees-number-title')}
          </Typography>
          <Typography variant="body2" mb={2}>
            {t('components.course-form.attendees-description')}
          </Typography>

          <Grid container spacing={2}>
            {hasMinParticipants ? (
              <Grid item md={6} sm={12}>
                <NumericTextField
                  required
                  {...register('minParticipants', { valueAsNumber: true })}
                  label={t('components.course-form.min-attendees-placeholder')}
                  variant="filled"
                  fullWidth
                  error={Boolean(errors.minParticipants)}
                  helperText={errors.minParticipants?.message}
                  inputProps={{ min: 1 }}
                  data-testid="min-attendees"
                  disabled={disabledFields.has('minParticipants')}
                />
              </Grid>
            ) : null}

            <Grid item md={6} sm={12}>
              <NumericTextField
                required
                {...register('maxParticipants', {
                  deps: ['minParticipants'],
                  valueAsNumber: true,
                })}
                id="filled-basic"
                label={t(
                  courseType === CourseType.OPEN
                    ? 'components.course-form.max-attendees-placeholder'
                    : 'components.course-form.num-attendees-placeholder'
                )}
                variant="filled"
                fullWidth
                error={Boolean(errors.maxParticipants)}
                helperText={errors.maxParticipants?.message}
                inputProps={{ min: 1 }}
                data-testid="max-attendees"
                disabled={disabledFields.has('maxParticipants')}
              />
            </Grid>
            <Grid item>
              {!isCreation && courseType === CourseType.INDIRECT ? (
                <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
                  {t('components.course-form.attendees-edit-label')}
                </Alert>
              ) : null}
            </Grid>
          </Grid>
        </FormPanel>

        {isClosedCourse || (isBild && courseType === CourseType.OPEN) ? (
          <>
            {isClosedCourse ? (
              <FormPanel mb={2}>
                <Typography fontWeight={600}>
                  {t('components.course-form.free-spaces-title')}
                </Typography>
                <Typography variant="body2" mb={2}>
                  {t('components.course-form.free-spaces-description')}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item md={6} sm={12}>
                    <NumericTextField
                      required
                      {...register('freeSpaces', { valueAsNumber: true })}
                      label={t(
                        'components.course-form.free-spaces-placeholder'
                      )}
                      variant="filled"
                      fullWidth
                      error={Boolean(errors.freeSpaces)}
                      helperText={errors.freeSpaces?.message}
                      inputProps={{ min: 0 }}
                      data-testid="free-spaces"
                      disabled={disabledFields.has('freeSpaces')}
                    />
                  </Grid>
                </Grid>
              </FormPanel>
            ) : null}

            <Typography variant="h5" fontWeight={500} gutterBottom>
              {t('components.course-form.finance-section-title')}
            </Typography>
            <FormPanel>
              {isClosedCourse ? (
                <Grid container spacing={2}>
                  <Grid item md={6} sm={12}>
                    <Typography fontWeight={600}>
                      {t('components.course-form.sales-rep-title')}
                    </Typography>

                    <ProfileSelector
                      {...register('salesRepresentative')}
                      value={values.salesRepresentative ?? undefined}
                      onChange={profile => {
                        setValue('salesRepresentative', profile ?? null, {
                          shouldValidate: true,
                        })
                      }}
                      textFieldProps={{
                        variant: 'filled',
                        label: t(
                          'components.course-form.sales-rep-placeholder'
                        ),
                        required: true,
                        error: Boolean(errors.salesRepresentative?.message),
                        helperText:
                          Boolean(errors.salesRepresentative?.message) &&
                          t('components.course-form.sales-rep-error'),
                      }}
                      placeholder={t(
                        'components.course-form.sales-rep-placeholder'
                      )}
                      testId="profile-selector-sales-representative"
                      disabled={disabledFields.has('salesRepresentative')}
                    />
                  </Grid>
                  <Grid item md={6} sm={12}>
                    <Typography fontWeight={600}>
                      {t('components.course-form.source-title')}
                    </Typography>
                    <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <SourceDropdown
                          {...field}
                          required
                          {...register('source')}
                          error={Boolean(errors.source?.message)}
                          data-testid="source-dropdown"
                          disabled={disabledFields.has('source')}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              ) : null}

              <Box>
                {needsManualPrice ? (
                  <TextField
                    required
                    {...register('price')}
                    label={t('components.course-form.price')}
                    variant="filled"
                    placeholder={t('components.course-form.price-placeholder')}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">£</InputAdornment>
                      ),
                    }}
                    error={Boolean(errors.price)}
                    helperText={errors.price?.message ?? ''}
                    disabled={disabledFields.has('price')}
                    sx={{ mt: 2 }}
                  />
                ) : null}

                {isClosedCourse ? (
                  <>
                    <Typography fontWeight={600} mb={1} mt={2}>
                      {t('components.course-form.account-code-title')}
                    </Typography>

                    <Typography color="dimGrey.main">
                      {values.accountCode}
                    </Typography>
                  </>
                ) : null}
              </Box>
            </FormPanel>
          </>
        ) : null}
      </FormProvider>
    </form>
  )
}

export default memo(CourseForm)
