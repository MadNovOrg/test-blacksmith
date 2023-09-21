import {
  Alert,
  Box,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import React, { PropsWithChildren } from 'react'
import {
  FieldErrors,
  RegisterOptions,
  UseFormRegisterReturn,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericTextField } from '@app/components/NumericTextField'
import { CancellationTermsTable } from '@app/pages/EditCourse/components/CancellationTermsTable'

import { FormInput } from '../../types'

export enum CancellationFeeType {
  APPLY_CANCELLATION_TERMS = 'apply-cancellation-terms',
  CUSTOM_FEE = 'custom-fee',
  NO_FEES = 'no-fees',
}

type CancellationFeeDetailsProps = {
  feeType: CancellationFeeType
  startDate: string
  errors: FieldErrors<FormInput>
  register: (
    name: 'cancellationFeePercent',
    options?: RegisterOptions<FormInput, 'cancellationFeePercent'> | undefined
  ) => UseFormRegisterReturn<'cancellationFeePercent'>
  showEditFeePercent?: boolean
  onSetFeeType?: (value: CancellationFeeType) => void
}

export const CancellationFeeDetails: React.FC<
  PropsWithChildren<CancellationFeeDetailsProps>
> = ({
  feeType,
  startDate,
  errors,
  register,
  showEditFeePercent,
  onSetFeeType,
}) => {
  const { t } = useTranslation()

  return (
    <Box>
      {showEditFeePercent ? (
        <>
          <Typography variant="h4" fontWeight={600} mt={4}>
            {t('pages.edit-course.cancellation-modal.will-any-fees-apply')}
          </Typography>
          <RadioGroup
            onChange={(event, value: string) =>
              onSetFeeType?.(value as CancellationFeeType)
            }
            row
            value={feeType}
            sx={{ mt: 1 }}
          >
            {Object.values(CancellationFeeType).map(cancelFeeType => (
              <FormControlLabel
                data-testid={`${cancelFeeType}-radioButton`}
                key={cancelFeeType}
                value={cancelFeeType}
                control={
                  <Radio
                    sx={
                      !feeType && errors.cancellationFeePercent
                        ? {
                            color: 'error.main',
                            '&.Mui-checked': {
                              color: 'error.main',
                            },
                          }
                        : {}
                    }
                  />
                }
                label={t(
                  `pages.edit-course.cancellation-modal.${cancelFeeType}`
                )}
              />
            ))}
            {!feeType && errors.cancellationFeePercent ? (
              <FormHelperText error>
                {t('common.validation-errors.this-field-is-required')}
              </FormHelperText>
            ) : null}
          </RadioGroup>
        </>
      ) : (
        <Alert severity="warning" variant="outlined" sx={{ mt: 4 }}>
          {t('pages.course-details.request-cancellation-modal.warning')}
        </Alert>
      )}

      {feeType === CancellationFeeType.APPLY_CANCELLATION_TERMS ? (
        <CancellationTermsTable
          courseStartDate={new Date(startDate)}
          sx={{ mt: 4 }}
        />
      ) : null}
      {feeType === CancellationFeeType.CUSTOM_FEE ? (
        <NumericTextField
          required
          label={t('pages.edit-course.cancellation-modal.fee')}
          {...register('cancellationFeePercent', { valueAsNumber: true })}
          error={Boolean(errors.cancellationFeePercent)}
          helperText={
            Boolean(errors.cancellationFeePercent) &&
            t('common.validation-errors.this-field-is-required')
          }
          sx={{ mt: 2 }}
          inputProps={{ min: 0 }}
        />
      ) : null}
    </Box>
  )
}
