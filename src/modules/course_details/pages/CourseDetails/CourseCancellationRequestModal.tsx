import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation, Trans } from 'react-i18next'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  RequestCourseCancellationMutation,
  RequestCourseCancellationMutationVariables,
} from '@app/generated/graphql'
import { CancellationTermsTable } from '@app/pages/EditCourse/components/CancellationTermsTable'
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

export const CourseCancellationRequestModal: React.FC<
  React.PropsWithChildren<CourseCancellationRequestModalProps>
> = function ({ course, onClose, onSubmit }) {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const [confirmed, setConfirmed] = useState(false)

  const [{ fetching: loading, error }, requestCourseCancellation] = useMutation<
    RequestCourseCancellationMutation,
    RequestCourseCancellationMutationVariables
  >(REQUEST_COURSE_CANCELLATION_MUTATION)

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
    requestCourseCancellation({
      cancellationRequest: {
        course_id: course.id,
        requested_by: profile?.id,
        reason: data.cancellationReason,
      },
    })
    if (onSubmit) {
      onSubmit()
    }
  }

  return (
    <Container>
      <Typography variant="body1" color="grey.600">
        {t('pages.course-details.request-cancellation-modal.description')}
      </Typography>

      <Alert severity="warning" variant="outlined" sx={{ mt: 4 }}>
        <Trans
          i18nKey="pages.course-details.request-cancellation-modal.warning"
          components={{
            termsOfBusinessLink: (
              <Link
                target="_blank"
                rel="noreferrer"
                href={`${
                  import.meta.env.VITE_BASE_WORDPRESS_URL
                }/policies-procedures/terms-of-business/`}
              />
            ),
          }}
        />
      </Alert>

      <CancellationTermsTable
        courseStartDate={new Date(startDate)}
        sx={{ mt: 4 }}
      />

      <TextField
        fullWidth
        required
        variant="filled"
        data-testid="cancel-course-reason"
        error={!!errors.cancellationReason}
        helperText={
          !!errors.cancellationReason &&
          t('common.validation-errors.this-field-is-required')
        }
        label={t(
          'pages.course-details.request-cancellation-modal.reason-for-request',
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
            'pages.course-details.request-cancellation-modal.agree-terms-confirmation',
          )}
          control={<Checkbox />}
          data-testid="request-cancel-checkbox"
          checked={confirmed}
          onChange={(_, v) => setConfirmed(v)}
          sx={{ userSelect: 'none' }}
        />
      </Box>

      {error && <Alert severity="error">{error.message}</Alert>}

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button type="button" variant="text" color="primary" onClick={onClose}>
          {t('pages.edit-course.cancellation-modal.close-modal')}
        </Button>
        <LoadingButton
          loading={loading}
          disabled={!confirmed}
          onClick={handleSubmit(onFormSubmit)}
          data-testid="request-cancel-submit-button"
          type="button"
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
        >
          {t('pages.course-details.request-cancellation-modal.submit-request')}
        </LoadingButton>
      </Box>
    </Container>
  )
}
