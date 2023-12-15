import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material'
import Big from 'big.js'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { CourseTitleAndDuration } from '@app/components/CourseTitleAndDuration'
import { Dialog } from '@app/components/dialogs'
import {
  Actions,
  CancellationFeeDetails,
  Title,
} from '@app/components/dialogs/CancelAttendeeDialog/components'
import { FormInput } from '@app/components/dialogs/CancelAttendeeDialog/types'
import { InfoRow } from '@app/components/InfoPanel'
import { useAuth } from '@app/context/auth'
import {
  CancelIndividualFromCourseMutation,
  CancelIndividualFromCourseMutationVariables,
  CancellationFeeType,
} from '@app/generated/graphql'
import { getCancellationTermsFee } from '@app/pages/EditCourse/shared'
import { CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION } from '@app/queries/participants/cancel-individual-from-course'
import { yup } from '@app/schemas'
import { Course, CourseParticipant } from '@app/types'
import { capitalize, customFeeFormat } from '@app/util'

export type VariantCompleteProps = {
  participant: CourseParticipant
  course: Course
  onClose: () => void
  onSubmit: () => void
}

export const VariantComplete = ({
  participant,
  course,
  onClose,
  onSubmit,
}: VariantCompleteProps) => {
  const { t } = useTranslation()

  const { acl } = useAuth()
  const [feeType, setFeeType] = useState<CancellationFeeType>(
    CancellationFeeType.ApplyCancellationTerms
  )
  const [confirmed, setConfirmed] = useState(false)

  const schema = useMemo(() => {
    return yup
      .object({
        cancellationFee: yup
          .number()
          .nullable()
          .transform(v => (isNaN(v) ? null : v))
          .min(
            0,
            t('common.validation-errors.min-max-num-value', {
              min: 0,
              max: 9999.99,
            })
          )
          .max(
            9999.99,
            t('common.validation-errors.min-max-num-value', {
              min: 0,
              max: 9999.99,
            })
          )
          .when('feeType', ([feeType], schema) => {
            return feeType === CancellationFeeType.CustomFee
              ? schema.required(
                  t('common.validation-errors.this-field-is-required')
                )
              : schema
          }),

        cancellationFeePercent: yup
          .number()
          .when('feeType', ([feeType], schema) => {
            return feeType !== CancellationFeeType.CustomFee
              ? schema.required('required')
              : schema
          }),

        cancellationReason: yup
          .string()
          .required(
            t('common.validation-errors.required-field', {
              name: t('common.cancellation-reason'),
            })
          )
          .max(
            300,
            t('common.validation-errors.maximum-chars-limit', { number: 300 })
          ),
        feeType: yup
          .mixed<CancellationFeeType>()
          .oneOf(Object.values(CancellationFeeType))
          .required(),
      })
      .required()
  }, [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      cancellationFee: 0,
      cancellationFeePercent: 0,
      cancellationReason: '',
    },
  })
  const values = watch()
  const startDate = course.schedule?.[0]?.start

  useEffect(() => {
    setValue('feeType', feeType)

    if (feeType === CancellationFeeType.ApplyCancellationTerms) {
      setValue('cancellationFeePercent', getCancellationTermsFee(startDate))
    } else if (feeType === CancellationFeeType.NoFees) {
      setValue('cancellationFeePercent', 0)
    }
  }, [feeType, setValue, startDate])

  useEffect(() => {
    setValue('cancellationFee', customFeeFormat(values.cancellationFee))
  }, [setValue, values.cancellationFee, values.cancellationFeePercent])

  const [{ fetching, error }, cancelIndividualFromCourse] = useMutation<
    CancelIndividualFromCourseMutation,
    CancelIndividualFromCourseMutationVariables
  >(CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION)

  const onFormSubmit = async (data: FormInput) => {
    await cancelIndividualFromCourse({
      courseId: course.id,
      profileId: participant.profile.id,
      reason: capitalize(data.cancellationReason),
      fee:
        feeType === CancellationFeeType.CustomFee
          ? data.cancellationFee
          : Number(data.cancellationFeePercent),
      feeType,
    })

    onSubmit?.()
    onClose()
  }

  return (
    <Container>
      <Dialog
        open={true}
        onClose={onClose}
        slots={{
          Title: () => (
            <Title
              fullName={participant.profile.fullName}
              courseCode={course.course_code}
            />
          ),
          Actions: () => (
            <Actions
              disabled={!confirmed && !(acl.isTTAdmin() || acl.isTTOps())}
              loading={fetching}
              onClose={onClose}
              onSubmit={handleSubmit(onFormSubmit)}
            />
          ),
        }}
        maxWidth={800}
      >
        <Container>
          <Typography sx={{ mb: 1 }} variant="body1" color="grey.600">
            {t(`pages.individual-cancellation.description`)}
          </Typography>
          {course && (
            <CourseTitleAndDuration
              showCourseDuration={false}
              course={{
                id: course.id,
                course_code: course.course_code,
                start: course.dates.aggregate.start.date,
                end: course.dates.aggregate.end.date,
                level: course.level,
                reaccreditation: course.reaccreditation,
              }}
            />
          )}

          <CancellationFeeDetails
            startDate={startDate}
            register={register}
            errors={errors}
            feeType={feeType}
            showEditFeePercent={acl.isTTAdmin() || acl.isTTOps()}
            onSetFeeType={setFeeType}
          />

          {feeType === CancellationFeeType.CustomFee ? (
            <Box sx={{ mt: 2 }}>
              <InfoRow
                label={t('common.vat')}
                value={t('currency', {
                  amount: values.cancellationFee
                    ? new Big((values.cancellationFee * 20) / 100)
                        .round(2)
                        .toNumber()
                    : '0',
                })}
              />

              <InfoRow>
                <Typography fontWeight={600}>
                  {t('amount-due-currency')}
                </Typography>
                <Typography fontWeight={600}>
                  {t('currency', {
                    amount: values.cancellationFee
                      ? values.cancellationFee +
                        new Big((values.cancellationFee * 20) / 100)
                          .round(2)
                          .toNumber()
                      : 0,
                  })}
                </Typography>
              </InfoRow>
            </Box>
          ) : null}

          <TextField
            data-testid="reasonForCancellation-input"
            fullWidth
            required
            variant="filled"
            error={!!errors.cancellationReason}
            helperText={<>{errors.cancellationReason?.message}</>}
            label={t(
              'pages.edit-course.cancellation-modal.reason-for-cancellation'
            )}
            inputProps={{
              sx: { height: 20 },
            }}
            sx={{ bgcolor: 'grey.100', my: 2 }}
            {...register('cancellationReason')}
          />

          {!(acl.isTTAdmin() || acl.isTTOps()) ? (
            <Box mt={2}>
              <FormControlLabel
                data-testid="confirmation-checkbox"
                label={t(
                  'pages.edit-course.cancellation-modal.cannot-be-undone-confirmation'
                )}
                control={<Checkbox />}
                checked={confirmed}
                onChange={(_, v) => setConfirmed(v)}
                sx={{ userSelect: 'none' }}
              />
            </Box>
          ) : null}

          {error && <Alert severity="error">{error.message}</Alert>}
        </Container>
      </Dialog>
    </Container>
  )
}
