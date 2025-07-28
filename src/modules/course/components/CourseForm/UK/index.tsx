import { Stack } from '@mui/material'
import { isDate, isValid as isValidDate } from 'date-fns'
import React, { useEffect, useImperativeHandle, useMemo } from 'react'
import { Controller, FormProvider, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useUpdateEffect, useEffectOnce } from 'react-use'
import { noop } from 'ts-essentials'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Certificate_Status_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import {
  courseWithManualPrice,
  isCourseWithNoPrice,
} from '@app/modules/course/pages/CreateCourse/utils'
import { CourseInput, ClosedCoursePricingType } from '@app/types'

import { Props } from '..'
import { AttendeesSection } from '../components/AttendeesSection'
import { CourseMaterialsSection } from '../components/CourseMaterialsSection/UK'
import BildCourseFinanceSection from '../components/FormFinanceSection/BildCourseFinanceSection'
import ClosedCourseFinanceSection from '../components/FormFinanceSection/ClosedCourseFinanceSection'
import OpenCourseFinanceSection from '../components/FormFinanceSection/OpenCourseFinanceSection'
import { GeneralDetailsSection } from '../components/GeneralDetailsSection'
import { RenewalCycleRadios } from '../components/RenewalCycleRadios/RenewalCycleRadios'
import {
  Countries_Code,
  displayClosedCourseSalesRepr,
  getAccountCode,
  hasRenewalCycle,
  isEndDateTimeBeforeStartDateTime,
} from '../helpers'
import { useCourseCreationFormSchema } from '../hooks/useCourseCreationFormSchema'

export const UkCourseForm: React.FC<React.PropsWithChildren<Props>> = ({
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
  const { acl, profile } = useAuth()
  const { isUKCountry } = useWorldCountries()
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

  const isBild = values.accreditedBy === Accreditors_Enum.Bild
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
  const showInternationalFinanceSection = useMemo(
    () => !isUKCountry(values.residingCountry),
    [isUKCountry, values.residingCountry],
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
    ],
  )

  const courseHasManualPrice = useMemo(() => {
    return courseWithManualPrice({
      accreditedBy: values.accreditedBy as Accreditors_Enum,
      courseType,
      courseLevel: values.courseLevel as Course_Level_Enum,
      blendedLearning: values.blendedLearning,
      maxParticipants: values.maxParticipants ?? 0,
      residingCountry: values.residingCountry as WorldCountriesCodes,
      closedCourseWithManualPrice:
        isClosedCourse &&
        isUKCountry(values.residingCountry) &&
        values.closedCoursePricingType === ClosedCoursePricingType.CUSTOM,
    })
  }, [
    courseType,
    values.accreditedBy,
    values.blendedLearning,
    values.courseLevel,
    values.maxParticipants,
    values.residingCountry,
    values.closedCoursePricingType,
    isClosedCourse,
    isUKCountry,
  ])

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
    [isBild, isClosedCourse, isOpenCourse],
  )

  const hasBildCertificates = useMemo(
    () =>
      (profile?.certificates ?? [])
        .filter(
          certificate =>
            certificate.status === Certificate_Status_Enum.Active ||
            Certificate_Status_Enum.ExpiringSoon,
        )
        .map(certificate => certificate.courseLevel)
        .some(status =>
          [
            Course_Level_Enum.BildAdvancedTrainer,
            Course_Level_Enum.BildIntermediateTrainer,
            Course_Level_Enum.BildRegular,
          ].includes(status),
        ),
    [profile?.certificates],
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
    closedCoursePricingType: values.closedCoursePricingType,
  })

  const courseResidingCountry =
    acl.isTrainer() && profile?.countryCode
      ? profile?.countryCode
      : Countries_Code.DEFAULT_RESIDING_COUNTRY

  useEffectOnce(() => {
    setValue(
      'residingCountry',
      courseInput?.residingCountry ?? courseResidingCountry,
    )

    const UKcountry = isUKCountry(
      courseInput?.residingCountry ?? courseResidingCountry,
    )

    if (isCreation && UKcountry) {
      setValue('includeVAT', true)
    }
  })

  // this sets the course price for UK residing countries
  // based on its Type, LEVEL and blended & reaccreditation status
  useEffect(() => {
    if (
      isCreation &&
      isUKCountry(values.residingCountry) &&
      courseInput?.closedCoursePricingType !== ClosedCoursePricingType.CUSTOM &&
      isICM
    ) {
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
    courseInput?.closedCoursePricingType,
  ])

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
            withBILD={
              hasBildCertificates ||
              acl.isTTAdmin() ||
              acl.isTTOps() ||
              acl.isSalesAdmin()
            }
          />
          <AttendeesSection
            disabledFields={disabledFields}
            isCreation={isCreation}
          />

          {isClosedCourse ? (
            <CourseMaterialsSection isCreation={isCreation} />
          ) : null}

          {/* For level 1 BS this input is hidden from UI, however it is set when we are sending request to create course*/}
          {startDate &&
          values.courseLevel &&
          hasRenewalCycle({
            courseType,
            startDate,
            courseLevel: values.courseLevel as Course_Level_Enum,
            isAustralia: false,
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
              values={values}
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
