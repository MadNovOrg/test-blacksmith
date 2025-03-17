import { Stack } from '@mui/material'
import { isDate, isValid as isValidDate } from 'date-fns'
import { useFeatureFlagEnabled, useFeatureFlagPayload } from 'posthog-js/react'
import React, { useEffect, useImperativeHandle, useMemo } from 'react'
import { Controller, FormProvider, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import { noop } from 'ts-essentials'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Renewal_Cycle_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCurrencies } from '@app/hooks/useCurrencies'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import { isCourseWithNoPrice } from '@app/modules/course/pages/CreateCourse/utils'
import { AwsRegions, CourseInput } from '@app/types'

import { Props } from '..'
import { AttendeesSection } from '../components/AttendeesSection'
import { CourseMaterialsSection } from '../components/CourseMaterialsSection/ANZ'
import ClosedCourseFinanceSection from '../components/FormFinanceSection/ClosedCourseFinanceSection'
import OpenCourseFinanceSection from '../components/FormFinanceSection/OpenCourseFinanceSection'
import { GeneralDetailsSection } from '../components/GeneralDetailsSection'
import { RenewalCycleRadios } from '../components/RenewalCycleRadios/RenewalCycleRadios'
import { ResourcePacksTypeSection } from '../components/ResourcePacksTypeSection/ResourcePacksTypeSection'
import {
  Countries_Code,
  displayClosedCourseSalesRepr,
  getAccountCode,
  hasRenewalCycle,
  isEndDateTimeBeforeStartDateTime,
} from '../helpers'
import { useCourseCreationFormSchema } from '../hooks/useCourseCreationFormSchema'

type WaRenewalCycleLevels =
  | Course_Level_Enum.Level_1
  | Course_Level_Enum.Level_1Np
  | Course_Level_Enum.Level_1Bs
  | Course_Level_Enum.Level_2

const WARenewalCycles: Record<WaRenewalCycleLevels, Course_Renewal_Cycle_Enum> =
  {
    [Course_Level_Enum.Level_1]: Course_Renewal_Cycle_Enum.Three,
    [Course_Level_Enum.Level_1Np]: Course_Renewal_Cycle_Enum.Three,
    [Course_Level_Enum.Level_1Bs]: Course_Renewal_Cycle_Enum.Three,
    [Course_Level_Enum.Level_2]: Course_Renewal_Cycle_Enum.Two,
  }

