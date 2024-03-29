import { Box, Grid, TextField, Typography } from '@mui/material'
import Big from 'big.js'
import { t } from 'i18next'
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  Control,
  Controller,
} from 'react-hook-form'

import { defaultCurrency } from '@app/components/CurrencySelector'
import { InfoPanel, InfoRow } from '@app/components/InfoPanel'
import { ProfileSelector } from '@app/components/ProfileSelector'
import { FindProfilesQuery } from '@app/generated/graphql'
import { CourseInput, Profile, RoleName } from '@app/types'

import { SourceDropdown } from '../components/SourceDropdown'
import { DisabledFields } from '../index'

interface Props {
  showSalesRepr: boolean
  errors: FieldErrors<CourseInput>
  price?: number | null
  priceCurrency?: string
  includeVAT?: boolean | null
  salesRepresentative: Profile | null | FindProfilesQuery['profiles'][0]
  disabledFields: Set<DisabledFields>
  register: UseFormRegister<CourseInput>
  setValue: UseFormSetValue<CourseInput>
  control?: Control<CourseInput>
}

const BildCourseFinanceSection: React.FC<React.PropsWithChildren<Props>> = ({
  showSalesRepr,
  errors,
  price,
  priceCurrency,
  includeVAT,
  salesRepresentative,
  disabledFields,
  register,
  setValue,
  control,
}) => {
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
      {showSalesRepr && (
        <Grid container spacing={2}>
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
      )}

      <Grid item md={12} sm={12} mt={2}>
        <TextField
          {...register('price')}
          value={price}
          error={Boolean(errors.price)}
          fullWidth
          helperText={errors.price?.message ?? ''}
          label={t('components.course-form.price')}
          placeholder={t('components.course-form.price-placeholder')}
          required
          type={'number'}
          variant="filled"
          InputLabelProps={{ shrink: true }}
          data-testid="price-input"
          disabled={disabledFields.has('price')}
        />
      </Grid>
      <InfoRow>
        <Typography fontWeight={600}>
          {t('pages.order-details.total')}
        </Typography>
        <Typography fontWeight={600}>
          {t('currency', {
            amount:
              Number(price ?? 0) +
              (includeVAT
                ? new Big(((price ?? 0) * 20) / 100).round(2).toNumber()
                : 0),
            currency: priceCurrency ?? defaultCurrency,
          })}
        </Typography>
      </InfoRow>
    </InfoPanel>
  )
}

export default BildCourseFinanceSection
