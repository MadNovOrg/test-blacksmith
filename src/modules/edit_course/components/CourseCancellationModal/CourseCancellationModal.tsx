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
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { isNumber } from 'lodash-es'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import {
  CurrenciesSymbols,
  CurrencyCode,
  defaultCurrency,
} from '@app/components/CurrencySelector'
import { NumericTextField } from '@app/components/NumericTextField'
import {
  CancelCourseMutation,
  CancelCourseMutationVariables,
  CancellationFeeType,
  Course_Cancellation_Fee_Type_Enum as CourseCancelFeeTypes,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { CancellationTermsTable } from '@app/modules/edit_course/components/CancellationTermsTable'
import { CANCEL_COURSE_MUTATION } from '@app/modules/edit_course/queries/cancel-course'
import { getCancellationTermsFee } from '@app/modules/edit_course/utils/shared'
import { yup } from '@app/schemas'
import { Course } from '@app/types'
import { customFeeFormat } from '@app/util' // 🙃 TODO: replace with generated type

type FormInput = {
  cancellationFeePercent?: number
  cancellationFee?: number
  cancellationReason: string
}

enum OpenCourseCancellationReasons {
  BOOKING_AMENDMENTS_MADE_BY_VENUE = 'booking-amendments-made-by-venue',
  BOOKING_AMENDMENTS_MADE_BY_TEAM_TEACH = 'booking-amendments-made-by-team-teach',
  TRAINER_AVAILABILITY = 'trainer-availability',
  OTHER = 'other',
}

enum CloseCourseCancellationReasons {
  BOOKING_AMENDMENTS_MADE_BY_ORGANIZATION = 'booking-amendments-made-by-organization',
  TRAINER_AVAILABILITY = 'trainer-availability',
  OTHER = 'other',
}

export type CourseCancellationModalProps = {
  course: Course
  onClose: () => void
  onSubmit?: () => void
}

export const CourseCancellationModal: React.FC<
  React.PropsWithChildren<CourseCancellationModalProps>
> = function ({ course, onClose, onSubmit }) {
  const { t } = useTranslation()

  const [feeType, setFeeType] = useState<CourseCancelFeeTypes | null>(null)
  const [reasonType, setReasonType] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const isIndirect = course.type === Course_Type_Enum.Indirect
  const isIndirectBlendedLearning =
    course.type === Course_Type_Enum.Indirect && course.go1Integration

  const showConfirmationCheck =
    course.type === Course_Type_Enum.Open || isIndirectBlendedLearning

  const [{ error, fetching }, cancelCourse] = useMutation<
    CancelCourseMutation,
    CancelCourseMutationVariables
  >(CANCEL_COURSE_MUTATION)

  const emailUpdatedCurrenciesEnabled = useFeatureFlagEnabled(
    'email-updated-currencies',
  )

  const schema = useMemo(() => {
    const cancellationFeePercent = yup.number().required()
    const cancellationReason = yup.string().required()
    const cancellationFee = yup
      .number()
      .nullable()
      .transform(v => (isNaN(v) ? null : v))
      .min(
        0,
        t('common.validation-errors.min-max-num-value', {
          min: 0,
          max: 9999.99,
        }),
      )
      .max(
        9999.99,
        t('common.validation-errors.min-max-num-value', {
          min: 0,
          max: 9999.99,
        }),
      )
      .required(t('common.validation-errors.this-field-is-required'))

    return yup
      .object({
        ...(course.type === Course_Type_Enum.Closed
          ? {
              cancellationReason,
              ...(feeType === CourseCancelFeeTypes.CustomFee
                ? { cancellationFee }
                : { cancellationFeePercent }),
            }
          : { cancellationReason }),
      })
      .required()
  }, [course.type, feeType, t])

  const cancellationReasons = useMemo((): string[] => {
    if (course.type === Course_Type_Enum.Open) {
      return Object.values(OpenCourseCancellationReasons)
    } else {
      return Object.values(CloseCourseCancellationReasons)
    }
  }, [course])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      cancellationReason: '',
    },
  })
  const values = watch()

  const startDate = course.schedule[0].start

  useEffect(() => {
    if (course.cancellationRequest) {
      setReasonType('other')
      setValue('cancellationReason', course.cancellationRequest.reason, {
        shouldValidate: true,
      })
    }
  }, [course.cancellationRequest, setValue])

  useEffect(() => {
    if (feeType === CourseCancelFeeTypes.ApplyCancellationTerms) {
      setValue('cancellationFeePercent', getCancellationTermsFee(startDate))
    } else if (feeType === CourseCancelFeeTypes.NoFees) {
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

  useEffect(() => {
    if (values.cancellationFee)
      setValue('cancellationFee', customFeeFormat(values.cancellationFee))
  }, [setValue, values.cancellationFee, values.cancellationFeePercent])

  const onFormSubmit = async (data: FormInput) => {
    const { cancellationFee, cancellationFeePercent, cancellationReason } = data
    const isCourseTypeIndirect = course.type === Course_Type_Enum.Indirect

    const input = {
      courseId: course.id,
      cancellationReason,
      ...(isCourseTypeIndirect
        ? null
        : {
            ...(Course_Type_Enum.Closed
              ? {
                  cancellationFeeType: feeType,
                  cancellationFee:
                    feeType === CourseCancelFeeTypes.CustomFee
                      ? cancellationFee
                      : cancellationFeePercent,
                }
              : {}),
          }),
    }

    await cancelCourse(input)

    if (onSubmit) {
      onSubmit()
    }
  }

  return (
    <Container data-testid="course-cancellation-modal">
      {isIndirectBlendedLearning ? (
        <>
          <Typography variant="body1" color="grey.600">
            {t(
              'pages.edit-course.cancellation-modal.permanently-cancel-indirect-blended-course-first',
            )}
          </Typography>
          <br />
          <Typography variant="body1" color="grey.600">
            {t(
              'pages.edit-course.cancellation-modal.permanently-cancel-indirect-blended-course-second',
            )}
          </Typography>
        </>
      ) : (
        <Typography variant="body1" color="grey.600">
          {t('pages.edit-course.cancellation-modal.permanently-cancel-course')}
        </Typography>
      )}

      {!isIndirect ? (
        <Typography variant="body1" color="grey.600" mt={1}>
          {t('pages.edit-course.cancellation-modal.finance-invoice-changes')}
          {course.type === Course_Type_Enum.Open
            ? t(
                'pages.edit-course.cancellation-modal.attendees-will-not-incur-cancellation-charges',
              )
            : null}
        </Typography>
      ) : null}
      {course.type === Course_Type_Enum.Closed ? (
        <>
          <Typography variant="h4" fontWeight={600} mt={4}>
            {t('pages.edit-course.cancellation-modal.cancellation-fees-apply')}
          </Typography>

          <RadioGroup
            onChange={(_, v: string) => setFeeType(v as CourseCancelFeeTypes)}
            row
            value={feeType}
            sx={{ mt: 1 }}
          >
            {Object.values(CancellationFeeType).map(value => (
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

          {feeType === CourseCancelFeeTypes.ApplyCancellationTerms ? (
            <CancellationTermsTable
              courseStartDate={new Date(startDate)}
              sx={{ mt: 2 }}
            />
          ) : null}

          {feeType === CourseCancelFeeTypes.CustomFee ? (
            <NumericTextField
              required
              label={t('pages.edit-course.cancellation-modal.fee')}
              {...register('cancellationFee', { valueAsNumber: true })}
              error={Boolean(errors.cancellationFee)}
              helperText={
                Boolean(errors.cancellationFee) &&
                errors.cancellationFee?.message
              }
              sx={{ mt: 2 }}
              inputProps={{ min: 0, max: 100 }}
              InputProps={{
                endAdornment: (
                  <Typography variant="body1" color="grey.600">
                    {emailUpdatedCurrenciesEnabled && course.priceCurrency
                      ? CurrenciesSymbols[course.priceCurrency as CurrencyCode]
                      : CurrenciesSymbols[defaultCurrency]}
                  </Typography>
                ),
              }}
            />
          ) : null}
        </>
      ) : null}
      {!isIndirect ? (
        <TextField
          select
          required
          data-testid="cancel-course-dropdown"
          label={t(
            'pages.edit-course.cancellation-modal.reason-for-cancellation',
          )}
          sx={{ mt: 4 }}
          variant="filled"
          error={Boolean(errors.cancellationReason) && reasonType !== 'other'}
          helperText={
            Boolean(errors.cancellationReason) &&
            reasonType !== 'other' &&
            t('common.validation-errors.this-field-is-required')
          }
          value={reasonType}
          onChange={e => {
            setReasonType(e.target.value)
            setValue(
              'cancellationReason',
              e.target.value !== 'other' ? e.target.value : '',
              { shouldValidate: isSubmitted },
            )
          }}
          fullWidth
        >
          {cancellationReasons.map(option => (
            <MenuItem key={option} value={option}>
              {t(`pages.edit-course.cancellation-modal.reasons.${option}`)}
            </MenuItem>
          ))}
        </TextField>
      ) : null}
      {isIndirect || reasonType === 'other' ? (
        <TextField
          data-testid="cancel-course-reason-input"
          fullWidth
          required
          variant="filled"
          error={!!errors.cancellationReason}
          helperText={
            !!errors.cancellationReason &&
            t('common.validation-errors.this-field-is-required')
          }
          label={
            isIndirect
              ? t('pages.edit-course.cancellation-modal.specify-reason')
              : t(
                  'pages.edit-course.cancellation-modal.reason-for-cancellation',
                )
          }
          inputProps={{
            sx: { height: 40 },
          }}
          sx={{ bgcolor: 'grey.100', my: 2 }}
          {...register('cancellationReason')}
        />
      ) : null}
      {showConfirmationCheck ? (
        <Box mt={4}>
          <FormControlLabel
            label={
              isIndirectBlendedLearning
                ? t(
                    'pages.edit-course.cancellation-modal.cannot-be-undone-confirmation-indirect-blended-learning',
                  )
                : t(
                    'pages.edit-course.cancellation-modal.cannot-be-undone-confirmation',
                  )
            }
            control={<Checkbox />}
            checked={confirmed}
            data-testid="cancel-entire-course-checkbox"
            onChange={(_, v) => setConfirmed(v)}
            sx={{ userSelect: 'none' }}
          />
        </Box>
      ) : null}
      {error && <Alert severity="error">{error.message}</Alert>}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button type="button" variant="text" color="primary" onClick={onClose}>
          {t('pages.edit-course.cancellation-modal.close-modal')}
        </Button>
        <LoadingButton
          loading={fetching}
          disabled={showConfirmationCheck && !confirmed}
          onClick={handleSubmit(onFormSubmit)}
          type="button"
          data-testid="cancel-entire-course-button"
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
        >
          {t('pages.edit-course.cancellation-modal.cancel-entire-course')}
        </LoadingButton>
      </Box>
    </Container>
  )
}
