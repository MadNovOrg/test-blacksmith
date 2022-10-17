import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import React, { memo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { InfoPanel } from '@app/components/InfoPanel'
import { TransferFeeType } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { yup } from '@app/schemas'
import theme from '@app/theme'

import { TransferTermsTable } from '../TransferTermsTable'

const formSchema = yup.object({
  feeType: yup
    .mixed<TransferFeeType>()
    .oneOf(Object.values(TransferFeeType))
    .required(),
  customFee: yup
    .number()
    .nullable(true)
    .transform(v => (isNaN(v) ? null : v))
    .when('feeType', {
      is: (value: TransferFeeType) => value === TransferFeeType.CustomFee,
      then: schema => schema.required(),
    }),
})

export type FormValues = yup.InferType<typeof formSchema>
type Props = {
  courseStartDate: Date
  onChange?: (values: FormValues, isValid: boolean) => void
}

const FeesPanel: React.FC<Props> = ({ courseStartDate, onChange }) => {
  const { t } = useScopedTranslation(
    'pages.transfer-participant.transfer-details'
  )

  const { watch, control, register, formState } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
  })

  const formValues = watch()

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(formValues, formState.isValid)
    }
  }, [formValues, formState.isValid, onChange])

  return (
    <Box>
      <InfoPanel titlePosition="inside">
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
                  label={t('apply-terms-option')}
                  sx={{ color: theme.palette.dimGrey.main }}
                />
                <FormControlLabel
                  value={TransferFeeType.CustomFee}
                  control={<Radio />}
                  label={t('custom-fee-option')}
                  sx={{ color: theme.palette.dimGrey.main }}
                />
                <FormControlLabel
                  value={TransferFeeType.Free}
                  control={<Radio />}
                  label={t('no-fee-option')}
                  sx={{ color: theme.palette.dimGrey.main }}
                />
              </RadioGroup>
            </FormControl>
          )}
        ></Controller>

        {formValues.feeType === TransferFeeType.ApplyTerms ? (
          <Box mt={2}>
            <TransferTermsTable startDate={courseStartDate} />
          </Box>
        ) : null}

        {formValues.feeType === TransferFeeType.CustomFee ? (
          <Box mt={2}>
            <TextField
              fullWidth
              variant="filled"
              label={t('custom-fee-label')}
              error={Boolean(formState.errors.customFee?.message)}
              {...register('customFee')}
            />
          </Box>
        ) : null}
      </InfoPanel>
    </Box>
  )
}

export default memo(FeesPanel)
