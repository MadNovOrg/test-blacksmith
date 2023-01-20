import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { TFunction } from 'i18next'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { InferType } from 'yup'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { yup } from '@app/schemas'

export enum Type {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

function schema(t: TFunction, currentBalance: number) {
  return yup.object({
    type: yup.mixed().oneOf(['ADD', 'REMOVE']),
    amount: yup
      .number()
      .typeError(t('error-amount-positive'))
      .positive(t('error-amount-positive'))
      .when('type', {
        is: (type: string) => type === 'REMOVE',
        then: schema =>
          schema.max(currentBalance, value =>
            t('error-amount-max', { max: value.max })
          ),
      })
      .required(t('erorr-amount-required')),
    note: yup.string(),
    issueRefund: yup.bool(),
    invoiceId: yup.string().when(['type', 'issueRefund'], {
      is: (type: string, issueRefund: boolean) =>
        type === Type.ADD || issueRefund === true,
      then: schema => schema.required(t('error-invoice-required')),
    }),
    licensePrice: yup
      .number()
      .nullable(true)
      .typeError(t('error-license-price-positive'))
      .positive(t('error-license-price-positive'))
      .when('issueRefund', {
        is: true,
        then: schema => schema.required(t('error-license-price-required')),
      }),
  })
}

export type FormData = InferType<ReturnType<typeof schema>>

type Props = {
  onSave?: (data: FormData) => void
  onCancel?: () => void
  currentBalance: number
  saving?: boolean
}

export const ManageLicensesForm: React.FC<Props> = ({
  onSave,
  onCancel,
  currentBalance,
  saving,
}) => {
  const { t } = useScopedTranslation('pages.org-details.tabs.licenses.form')

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors, isValid },
    setValue,
    resetField,
  } = useForm<FormData>({
    resolver: yupResolver(schema(t, currentBalance)),
    mode: 'onChange',
    defaultValues: {
      amount: undefined,
      invoiceId: '',
      note: '',
      licensePrice: null,
      type: Type.ADD,
      issueRefund: false,
    },
  })

  const values = watch()

  const submit: SubmitHandler<FormData> = data => {
    if (typeof onSave === 'function') {
      onSave(data)
    }
  }

  useEffect(() => {
    if (!values.issueRefund) {
      setValue('invoiceId', '')
    }
  }, [values.issueRefund, setValue])

  useEffect(() => {
    resetField('amount')
    resetField('invoiceId')
    resetField('note')
    resetField('issueRefund')
    resetField('licensePrice')
  }, [values.type, resetField])

  const newBalance =
    currentBalance +
    (!errors.amount?.message && Number(values.amount)
      ? values.type === Type.ADD
        ? Number(values.amount)
        : -Number(values.amount)
      : 0)

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
        {values.type === Type.ADD ? (
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
        ) : null}
      </Grid>

      <Typography variant="body2" mt={1} mb={2}>
        {t('total-licenses')} {newBalance}
      </Typography>

      <TextField
        {...register('note')}
        variant="filled"
        fullWidth
        label={t('note-label')}
      />

      {values.type === Type.REMOVE ? (
        <>
          <Controller
            name="issueRefund"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} />}
                label={t('issue-refund-label')}
                sx={{ mb: 1, mt: 1 }}
                data-testid="issue-refund-checkbox"
              />
            )}
          />

          {values.issueRefund ? (
            <Grid container spacing={2}>
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
              <Grid item xs={6}>
                <TextField
                  {...register('licensePrice')}
                  label={t('license-price-label')}
                  fullWidth
                  variant="filled"
                  helperText={errors.licensePrice?.message}
                  error={Boolean(errors.licensePrice?.message)}
                />
              </Grid>
            </Grid>
          ) : null}
        </>
      ) : null}

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button onClick={onCancel} sx={{ marginRight: 2 }}>
          {t('cancel-button-label')}
        </Button>
        <LoadingButton
          loading={saving}
          variant="contained"
          type="submit"
          disabled={!isValid}
        >
          {t('save-button-label')}
        </LoadingButton>
      </Box>
    </form>
  )
}
