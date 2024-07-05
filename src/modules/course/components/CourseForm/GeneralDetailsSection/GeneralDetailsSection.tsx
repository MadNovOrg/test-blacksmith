import {
  Alert,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  InputAdornment,
  TextField,
  useTheme,
  FormControlLabel,
  Divider,
  Switch,
  RadioGroup,
  Radio,
  FormHelperText,
} from '@mui/material'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useEffect, useMemo } from 'react'
import { useFormContext, Controller, useWatch } from 'react-hook-form'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { CountryDropdown } from '@app/components/CountryDropdown'
import { InfoPanel } from '@app/components/InfoPanel'
import { RegionDropdown } from '@app/components/RegionDropdown'
import { VenueSelector } from '@app/components/VenueSelector'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { type CourseInput } from '@app/types'

import { type DisabledFields } from '..'
import { InstructionAccordionField } from '../components/AccordionTextField'
import { CourseLevelDropdown } from '../components/CourseLevelDropdown'
import { StrategyToggles } from '../components/StrategyToggles/StrategyToggles'
import { Countries_Code } from '../helpers'
import { useCourseFormEffects } from '../hooks/useCourseFormEffects'
import { useCoursePermissions } from '../hooks/useCoursePermissions'
import { useSpecialInstructions } from '../hooks/useSpecialInstructions'

import { CourseDatesSubSection } from './CourseDatesSubSection'
import { OrganizationSubSection } from './OrganizationSubSection'

type Props = {
  disabledFields: Set<DisabledFields>
  isCreation?: boolean
}

