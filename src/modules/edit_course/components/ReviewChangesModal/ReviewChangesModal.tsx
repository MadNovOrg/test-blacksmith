import { yupResolver } from '@hookform/resolvers/yup'
import { Alert } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { TFunction } from 'i18next'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { noop } from 'ts-essentials'
import { InferType } from 'yup'

import { Dialog } from '@app/components/dialogs'
import { FeesForm, schema as feesSchema } from '@app/components/FeesForm'
import { Course_Level_Enum, TransferFeeType } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { yup } from '@app/schemas'

import type { CourseDiff } from '../../utils/shared'
import { CourseDiffTable } from '../CourseDiffTable'
import { ReschedulingTermsTable } from '../ReschedulingTermsTable'

const INFO_EMAIL = import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS

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
  level: Course_Level_Enum
  priceCurrency: string | null | undefined
}

export const ReviewChangesModal: React.FC<React.PropsWithChildren<Props>> = ({
  onCancel = noop,
  onConfirm = noop,
  diff,
  open = false,
  withFees = false,
  children,
  alignedWithProtocol = true,
  level,
  priceCurrency,
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
                  priceCurrency={priceCurrency}
                >
                  <ReschedulingTermsTable
                    startDate={dateDiff.newValue[0]}
                    level={level}
                  />
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
              data-testid="reasonForChange-input"
            />

            <Box display="flex" justifyContent="space-between" mt={5}>
              <Button onClick={onCancel}>{t('cancel-btn-text')}</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!formState.isValid}
                data-testid="confirmChanges-button"
              >
                {t('confirm-btn-text')}
              </Button>
            </Box>
          </form>
        </FormProvider>
      ) : (
        <>
          <Alert severity="warning" variant="outlined">
            <Typography variant="body1" fontWeight={600}>
              <Trans
                i18nKey="protocol-not-met"
                t={t}
                values={{ email: INFO_EMAIL }}
              >
                <Link href={`mailto:${INFO_EMAIL}`} component="a" />
              </Trans>
            </Typography>
          </Alert>

          <Button onClick={onCancel} sx={{ mt: 2 }}>
            {t('cancel-btn-text')}
          </Button>
        </>
      )}
    </Dialog>
  )
}
