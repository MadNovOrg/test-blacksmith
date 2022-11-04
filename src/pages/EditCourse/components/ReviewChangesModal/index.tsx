import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { TFunction } from 'i18next'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { noop } from 'ts-essentials'
import { InferType } from 'yup'

import { Dialog } from '@app/components/Dialog'
import { FeesForm, schema as feesSchema } from '@app/components/FeesForm'
import { TransferFeeType } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { yup } from '@app/schemas'

import { CourseDiffTable } from '../../CourseDiffTable'
import { CourseDiff } from '../../types'
import { ReschedulingTermsTable } from '../ReschedulingTermsTable'

const TRAINING_EMAIL = import.meta.env.VITE_TT_TRAINING_EMAIL_ADDRESS

function schema(t: TFunction, withFees = false) {
  const defaultSchema = yup.object({
    reason: yup.string().required(t('error-reason-required-field')),
  })

  let combinedSchema = defaultSchema

  if (withFees) {
    combinedSchema = defaultSchema.concat(feesSchema)
  }

  return combinedSchema
}

export type FormValues = InferType<
  ReturnType<typeof schema> & typeof feesSchema
>

type Props = {
  onCancel?: () => void
  onConfirm?: (data: FormValues) => void
  diff: CourseDiff[]
  open?: boolean
  withFees?: boolean
  alignedWithProtocol?: boolean
}

export const ReviewChangesModal: React.FC<Props> = ({
  onCancel = noop,
  onConfirm = noop,
  diff,
  open = false,
  withFees = false,
  children,
  alignedWithProtocol = true,
}) => {
  const { t } = useScopedTranslation('pages.edit-course.review-changes-modal')

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(t, withFees)),
    mode: 'onChange',
  })

  const { register, formState, handleSubmit } = methods

  const onSubmit: SubmitHandler<FormValues> = data => {
    onConfirm(data)
    onCancel()
  }

  const dateDiff = diff.find(d => d.type === 'date')

  return (
    <Dialog
      open={open}
      maxWidth={700}
      title={
        <Typography variant="h3" color="grey.800">
          {t('title')}
        </Typography>
      }
      onClose={onCancel}
    >
      {alignedWithProtocol ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {children ? <Box mb={2}>{children}</Box> : null}
            <Typography color="dimGrey.main" mb={2}>
              {t('description')}
            </Typography>

            <CourseDiffTable diff={diff} />

            {withFees && dateDiff && Array.isArray(dateDiff.newValue) ? (
              <Box mt={2} mb={2}>
                <FeesForm
                  optionLabels={{
                    [TransferFeeType.ApplyTerms]: t('apply-terms-option'),
                  }}
                >
                  <ReschedulingTermsTable startDate={dateDiff.newValue[0]} />
                </FeesForm>
              </Box>
            ) : null}

            <TextField
              placeholder={t('reason-field-placeholder')}
              fullWidth
              variant="filled"
              error={Boolean(formState.errors.reason?.message)}
              helperText={formState.errors.reason?.message}
              {...register('reason')}
            />

            <Box display="flex" justifyContent="space-between" mt={5}>
              <Button onClick={onCancel}>{t('cancel-btn-text')}</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!formState.isValid}
              >
                {t('confirm-btn-text')}
              </Button>
            </Box>
          </form>
        </FormProvider>
      ) : (
        <>
          <Typography>
            {t('protocol-not-met')}{' '}
            <Link href={`mailto:${TRAINING_EMAIL}`} component="a">
              {TRAINING_EMAIL}
            </Link>
          </Typography>

          <Button onClick={onCancel} sx={{ mt: 2 }}>
            {t('cancel-btn-text')}
          </Button>
        </>
      )}
    </Dialog>
  )
}