export const GeneralDetailsSection = ({
  disabledFields,
  isCreation,
}: Props) => {
  const { acl, profile } = useAuth()
  const theme = useTheme()
  const { getLabel: getCountryLabel, isUKCountry } = useWorldCountries()
  const {
    register,
    control,
    setValue,
    trigger,
    resetField,
    formState: { errors },
  } = useFormContext<CourseInput>()
  const { changeCountryOnCourseLevelChange } = useCourseFormEffects()
  const { t, _t } = useScopedTranslation('components.course-form')
  const foundationTrainerPlusLevelEnabled = useFeatureFlagEnabled(
    'foundation-trainer-plus-course',
  )
  const levelOneBSEnabled = useFeatureFlagEnabled('level-one-bs')

  const BSor3DaySRTEnabled =
    foundationTrainerPlusLevelEnabled || levelOneBSEnabled
  const isResidingCountryEnabled = !!useFeatureFlagEnabled(
    'course-residing-country',
  )

  const isInternationalIndirectEnabled = !!useFeatureFlagEnabled(
    'international-indirect',
  )

  const courseType = useWatch({ control, name: 'type' }) as Course_Type_Enum
  const accreditedBy = useWatch({ control, name: 'accreditedBy' })
  const residingCountry = useWatch({ control, name: 'residingCountry' })
  const deliveryType = useWatch({ control, name: 'deliveryType' })
  const courseLevel = useWatch({ control, name: 'courseLevel' })
  const reaccreditation = useWatch({ control, name: 'reaccreditation' })
  const conversion = useWatch({ control, name: 'conversion' })
  const bildStrategies = useWatch({ control, name: 'bildStrategies' })
  const blendedLearning = useWatch({ control, name: 'blendedLearning' })
  const displayOnWebsite = useWatch({ control, name: 'displayOnWebsite' })
  const venue = useWatch({ control, name: 'venue' })
  const [aolCountry, aolRegion] = useWatch({
    control,
    name: ['aolCountry', 'aolRegion'],
  })

  const isIndirectCourse = courseType === Course_Type_Enum.Indirect
  const isBild = accreditedBy === Accreditors_Enum.Bild
  const isOpenCourse = courseType === Course_Type_Enum.Open
  const isVirtualCourse = deliveryType === Course_Delivery_Type_Enum.Virtual
  const isL1BS = courseLevel === Course_Level_Enum.Level_1Bs
  const hasVenue = [
    Course_Delivery_Type_Enum.F2F,
    Course_Delivery_Type_Enum.Mixed,
  ].includes(deliveryType)
  const shouldShowAOL =
    isIndirectCourse && isUKCountry(residingCountry) && !isBild
  const usesAOL =
    useWatch({ control, name: 'usesAOL' }) && shouldShowAOL && !isL1BS

  const shouldShowCountrySelector =
    isResidingCountryEnabled &&
    !isBild &&
    (!isIndirectCourse || (isIndirectCourse && isInternationalIndirectEnabled))

  const {
    canBlended,
    canF2F,
    canMixed,
    canReacc,
    canVirtual,
    allowUseAOL,
    conversionEnabled,
  } = useCoursePermissions({
    type: courseType,
    deliveryType,
    courseLevel,
    blendedLearning,
    bildStrategies,
    conversion,
    reaccreditation,
    accreditedBy,
  })

  const { defaultSpecialInstructions, resetSpecialInstructionsToDefault } =
    useSpecialInstructions({
      courseType,
      courseLevel: courseLevel as Course_Level_Enum,
      deliveryType,
      conversion,
      isCreation,
      reaccreditation,
      setValue,
    })

  const hasSpecialInstructions = [
    Course_Delivery_Type_Enum.F2F,
    Course_Delivery_Type_Enum.Mixed,
  ].includes(deliveryType)

  const disableBlended = useMemo(() => {
    return (
      isIndirectCourse &&
      isInternationalIndirectEnabled &&
      !isUKCountry(residingCountry)
    )
  }, [
    isInternationalIndirectEnabled,
    isIndirectCourse,
    isUKCountry,
    residingCountry,
  ])

  useEffect(() => {
    const mustChange = !canBlended && blendedLearning
    mustChange && setValue('blendedLearning', false)
  }, [canBlended, setValue, blendedLearning])

  useEffect(() => {
    const mustChange = !canReacc && reaccreditation
    if (mustChange) {
      const newReaccreditationValue = false
      setValue('reaccreditation', newReaccreditationValue)
      resetSpecialInstructionsToDefault({
        newCourseReacc: newReaccreditationValue,
      })
    }
  }, [canReacc, reaccreditation, resetSpecialInstructionsToDefault, setValue])

  const disableCountrySelector = useMemo(() => {
    return (
      isIndirectCourse &&
      isInternationalIndirectEnabled &&
      !isCreation &&
      acl.isTrainer()
    )
  }, [acl, isCreation, isIndirectCourse, isInternationalIndirectEnabled])
  useEffect(() => {
    if (
      isInternationalIndirectEnabled &&
      acl.isTrainer() &&
      isCreation &&
      isIndirectCourse &&
      !!profile?.countryCode
    ) {
      setValue('residingCountry', profile?.countryCode)
    }
  }, [
    acl,
    isCreation,
    isIndirectCourse,
    isInternationalIndirectEnabled,
    profile?.countryCode,
    setValue,
  ])

  useEffect(() => {
    const isMixed = deliveryType === Course_Delivery_Type_Enum.Mixed
    const mustChange = !canMixed && isMixed
    if (mustChange) {
      const newDeliveryType = Course_Delivery_Type_Enum.F2F
      setValue('deliveryType', newDeliveryType)
      resetSpecialInstructionsToDefault({
        newCourseDeliveryType: newDeliveryType,
      })
    }
  }, [canMixed, deliveryType, resetSpecialInstructionsToDefault, setValue])

  const handleResidingCountryChange = (code: string) => {
    setValue('residingCountry', code, {
      shouldValidate: true,
    })
    setValue('venue', null)
    if (code && isUKCountry(code)) {
      setValue('aolCountry', code, { shouldValidate: true })
    } else {
      setValue('aolCountry', null)
      setValue('usesAOL', false)
    }
  }

  const handleAOLCountryChange = (code: string) => {
    setValue('aolCountry', code, { shouldValidate: true })
    if (code) {
      setValue('residingCountry', code, {
        shouldValidate: true,
      })
      setValue('venue', null)
    }
  }

  useEffect(() => {
    if (disableBlended)
      setValue('blendedLearning', false, { shouldValidate: true })
  }, [disableBlended, setValue])

  return (
    <InfoPanel
      title={t('general-details-title')}
      titlePosition="outside"
      renderContent={(content, props) => (
        <Box {...props} p={3} pt={4}>
          {content}
        </Box>
      )}
    >
      <Box mb={2}>
        {acl.canCreateBildCourse(courseType) ? (
          <FormControl variant="filled" sx={{ mb: theme.spacing(2) }} fullWidth>
            <InputLabel id="course-category-label">
              {_t('course-category')}
            </InputLabel>
            <Controller
              name="accreditedBy"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id={'course-category'}
                  onChange={e => {
                    setValue('usesAOL', false)
                    setValue('aolCountry', '')
                    setValue('aolRegion', '')
                    setValue('price', null)
                    setValue('priceCurrency', undefined)
                    setValue('includeVAT', null)

                    resetField('bildStrategies')

                    if (e.target.value === Accreditors_Enum.Bild) {
                      setValue('residingCountry', 'GB-ENG')
                    }
                    setValue('venue', null)

                    resetSpecialInstructionsToDefault({
                      newCourseType: e.target.value as Course_Type_Enum,
                    })

                    field.onChange(e)
                  }}
                  labelId="course-category-label"
                  disabled={disabledFields.has('accreditedBy')}
                >
                  <MenuItem
                    value={`${Accreditors_Enum.Icm}`}
                    data-testid={`course-category-option-${Accreditors_Enum.Icm}`}
                  >
                    ICM
                  </MenuItem>
                  <MenuItem
                    value={`${Accreditors_Enum.Bild}`}
                    data-testid={`course-category-option-${Accreditors_Enum.Bild}`}
                  >
                    BILD
                  </MenuItem>
                </Select>
              )}
            />
          </FormControl>
        ) : null}

        {shouldShowAOL ? (
          <>
            <Typography mt={2} fontWeight={600}>
              {t('aol-title')}
            </Typography>
            <Alert severity="info" sx={{ mt: 1 }}>
              {t('aol-info')}
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
                  checked={usesAOL && !isL1BS}
                  disabled={
                    disabledFields.has('usesAOL') || isL1BS || !allowUseAOL
                  }
                  data-testid="aol-checkbox"
                />
              }
              label={t('aol-label')}
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
                      data-testid="aol-country-selector"
                    >
                      {isResidingCountryEnabled &&
                      isInternationalIndirectEnabled ? (
                        <CountriesSelector
                          required
                          onChange={(_, code) => {
                            handleAOLCountryChange(code ?? '')
                          }}
                          value={aolCountry}
                          label={_t('country')}
                          courseResidingCountry={residingCountry}
                          error={Boolean(errors.aolCountry?.message)}
                          helperText={errors.aolCountry?.message}
                          isBILDcourse={isBild}
                          courseType={courseType}
                          disabled={disableCountrySelector}
                        />
                      ) : (
                        <CountryDropdown
                          label={_t('country')}
                          errormessage={errors.aolCountry?.message}
                          required
                          register={register('aolCountry')}
                          value={aolCountry}
                          error={Boolean(errors.aolCountry?.message)}
                        />
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={12}>
                    <FormControl
                      variant="filled"
                      sx={{ mb: theme.spacing(2) }}
                      fullWidth
                    >
                      <RegionDropdown
                        required
                        {...register('aolRegion')}
                        value={aolRegion}
                        onChange={value => {
                          setValue('aolRegion', value, {
                            shouldValidate: true,
                          })
                        }}
                        usesAOL={usesAOL}
                        country={
                          (isResidingCountryEnabled &&
                          isInternationalIndirectEnabled
                            ? getCountryLabel(aolCountry)
                            : aolCountry) ?? ''
                        }
                        disabled={
                          !aolCountry || disabledFields.has('aolRegion')
                        }
                        error={Boolean(errors.aolRegion?.message)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Typography mt={5} fontWeight={600}>
                  {t('course-cost')}
                </Typography>
                <Typography mb={1} variant="body2">
                  {t('course-cost-disclaimer')}
                </Typography>
                <TextField
                  type={'number'}
                  {...register('courseCost')}
                  variant="filled"
                  placeholder={t('course-cost-placeholder')}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">£</InputAdornment>
                    ),
                  }}
                  label={t('course-cost-title')}
                  error={Boolean(errors.courseCost)}
                  required={usesAOL}
                  helperText={errors.courseCost?.message ?? ''}
                  disabled={disabledFields.has('courseCost')}
                />
              </>
            ) : null}
          </>
        ) : null}

        <OrganizationSubSection disabledFields={disabledFields} />

        <Typography mb={2} fontWeight={600}>
          {t('course-level-section-title')}
        </Typography>
        <FormControl variant="filled" sx={{ mb: theme.spacing(2) }} fullWidth>
          <InputLabel id="course-level-dropdown">
            {t('course-level-placeholder')}
          </InputLabel>
          <Controller
            name="courseLevel"
            control={control}
            render={({ field }) => (
              <CourseLevelDropdown
                {...register('courseLevel')}
                value={field.value as Course_Level_Enum}
                labelId="course-level-dropdown"
                onChange={event => {
                  const newCourseLevel = event.target.value as Course_Level_Enum
                  if (newCourseLevel === courseLevel) return
                  const countryToChangeTo = changeCountryOnCourseLevelChange(
                    newCourseLevel,
                    residingCountry,
                  )
                  field.onChange(event)
                  BSor3DaySRTEnabled &&
                    setValue('residingCountry', countryToChangeTo)
                  setValue(
                    'aolCountry',
                    countryToChangeTo ??
                      Countries_Code.DEFAULT_RESIDING_COUNTRY,
                  )
                  resetSpecialInstructionsToDefault({
                    newCourseLevel,
                  })
                }}
                courseType={courseType}
                courseAccreditor={accreditedBy ?? Accreditors_Enum.Icm}
                disabled={disabledFields.has('courseLevel')}
              />
            )}
          />
          {courseLevel === Course_Level_Enum.Level_1 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('course-level-one-info')}
            </Alert>
          )}
          {errors.courseLevel?.message ? (
            <FormHelperText error>{errors.courseLevel.message}</FormHelperText>
          ) : null}
          {/* TODO: Delete this after Arlo migration to the hub - HAVENT USED THE translations file to have this easier to find by text search */}
          {acl.isInternalUser() && !isIndirectCourse ? (
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
        </FormControl>

        {isBild ? (
          <>
            <StrategyToggles
              courseLevel={courseLevel}
              disabled={disabledFields.has('bildStrategies')}
              isConversion={conversion}
            />
            <FormHelperText error={Boolean(errors.bildStrategies?.message)}>
              {t('select-one-option')}
            </FormHelperText>
          </>
        ) : null}

        <Divider sx={{ my: 2 }} />

        <Grid gap={2} container>
          <Grid item>
            <Controller
              name="blendedLearning"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  disabled={
                    !canBlended ||
                    disableBlended ||
                    disabledFields.has('blendedLearning')
                  }
                  control={
                    <Switch
                      {...field}
                      checked={blendedLearning}
                      data-testid="blendedLearning-switch"
                    />
                  }
                  label={t('blended-learning-label')}
                />
              )}
            />
          </Grid>

          <Grid item>
            <Controller
              name="reaccreditation"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  disabled={!canReacc || disabledFields.has('reaccreditation')}
                  control={
                    <Switch
                      {...field}
                      checked={reaccreditation}
                      data-testid="reaccreditation-switch"
                    />
                  }
                  label={t('reaccreditation-label')}
                />
              )}
            />
          </Grid>

          {isBild &&
          [Course_Type_Enum.Closed, Course_Type_Enum.Open].includes(
            courseType,
          ) &&
          courseLevel !== Course_Level_Enum.BildRegular ? (
            <Grid item>
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
                        checked={conversion}
                        data-testid="conversion-switch"
                      />
                    }
                    label={t('conversion-label')}
                  />
                )}
              />
            </Grid>
          ) : null}

          {isOpenCourse ? (
            <Grid item>
              <Controller
                name="displayOnWebsite"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    disabled={disabledFields.has('displayOnWebsite')}
                    control={
                      <Switch
                        {...field}
                        checked={displayOnWebsite}
                        data-testid="displayOnWebsite-switch"
                      />
                    }
                    label={t('display-toggle-label')}
                  />
                )}
              />
            </Grid>
          ) : null}
        </Grid>

        {blendedLearning && isIndirectCourse ? (
          <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
            {t('blended-learning-price-label')}
          </Alert>
        ) : null}

        {shouldShowCountrySelector ? (
          <FormControl
            fullWidth
            sx={{ my: theme.spacing(2) }}
            data-testid="residing-country-selector"
          >
            <CountriesSelector
              onChange={(_, code) => {
                handleResidingCountryChange(code ?? '')
              }}
              value={residingCountry}
              label={t('residing-country')}
              error={Boolean(errors.residingCountry?.message)}
              helperText={errors.residingCountry?.message}
              isBILDcourse={isBild}
              courseType={courseType}
              disabled={disableCountrySelector}
            />
          </FormControl>
        ) : null}
        <Typography mb={2} mt={2} fontWeight={600}>
          {t('delivery-type-section-title')}
        </Typography>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="delivery-type-radio"
            name="delivery-type-radio"
            value={deliveryType}
            onChange={e => {
              const deliveryType = e.target.value as Course_Delivery_Type_Enum
              setValue('deliveryType', deliveryType)

              if (isVirtualCourse) {
                setValue('parkingInstructions', '')
              }
              trigger(['venue'])

              resetSpecialInstructionsToDefault({
                newCourseDeliveryType: deliveryType,
              })
            }}
          >
            <FormControlLabel
              value={Course_Delivery_Type_Enum.F2F}
              control={
                <Radio
                  disabled={!canF2F || disabledFields.has('deliveryType')}
                />
              }
              label={t('f2f-option-label')}
              data-testid={`delivery-${Course_Delivery_Type_Enum.F2F}`}
            />
            <FormControlLabel
              value={Course_Delivery_Type_Enum.Virtual}
              control={
                <Radio
                  disabled={!canVirtual || disabledFields.has('deliveryType')}
                />
              }
              label={t('virtual-option-label')}
              data-testid={`delivery-${Course_Delivery_Type_Enum.Virtual}`}
            />
            <FormControlLabel
              value={Course_Delivery_Type_Enum.Mixed}
              control={
                <Radio
                  disabled={!canMixed || disabledFields.has('deliveryType')}
                />
              }
              label={t('mixed-option-label')}
              data-testid={`delivery-${Course_Delivery_Type_Enum.Mixed}`}
            />
          </RadioGroup>
        </FormControl>

        {hasVenue ? (
          <VenueSelector
            isBILDcourse={isBild}
            courseType={courseType}
            courseResidingCountry={
              isIndirectCourse && !isInternationalIndirectEnabled
                ? 'GB-ENG'
                : residingCountry
            }
            {...register('venue')}
            onChange={venue => {
              return setValue('venue', venue ?? null, {
                shouldValidate: true,
              })
            }}
            value={venue ?? undefined}
            textFieldProps={{
              variant: 'filled',
              error: Boolean(errors.venue),
              required: deliveryType !== Course_Delivery_Type_Enum.Virtual,
            }}
          />
        ) : null}

        <Controller
          name="specialInstructions"
          control={control}
          render={({ field }) => (
            <InstructionAccordionField
              title={t('special-instructions.title')}
              subtitle={
                <Alert
                  severity="info"
                  sx={{
                    mt: 2,
                  }}
                >
                  {t('special-instructions.subtitle')}
                </Alert>
              }
              confirmResetTitle={t('special-instructions.modal-title')}
              confirmResetMessage={t('special-instructions.modal-message')}
              data-testid="course-form-special-instructions"
              defaultValue={defaultSpecialInstructions}
              value={field.value}
              onSave={field.onChange}
              editMode={false}
              maxLength={2000}
            />
          )}
        />
        {hasSpecialInstructions ? (
          <Controller
            name="parkingInstructions"
            control={control}
            render={({ field }) => (
              <InstructionAccordionField
                title={t('parking-instructions.title')}
                confirmResetTitle={t('parking-instructions.modal-title')}
                confirmResetMessage={t('parking-instructions.modal-message')}
                data-testid="course-form-parking-instructions"
                value={field.value}
                onSave={field.onChange}
                editMode={false}
                maxLength={1000}
              />
            )}
          />
        ) : null}
        <CourseDatesSubSection isCreation={isCreation} />
      </Box>
    </InfoPanel>
  )
}
