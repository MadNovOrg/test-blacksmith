import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material'
import Big from 'big.js'
import { t } from 'i18next'
import React, { useMemo } from 'react'
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from 'react-hook-form'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import CurrencySelector, {
  defaultCurrency,
} from '@app/components/CurrencySelector'
import { InfoRow } from '@app/components/InfoPanel'
import { Course_Level_Enum } from '@app/generated/graphql'
import { CourseInput } from '@app/types'

import { DisabledFields } from '../index'

interface Props {
  isCreateCourse: boolean
  courseLevel?: Course_Level_Enum
  isBlended?: boolean
  errors: FieldErrors<CourseInput>
  price?: number | null
  priceCurrency?: string
  includeVAT?: boolean | null
  residingCountry?: string
  disabledFields: Set<DisabledFields>
  register: UseFormRegister<CourseInput>
  control?: Control<CourseInput>
}

const FinancePricingSection: React.FC<React.PropsWithChildren<Props>> = ({
  isCreateCourse,
  courseLevel,
  isBlended,
  errors,
  price,
  priceCurrency,
  residingCountry,
  includeVAT,
  disabledFields,
  register,
  control,
}) => {
  const { isUKCountry } = useWorldCountries()
  const isLevel2 = courseLevel === Course_Level_Enum.Level_2

  const disabledVATandCurrency = useMemo(() => {
    if (!isCreateCourse) {
      return true
    }
    if (
      isCreateCourse &&
      isLevel2 &&
      isBlended &&
      isUKCountry(residingCountry)
    ) {
      return true
    }

    return false
  }, [isBlended, isCreateCourse, isLevel2, isUKCountry, residingCountry])

  // these fields are only shown for International Courses
  const showCurrencyAndVATfields = useMemo(
    () => !isUKCountry(residingCountry),
    [isUKCountry, residingCountry]
  )

  return (
    <>
      <Grid container spacing={2} mt={0}>
        {showCurrencyAndVATfields ? (
          <Grid item md={6} sm={12}>
            <CurrencySelector
              {...register('priceCurrency')}
              error={Boolean(errors?.priceCurrency)}
              fullWidth
              helperText={errors?.priceCurrency?.message}
              value={priceCurrency ?? defaultCurrency}
              InputLabelProps={{ shrink: true }}
              disabled={disabledVATandCurrency}
            />
          </Grid>
        ) : null}

        <Grid item md={showCurrencyAndVATfields ? 6 : 12} sm={12}>
          <TextField
            {...register('price')}
            value={price}
            error={Boolean(errors?.price)}
            fullWidth
            helperText={errors?.price?.message ?? ''}
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

        {showCurrencyAndVATfields ? (
          <Grid container item md={12} sm={12} alignSelf={'center'}>
            <Controller
              name="includeVAT"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={
                        Boolean(includeVAT) || isUKCountry(residingCountry)
                      }
                      disabled={disabledVATandCurrency}
                      data-testid="includeVAT-switch"
                    />
                  }
                  label={t('vat')}
                />
              )}
            />
          </Grid>
        ) : null}
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
    </>
  )
}

export default FinancePricingSection
