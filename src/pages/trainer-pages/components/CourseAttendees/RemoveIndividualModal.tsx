import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { isNumber } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import {
  CancelIndividualFromCourseMutation,
  CancelIndividualFromCourseMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { CancellationTermsTable } from '@app/pages/EditCourse/CancellationTermsTable'
import { getCancellationTermsFee } from '@app/pages/EditCourse/utils'
import { CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION } from '@app/queries/participants/cancel-individual-from-course'
import { yup } from '@app/schemas'
import { Course, CourseParticipant } from '@app/types'
import { capitalize } from '@app/util'

type FormInput = {
  cancellationFeePercent: number
  cancellationReason: string
}

enum FeesRadioValue {
  APPLY_CANCELLATION_TERMS = 'apply-cancellation-terms',
  CUSTOM_FEE = 'custom-fee',
  NO_FEES = 'no-fees',
}

export type RemoveIndividualModalProps = {
  participant: CourseParticipant
  course: Course
  onClose: () => void
  onSave: () => void
}

export const RemoveIndividualModal = ({
  participant,
  course,
  onClose,
  onSave,
}: RemoveIndividualModalProps) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { acl } = useAuth()
  const [feeType, setFeeType] = useState<FeesRadioValue>(
    FeesRadioValue.APPLY_CANCELLATION_TERMS
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const schema = useMemo(() => {
    return yup
      .object({
        cancellationFeePercent: yup.number().required(),
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
      cancellationReason: '',
      cancellationFeePercent: 0,
    },
  })
  const values = watch()
  const startDate = course.schedule[0].start

  useEffect(() => {
    if (feeType === FeesRadioValue.APPLY_CANCELLATION_TERMS) {
      setValue('cancellationFeePercent', getCancellationTermsFee(startDate))
    } else if (feeType === FeesRadioValue.NO_FEES) {
      setValue('cancellationFeePercent', 0)
    }
  }, [feeType, setValue, startDate])

  useEffect(() => {
    if (isNumber(values.cancellationFeePercent)) {
      if (values.cancellationFeePercent < 0) {
        setValue('cancellationFeePercent', 0)
      }
      if (values.cancellationFeePercent > 100) {
        setValue('cancellationFeePercent', 100)
      }
    }
  }, [setValue, values.cancellationFeePercent])

  const onFormSubmit = async (data: FormInput) => {
    setLoading(true)

    try {
      await fetcher<
        CancelIndividualFromCourseMutation,
        CancelIndividualFromCourseMutationVariables
      >(CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION, {
        courseId: course.id,
        profileId: participant.profile.id,
        reason: capitalize(data.cancellationReason),
        fee: data.cancellationFeePercent,
      })

      if (onSave) {
        onSave()
      }
      onClose()
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Dialog
        open={true}
        onClose={onClose}
        title={
          <Typography variant="h3" fontWeight={600}>
            {t('pages.individual-cancellation.title', {
              name: participant.profile.fullName,
              course: course.course_code,
            })}
          </Typography>
        }
        maxWidth={800}
      >
        <Container>
          <Typography variant="body1" color="grey.600">
            {t('pages.individual-cancellation.description')}
          </Typography>

          {acl.isTTAdmin() ? (
            <>
              <Typography variant="h4" fontWeight={600} mt={4}>
                {t('pages.edit-course.cancellation-modal.will-any-fees-apply')}
              </Typography>
              <RadioGroup
                onChange={(event, v: string) => setFeeType(v as FeesRadioValue)}
                row
                value={feeType}
                sx={{ mt: 1 }}
              >
                {Object.values(FeesRadioValue).map(value => (
                  <FormControlLabel
                    key={value}
                    value={value}
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
                    label={t(`pages.edit-course.cancellation-modal.${value}`)}
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

          {feeType === FeesRadioValue.APPLY_CANCELLATION_TERMS ? (
            <CancellationTermsTable
              courseStartDate={new Date(startDate)}
              sx={{ mt: 4 }}
            />
          ) : null}
          {feeType === FeesRadioValue.CUSTOM_FEE ? (
            <TextField
              required
              label={t('pages.edit-course.cancellation-modal.fee')}
              type="number"
              {...register('cancellationFeePercent', { valueAsNumber: true })}
              error={Boolean(errors.cancellationFeePercent)}
              helperText={
                Boolean(errors.cancellationFeePercent) &&
                t('common.validation-errors.this-field-is-required')
              }
              sx={{ mt: 2 }}
              inputProps={{ min: 0, max: 100 }}
              InputProps={{
                endAdornment: (
                  <React.Fragment>
                    <Typography variant="body1" color="grey.600">
                      %
                    </Typography>
                  </React.Fragment>
                ),
              }}
            />
          ) : null}

          <TextField
            fullWidth
            required
            variant="standard"
            error={!!errors.cancellationReason}
            helperText={errors.cancellationReason?.message}
            label={t(
              'pages.edit-course.cancellation-modal.reason-for-cancellation'
            )}
            inputProps={{
              sx: { height: 40 },
            }}
            sx={{ bgcolor: 'grey.100', my: 2 }}
            {...register('cancellationReason')}
          />

          {!acl.isTTAdmin() ? (
            <Box mt={4}>
              <FormControlLabel
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

          {error && <Alert severity="error">{error}</Alert>}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              type="button"
              variant="text"
              color="primary"
              onClick={onClose}
            >
              {t('pages.edit-course.cancellation-modal.never-mind')}
            </Button>
            <LoadingButton
              loading={loading}
              disabled={!confirmed && !acl.isTTAdmin()}
              onClick={handleSubmit(onFormSubmit)}
              type="button"
              variant="contained"
              color="error"
              sx={{ ml: 1 }}
            >
              {t('pages.individual-cancellation.remove-attendee')}
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </Container>
  )
}