export const AnzCourseForm: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
  type: courseType = Course_Type_Enum.Open,
  courseInput,
  isCreation = true,
  disabledFields = new Set(),
  methodsRef,
  trainerRatioNotMet,
  allowCourseEditWithoutScheduledPrice = noop,
  currentNumberOfParticipantsAndInvitees,
}) => {
  const { t } = useTranslation()
  const { isAustraliaCountry, isNewZealandCountry } = useWorldCountries()

  const enableIndirectCourseResourcePacks = useFeatureFlagEnabled(
    'indirect-course-resource-packs',
  )

  const hideMCM = useFeatureFlagEnabled('hide-mcm')

  // WA - Western Australia Department of Education - One of the biggest clients of TT
  // WA has specific renewal cycles set up untill 30/04/2025
  // this functionality can be deleted after 30/04/2025

  const waRenewalCyclesEnabled = useFeatureFlagEnabled(
    'wa-specific-renewal-cycles',
  )

  const waId = useFeatureFlagPayload('wa-specific-renewal-cycles') as {
    wa_id: string
  }

  const { methods } = useCourseCreationFormSchema({
    courseInput,
    isCreation,
    courseType,
    trainerRatioNotMet,
    currentNumberOfParticipantsAndInvitees,
  })
  // Used for:
  // - Open course residing country https://behaviourhub.atlassian.net/browse/TTHP-2915
  // - Closed course ICM residing country https://behaviourhub.atlassian.net/browse/TTHP-3529

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
    [trigger, formState, reset],
  )

  const values = watch()
  const { defaultCurrency } = useCurrencies(values.residingCountry)

  const isICM = values.accreditedBy === Accreditors_Enum.Icm
  const isOpenCourse = courseType === Course_Type_Enum.Open
  const isClosedCourse = courseType === Course_Type_Enum.Closed

  const minCourseStartDate = new Date()
  minCourseStartDate.setDate(minCourseStartDate.getDate() + 1)

  const startDate = useWatch({ control, name: 'startDate' })
  const startTime = useWatch({ control, name: 'startTime' })
  const endDate = useWatch({ control, name: 'endDate' })
  const endTime = useWatch({ control, name: 'endTime' })

  /**
   * this flag shows 3 fields: priceCurrency, price & includesVAT
   * if the PostHog feature flag is enabled
   */
  const showFinanceSection = useMemo(
    () => !isAustraliaCountry(values.residingCountry),
    [isAustraliaCountry, values.residingCountry],
  )

  // CLOSED course shows two fields by default: Sales Representative & Source
  const showClosedCourseSalesRepr = useMemo(
    () =>
      values.accreditedBy && values.courseLevel
        ? displayClosedCourseSalesRepr({
            courseType,
            accreditedBy: values.accreditedBy,
            residingCountry: values.residingCountry as WorldCountriesCodes,
            region: AwsRegions.Australia,
          })
        : false,
    [
      courseType,
      values.accreditedBy,
      values.courseLevel,
      values.residingCountry,
    ],
  )

  const courseHasManualPrice = useMemo(() => {
    if (!isAustraliaCountry(values.residingCountry)) {
      return true
    }
    return false
  }, [isAustraliaCountry, values.residingCountry])

  const courseWithNoPrice = useMemo(() => {
    return isCourseWithNoPrice({
      courseType,
      blendedLearning: Boolean(values.blendedLearning),
    })
  }, [courseType, values.blendedLearning])

  /**
   * flag to display Finance Section for CLOSED courses
   * it shows following fields: priceCurrency, price & includeVAT
   */
  const showCLOSEDcourseFinanceSection = useMemo(() => {
    return (
      isICM &&
      isClosedCourse &&
      (showFinanceSection || showClosedCourseSalesRepr || courseHasManualPrice)
    )
  }, [
    isICM,
    isClosedCourse,
    showFinanceSection,
    showClosedCourseSalesRepr,
    courseHasManualPrice,
  ])

  // flag to display Finance Section for OPEN courses
  const showOPENcourseFinanceSection = useMemo(() => {
    return isICM && isOpenCourse && showFinanceSection
  }, [isICM, isOpenCourse, showFinanceSection])

  const coursePrice = useCoursePrice({
    accreditedBy: values.accreditedBy,
    startDateTime: values.startDateTime ?? null,
    residingCountry:
      (values.residingCountry as WorldCountriesCodes) ??
      Countries_Code.AUSTRALIA,
    courseType,
    courseLevel: values.courseLevel as Course_Level_Enum,
    reaccreditation: values.reaccreditation,
    blended: values.blendedLearning,
    maxParticipants: values.maxParticipants,
  })

  const courseResidingCountry = Countries_Code.AUSTRALIA

  useEffectOnce(() => {
    setValue(
      'residingCountry',
      courseInput?.residingCountry ?? courseResidingCountry,
    )

    if (isCreation && !isNewZealandCountry(courseInput?.residingCountry)) {
      setValue('includeVAT', true)
    }
  })

  // this sets the course price for UK residing countries
  // based on its Type, LEVEL and blended & reaccreditation status
  useEffect(() => {
    if (isCreation && isAustraliaCountry(values.residingCountry) && isICM) {
      setValue('price', coursePrice?.priceAmount)
      setValue('priceCurrency', coursePrice?.priceCurrency)
    }

    if (
      isCreation &&
      isClosedCourse &&
      !isAustraliaCountry(values.residingCountry)
    ) {
      resetField('price')
    }
  }, [
    isCreation,
    isICM,
    setValue,
    resetField,
    isClosedCourse,
    isAustraliaCountry,
    values.residingCountry,
    coursePrice?.priceAmount,
    coursePrice?.priceCurrency,
  ])

  useEffect(() => {
    setValue('priceCurrency', defaultCurrency)
  }, [defaultCurrency, setValue])

  useEffect(() => {
    if (!isCreation && courseType !== Course_Type_Enum.Indirect) {
      allowCourseEditWithoutScheduledPrice(
        courseHasManualPrice ||
          (!courseHasManualPrice && Boolean(coursePrice)) ||
          courseWithNoPrice,
      )
    }
  }, [
    isCreation,
    coursePrice,
    courseHasManualPrice,
    allowCourseEditWithoutScheduledPrice,
    courseWithNoPrice,
    courseType,
  ])
  useEffect(() => {
    if (!isCreation) {
      trigger('maxParticipants')
      if (!trainerRatioNotMet) clearErrors('maxParticipants')
    }
  }, [trainerRatioNotMet, clearErrors, trigger, isCreation])

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
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    )

    if (elements.length > 0) {
      const errorElement = elements[0]
      if (!errorElement?.scrollIntoView) return
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })

  useEffect(() => {
    if (values.courseLevel === Course_Level_Enum.BildRegular) {
      setValue('conversion', false)
    }
  }, [values.courseLevel, setValue])

  useEffect(() => {
    if (isCreation) {
      if (isNewZealandCountry(values.residingCountry)) {
        setValue('includeVAT', false)
      } else {
        setValue('includeVAT', true)
      }
    }
  }, [isCreation, values.residingCountry, isNewZealandCountry, setValue])

  // ----------- To Be deleted after 30/04/2025 ----------------
  useEffect(() => {
    if (!isCreation || !waRenewalCyclesEnabled || !waId?.wa_id) return
    if (
      values.type === Course_Type_Enum.Indirect &&
      (values.organization?.id === waId.wa_id ||
        values.organization?.main_organisation?.id)
    ) {
      setValue(
        'renewalCycle',
        WARenewalCycles[values.courseLevel as WaRenewalCycleLevels],
      )
    }
  }, [
    values.courseLevel,
    values.organization,
    values.type,
    waRenewalCyclesEnabled,
    waId,
    isCreation,
    setValue,
  ])
  // -----------------------------------------------------------
  return (
    <form>
      <FormProvider {...methods}>
        <Stack gap={6}>
          <GeneralDetailsSection
            disabledFields={disabledFields}
            isCreation={isCreation}
            withBILD={false}
          />

          {enableIndirectCourseResourcePacks &&
          courseType === Course_Type_Enum.Indirect ? (
            <ResourcePacksTypeSection disabledFields={disabledFields} />
          ) : null}

          <AttendeesSection
            disabledFields={disabledFields}
            isCreation={isCreation}
          />

          {isClosedCourse && !hideMCM ? (
            <CourseMaterialsSection isCreation={isCreation} />
          ) : null}

          {/* For level 1 BS this input is hidden from UI, however it is set when we are sending request to create course*/}
          {startDate &&
          values.courseLevel &&
          hasRenewalCycle({
            courseType,
            startDate,
            courseLevel: values.courseLevel as Course_Level_Enum,
            isAustralia: true,
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
                values.residingCountry ?? Countries_Code.AUSTRALIA
              }
              salesRepresentative={values.salesRepresentative}
              accountCode={values.accountCode}
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
