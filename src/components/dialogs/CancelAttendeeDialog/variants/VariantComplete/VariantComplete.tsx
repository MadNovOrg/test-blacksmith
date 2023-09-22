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
import { isNumber } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { CourseTitleAndDuration } from '@app/components/CourseTitleAndDuration'
import { Dialog } from '@app/components/dialogs'
import {
  Actions,
  CancellationFeeDetails,
  CancellationFeeType,
  Title,
} from '@app/components/dialogs/CancelAttendeeDialog/components'
import { FormInput } from '@app/components/dialogs/CancelAttendeeDialog/types'
import { useAuth } from '@app/context/auth'
import {
  CancelIndividualFromCourseMutation,
  CancelIndividualFromCourseMutationVariables,
} from '@app/generated/graphql'
import { getCancellationTermsFee } from '@app/pages/EditCourse/shared'
import { CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION } from '@app/queries/participants/cancel-individual-from-course'
import { yup } from '@app/schemas'
import { Course, CourseParticipant } from '@app/types'
import { capitalize } from '@app/util'

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
    CancellationFeeType.APPLY_CANCELLATION_TERMS
  )
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
  const startDate = course.schedule?.[0]?.start

  useEffect(() => {
    if (feeType === CancellationFeeType.APPLY_CANCELLATION_TERMS) {
      setValue('cancellationFeePercent', getCancellationTermsFee(startDate))
    } else if (feeType === CancellationFeeType.NO_FEES) {
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

  const [{ fetching, error }, cancelIndividualFromCourse] = useMutation<
    CancelIndividualFromCourseMutation,
    CancelIndividualFromCourseMutationVariables
  >(CANCEL_INDIVIDUAL_FROM_COURSE_MUTATION)

  const onFormSubmit = async (data: FormInput) => {
    await cancelIndividualFromCourse({
      courseId: course.id,
      profileId: participant.profile.id,
      reason: capitalize(data.cancellationReason),
      fee: Number(data.cancellationFeePercent),
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
              disabled={!confirmed && !acl.isTTAdmin()}
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
              }}
            />
          )}

          <CancellationFeeDetails
            startDate={startDate}
            register={register}
            errors={errors}
            feeType={feeType}
            showEditFeePercent={acl.isTTAdmin()}
            onSetFeeType={setFeeType}
          />

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

          {!acl.isTTAdmin() ? (
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
