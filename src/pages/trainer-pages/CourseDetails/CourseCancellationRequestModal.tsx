import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import {
  RequestCourseCancellationMutation,
  RequestCourseCancellationMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { CancellationTermsTable } from '@app/pages/EditCourse/CancellationTermsTable'
import { REQUEST_COURSE_CANCELLATION_MUTATION } from '@app/queries/courses/request-course-cancellation'
import { yup } from '@app/schemas'
import { Course } from '@app/types'

type FormInput = {
  cancellationReason: string
}

export type CourseCancellationRequestModalProps = {
  course: Course
  onClose: () => void
  onSubmit?: () => void
}

export const CourseCancellationRequestModal: React.FC<CourseCancellationRequestModalProps> =
  function ({ course, onClose, onSubmit }) {
    const { t } = useTranslation()
    const fetcher = useFetcher()
    const { profile } = useAuth()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [confirmed, setConfirmed] = useState(false)

    const schema = useMemo(() => {
      return yup
        .object({ cancellationReason: yup.string().required() })
        .required()
    }, [])

    const {
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

    const onFormSubmit = async (data: FormInput) => {
      setLoading(true)

      try {
        await fetcher<
          RequestCourseCancellationMutation,
          RequestCourseCancellationMutationVariables
        >(REQUEST_COURSE_CANCELLATION_MUTATION, {
          cancellationRequest: {
            course_id: course.id,
            requested_by: profile?.id,
            reason: data.cancellationReason,
          },
        })
        if (onSubmit) {
          onSubmit()
        }
      } catch (e: unknown) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    return (
      <Container>
        <Typography variant="body1" color="grey.600">
          {t('pages.course-details.request-cancellation-modal.description')}
        </Typography>

        <Alert severity="warning" variant="outlined" sx={{ mt: 4 }}>
          {t('pages.course-details.request-cancellation-modal.warning')}
        </Alert>

        <CancellationTermsTable courseStartDate={startDate} sx={{ mt: 4 }} />

        <TextField
          fullWidth
          required
          variant="standard"
          error={!!errors.cancellationReason}
          helperText={
            !!errors.cancellationReason &&
            t('common.validation-errors.this-field-is-required')
          }
          label={t(
            'pages.edit-course.cancellation-modal.reason-for-cancellation'
          )}
          inputProps={{
            sx: { height: 40 },
          }}
          sx={{ bgcolor: 'grey.100', my: 2 }}
          value={values.cancellationReason}
          onChange={e =>
            setValue('cancellationReason', e.target.value, {
              shouldValidate: isSubmitted,
            })
          }
        />

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
            disabled={!confirmed}
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
