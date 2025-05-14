import {
  Box,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { t } from 'i18next'
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  Control,
  Controller,
} from 'react-hook-form'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { InfoPanel } from '@app/components/InfoPanel'
import { ProfileSelector } from '@app/components/ProfileSelector'
import {
  Course_Level_Enum,
  Course_Type_Enum,
  FindProfilesQuery,
} from '@app/generated/graphql'
import {
  CourseInput,
  ClosedCoursePricingType,
  Profile,
  RoleName,
} from '@app/types'

import { DisabledFields } from '../..'
import { SourceDropdown } from '../SourceDropdown'

import FinancePricingSection from './FinancePricingSection'

interface Props {
  showPricingSection: boolean
  isCreateCourse: boolean
  courseLevel: Course_Level_Enum
  isBlended: boolean
  errors: FieldErrors<CourseInput>
  price?: number | null
  priceCurrency?: string
  includeVAT?: boolean | null
  residingCountry: string
  salesRepresentative: Profile | null | FindProfilesQuery['profiles'][0]
  accountCode?: string | null
  disabledFields: Set<DisabledFields>
  register: UseFormRegister<CourseInput>
  setValue: UseFormSetValue<CourseInput>
  control?: Control<CourseInput>
  values?: CourseInput
}

const ClosedCourseFinanceSection: React.FC<React.PropsWithChildren<Props>> = ({
  showPricingSection,
  isCreateCourse,
  courseLevel,
  isBlended,
  errors,
  price,
  priceCurrency,
  includeVAT,
  salesRepresentative,
  residingCountry,
  accountCode,
  disabledFields,
  register,
  setValue,
  control,
  values,
}) => {
  const { isUKCountry } = useWorldCountries()

  const shouldShowPricingTypeRadio =
    isUKCountry(residingCountry) && values?.type === Course_Type_Enum.Closed

  return (
    <InfoPanel
      title={t('components.course-form.finance-section-title')}
      titlePosition="outside"
      renderContent={(content, props) => (
        <Box {...props} p={3} pt={4}>
          {content}
        </Box>
      )}
    >
      <Grid container spacing={2}>
        {shouldShowPricingTypeRadio && (
          <Grid container px={2}>
            <RadioGroup
              onChange={event =>
                setValue(
                  'closedCoursePricingType',
                  event.target.value as ClosedCoursePricingType,
                )
              }
              sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
              defaultValue={values?.closedCoursePricingType}
            >
              <FormControlLabel
                disabled={!isCreateCourse}
                control={<Radio />}
                label={t('components.course-form.standard-pricing')}
                value={ClosedCoursePricingType.STANDARD}
              />
              <FormControlLabel
                disabled={!isCreateCourse}
                control={<Radio />}
                label={t('components.course-form.custom-pricing')}
                value={ClosedCoursePricingType.CUSTOM}
              />
            </RadioGroup>
          </Grid>
        )}

        <Grid item md={6} sm={12}>
          <Typography fontWeight={600}>
            {t('components.course-form.sales-rep-title')}
          </Typography>

          <ProfileSelector
            {...register('salesRepresentative')}
            roleName={RoleName.SALES_REPRESENTATIVE}
            value={salesRepresentative ?? undefined}
            onChange={profile => {
              setValue('salesRepresentative', profile ?? null, {
                shouldValidate: true,
              })
            }}
            textFieldProps={{
              variant: 'filled',
              label: t('components.course-form.sales-rep-placeholder'),
              required: true,
              error: Boolean(errors.salesRepresentative?.message),
              helperText:
                Boolean(errors.salesRepresentative?.message) &&
                t('components.course-form.sales-rep-error'),
            }}
            placeholder={t('components.course-form.sales-rep-placeholder')}
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

      {showPricingSection ? (
        <FinancePricingSection
          isCreateCourse={isCreateCourse}
          courseLevel={courseLevel}
          isBlended={isBlended}
          errors={errors}
          price={price}
          priceCurrency={priceCurrency}
          includeVAT={includeVAT}
          residingCountry={residingCountry}
          disabledFields={disabledFields}
          control={control}
          register={register}
          values={values}
        />
      ) : null}

      <Typography fontWeight={600} mb={1} mt={2}>
        {t('components.course-form.account-code-title')}
      </Typography>

      <Typography color="dimGrey.main">{accountCode}</Typography>
    </InfoPanel>
  )
}

export default ClosedCourseFinanceSection
