import { InputAdornment } from '@mui/material'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import { merge } from 'lodash-es'
import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TransferFeeType } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { TransferModeEnum } from '@app/pages/TransferParticipant/components/TransferParticipantProvider'
import { yup } from '@app/schemas'
import theme from '@app/theme'
import { customFeeFormat } from '@app/util'

export const schema = yup.object({
  feeType: yup
    .mixed<TransferFeeType>()
    .oneOf(Object.values(TransferFeeType))
    .required(),
  customFee: yup
    .number()
    .min(0)
    .max(9999.99)
    .nullable()
    .transform(v => (isNaN(v) ? null : v))
    .when('feeType', {
      is: (value: TransferFeeType) => value === TransferFeeType.CustomFee,
      then: schema => schema.required(),
    }),
})

export type FormValues = yup.InferType<typeof schema>
type Props = {
  mode?: TransferModeEnum
  optionLabels?: Partial<Record<TransferFeeType, string>>
}

export const FeesForm: React.FC<React.PropsWithChildren<Props>> = ({
  mode = TransferModeEnum.ADMIN_TRANSFERS,
  children,
  optionLabels,
}) => {
  const { t, _t } = useScopedTranslation('components.fees-form')

  const defaultLabels: Record<TransferFeeType, string> = {
    [TransferFeeType.ApplyTerms]: t('apply-terms-option'),
    [TransferFeeType.CustomFee]: t('custom-fee-option'),
    [TransferFeeType.Free]: t('no-fee-option'),
  }

  const resolvedLabels = merge(defaultLabels, optionLabels)

  const orgAdminMode = mode === TransferModeEnum.ORG_ADMIN_TRANSFERS

  const { watch, control, register, formState, setValue } =
    useFormContext<FormValues>()

  const formValues = watch()

  useEffect(() => {
    if (formValues.customFee)
      setValue('customFee', customFeeFormat(formValues.customFee))
  }, [setValue, formValues.customFee])

  return (
    <>
      {!orgAdminMode ? (
        <Controller
          control={control}
          name="feeType"
          render={({ field }) => (
            <FormControl {...field}>
              <FormLabel
                id="fees-radio-group-label"
                focused={false}
                sx={{ fontWeight: 600, color: theme.palette.secondary.main }}
              >
                {t('fees-radio-group-title')}
              </FormLabel>
              <RadioGroup
                aria-labelledby="fees-radio-group-label"
                name="fees-radio-group"
                row
              >
                <FormControlLabel
                  value={TransferFeeType.ApplyTerms}
                  control={<Radio />}
                  label={resolvedLabels[TransferFeeType.ApplyTerms]}
                  sx={{ color: theme.palette.dimGrey.main }}
                  data-testid="applyTerms-radio-button"
                />
                <FormControlLabel
                  value={TransferFeeType.CustomFee}
                  control={<Radio />}
                  label={resolvedLabels[TransferFeeType.CustomFee]}
                  sx={{ color: theme.palette.dimGrey.main }}
                  data-testid="customFee-radio-button"
                />
                <FormControlLabel
                  value={TransferFeeType.Free}
                  control={<Radio />}
                  label={resolvedLabels[TransferFeeType.Free]}
                  sx={{ color: theme.palette.dimGrey.main }}
                  data-testid="noFee-radio-button"
                />
              </RadioGroup>
            </FormControl>
          )}
        ></Controller>
      ) : null}

      {formValues.feeType === TransferFeeType.ApplyTerms ? (
        <Box mt={2}>{children}</Box>
      ) : null}

      {formValues.feeType === TransferFeeType.CustomFee ? (
        <Box mt={2}>
          <TextField
            type={'number'}
            fullWidth
            variant="filled"
            label={t('custom-fee-label')}
            error={Boolean(formState.errors.customFee?.message)}
            helperText={
              Boolean(formState.errors.customFee?.message) &&
              _t('common.validation-errors.min-max-num-value', {
                min: 0,
                max: 9999.99,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">£</InputAdornment>
              ),
            }}
            {...register('customFee', { valueAsNumber: true })}
          />
        </Box>
      ) : null}
    </>
  )
}
