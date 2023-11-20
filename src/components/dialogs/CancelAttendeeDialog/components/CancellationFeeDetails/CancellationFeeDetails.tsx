import {
  Alert,
  Box,
  FormControlLabel,
  FormHelperText,
  Link,
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
import { Trans, useTranslation } from 'react-i18next'

import { FormInput } from '@app/components/dialogs/CancelAttendeeDialog/types'
import { NumericTextField } from '@app/components/NumericTextField'
import { CancellationFeeType } from '@app/generated/graphql'
import { CancellationTermsTable } from '@app/pages/EditCourse/components/CancellationTermsTable'

type CancellationFeeDetailsProps = {
  feeType: CancellationFeeType
  startDate: string
  errors: FieldErrors<FormInput>
  register: (
    name: 'cancellationFeePercent' | 'cancellationFee',
    options?:
      | RegisterOptions<FormInput, 'cancellationFeePercent' | 'cancellationFee'>
      | undefined
  ) => UseFormRegisterReturn<'cancellationFeePercent' | 'cancellationFee'>

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
          <Typography variant="h4" fontWeight={600} mt={2}>
            {t('pages.edit-course.cancellation-modal.will-any-fees-apply')}
          </Typography>
          <RadioGroup
            onChange={(event, value: string) =>
              onSetFeeType?.(value as CancellationFeeType)
            }
            row
            value={feeType}
            sx={{ mt: 1, fontSize: '.5rem' }}
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
                label={
                  <Typography sx={{ fontSize: 15 }}>
                    {t(`pages.edit-course.cancellation-modal.${cancelFeeType}`)}
                  </Typography>
                }
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
          <Trans
            i18nKey="pages.course-details.request-cancellation-modal.warning"
            components={{
              termsOfBusinessLink: (
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={`${
                    import.meta.env.VITE_BASE_WORDPRESS_URL
                  }/terms-of-business/`}
                />
              ),
            }}
          />
        </Alert>
      )}

      {feeType === CancellationFeeType.ApplyCancellationTerms ? (
        <CancellationTermsTable
          courseStartDate={new Date(startDate)}
          sx={{ mt: 2 }}
        />
      ) : null}
      {feeType === CancellationFeeType.CustomFee ? (
        <NumericTextField
          required
          label={t('pages.edit-course.cancellation-modal.fee')}
          {...register('cancellationFee', { valueAsNumber: true })}
          error={Boolean(errors.cancellationFee)}
          helperText={
            Boolean(errors.cancellationFee) && errors?.cancellationFee?.message
          }
          InputProps={{
            endAdornment: (
              <React.Fragment>
                <Typography variant="body1" color="grey.600">
                  £
                </Typography>
              </React.Fragment>
            ),
          }}
          sx={{ mt: 2 }}
          inputProps={{ min: 0 }}
        />
      ) : null}
    </Box>
  )
}
