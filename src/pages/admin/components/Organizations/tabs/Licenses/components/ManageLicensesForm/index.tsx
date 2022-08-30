import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { yup } from '@app/schemas'

enum FormType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export type FormData = {
  amount: string
  invoiceId?: string
  note?: string
  type: FormType
}

type Props = {
  onSave?: (data: FormData) => void
  onCancel?: () => void
  currentBalance: number
}

export const ManageLicensesForm: React.FC<Props> = ({
  onSave,
  onCancel,
  currentBalance,
}) => {
  const { t } = useScopedTranslation('pages.org-details.tabs.licenses.form')

  const schema = useMemo(
    () =>
      yup.object({
        type: yup.mixed().oneOf(['ADD', 'REMOVE']),
        amount: yup
          .number()
          .typeError(t('error-amount-positive'))
          .positive(t('error-amount-positive'))
          .required(t('erorr-amount-required')),
        note: yup.string(),
        invoiceId: yup.string().required(t('error-invoice-required')),
      }),
    [t]
  )

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      type: FormType.ADD,
      amount: '',
      invoiceId: '',
      note: '',
    },
  })

  const values = watch()

  const submit: SubmitHandler<FormData> = data => {
    if (typeof onSave === 'function') {
      onSave(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field}>
            <FormControlLabel
              value="ADD"
              control={<Radio />}
              label={t('add-radio-button-label')}
            />
            <FormControlLabel
              value="REMOVE"
              control={<Radio />}
              label={t('remove-radio-button-label')}
            />
          </RadioGroup>
        )}
      />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            {...register('amount')}
            label={t('amount-label')}
            fullWidth
            variant="filled"
            helperText={errors.amount?.message}
            error={Boolean(errors.amount?.message)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...register('invoiceId')}
            label={t('invoice-label')}
            fullWidth
            variant="filled"
            helperText={errors.invoiceId?.message}
            error={Boolean(errors.invoiceId?.message)}
          />
        </Grid>
      </Grid>

      <Typography variant="body2" mt={1} mb={2}>
        {t('total-licenses')}{' '}
        {currentBalance + (!errors.amount?.message ? Number(values.amount) : 0)}
      </Typography>

      <TextField
        {...register('note')}
        variant="filled"
        fullWidth
        label={t('note-label')}
      />

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button onClick={onCancel} sx={{ marginRight: 2 }}>
          {t('cancel-button-label')}
        </Button>
        <Button variant="contained" type="submit" disabled={!isValid}>
          {t('save-button-label')}
        </Button>
      </Box>
    </form>
  )
}
