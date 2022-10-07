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
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  CancelCourseMutation,
  CancelCourseMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { CancellationTermsTable } from '@app/pages/EditCourse/CancellationTermsTable'
import { getCancellationTermsFee } from '@app/pages/EditCourse/utils'
import { CANCEL_COURSE_MUTATION } from '@app/queries/courses/cancel-course'
import { yup } from '@app/schemas'
import { Course, CourseType } from '@app/types'

type FormInput = {
  cancellationFeePercent?: number
  cancellationReason: string
}

enum FeesRadioValue {
  APPLY_CANCELLATION_TERMS = 'apply-cancellation-terms',
  CUSTOM_FEE = 'custom-fee',
  NO_FEES = 'no-fees',
}

enum OpenCourseCancellationReasons {
  BOOKING_AMENDMENTS_MADE_BY_VENUE = 'booking-amendments-made-by-venue',
  BOOKING_AMENDMENTS_MADE_BY_TEAM_TEACH = 'booking-amendments-made-by-team-teach',
  TRAINER_AVAILABLITY = 'trainer-availability',
  OTHER = 'other',
}

enum CloseCourseCancellationReasons {
  BOOKING_AMENDMENTS_MADE_BY_ORGANIZATION = 'booking-amendments-made-by-organization',
  TRAINER_AVAILABLITY = 'trainer-availability',
  OTHER = 'other',
}

export type CourseCancellationModalProps = {
  course: Course
  onClose: () => void
  onSubmit?: () => void
}

export const CourseCancellationModal: React.FC<CourseCancellationModalProps> =
  function ({ course, onClose, onSubmit }) {
    const { t } = useTranslation()
    const fetcher = useFetcher()

    const [loading, setLoading] = useState(false)
    const [feeType, setFeeType] = useState<FeesRadioValue | null>(null)
    const [reasonType, setReasonType] = useState('')
    const [error, setError] = useState('')
    const [confirmed, setConfirmed] = useState(false)

    const schema = useMemo(() => {
      const cancellationFeePercent = yup.number().required()
      const cancellationReason = yup.string().required()
      return yup
        .object(
          course.type === CourseType.CLOSED
            ? { cancellationFeePercent, cancellationReason }
            : { cancellationReason }
        )
        .required()
    }, [course])

    const cancellationReasons = useMemo((): string[] => {
      if (course.type === CourseType.OPEN) {
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
        await fetcher<CancelCourseMutation, CancelCourseMutationVariables>(
          CANCEL_COURSE_MUTATION,
          {
            courseId: course.id,
            cancellationFeePercent: data.cancellationFeePercent,
            cancellationReason: data.cancellationReason,
          }
        )
        if (onSubmit) {
          onSubmit()
        }
      } catch (e: unknown) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    const isIndirect = course.type === CourseType.INDIRECT

    return (
      <Container>
        <Typography variant="body1" color="grey.600">
          {t('pages.edit-course.cancellation-modal.description-p-1')}
        </Typography>

        {course.type !== CourseType.INDIRECT ? (
          <Typography variant="body1" color="grey.600" mt={1}>
            {t('pages.edit-course.cancellation-modal.description-p-2')}
            {course.type === CourseType.OPEN
              ? t('pages.edit-course.cancellation-modal.description-p-3')
              : null}
          </Typography>
        ) : null}

        {course.type === CourseType.CLOSED ? (
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

            {feeType === FeesRadioValue.APPLY_CANCELLATION_TERMS ? (
              <CancellationTermsTable
                courseStartDate={startDate}
                sx={{ mt: 2 }}
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
          </>
        ) : null}

        {!isIndirect ? (
          <TextField
            select
            required
            label={t(
              'pages.edit-course.cancellation-modal.reason-for-cancellation'
            )}
            sx={{ mt: 4 }}
            variant="standard"
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
                { shouldValidate: isSubmitted }
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
            fullWidth
            required
            variant="standard"
            error={!!errors.cancellationReason}
            helperText={
              !!errors.cancellationReason &&
              t('common.validation-errors.this-field-is-required')
            }
            label={
              isIndirect
                ? t('pages.edit-course.cancellation-modal.specify-reason')
                : t(
                    'pages.edit-course.cancellation-modal.reason-for-cancellation'
                  )
            }
            inputProps={{
              sx: { height: 40 },
            }}
            sx={{ bgcolor: 'grey.100', my: 2 }}
            {...register('cancellationReason')}
          />
        ) : null}

        {course.type === CourseType.OPEN ? (
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
            disabled={course.type === CourseType.OPEN && !confirmed}
            onClick={handleSubmit(onFormSubmit)}
            type="button"
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
